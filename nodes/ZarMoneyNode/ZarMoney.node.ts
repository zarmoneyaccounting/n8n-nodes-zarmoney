import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  IDataObject
} from 'n8n-workflow';

import { NodeConnectionTypes, /*NodeOperationError,*/ LoggerProxy as Logger } from 'n8n-workflow';

import {
  zarmoneyApiRequest,
  toQueryString,
  expandUserProperty
} from './GenericFunctions';

import {
  userOps,
  estimateOps,
  invoiceOps,
  salesOrderOps
} from './Ops';

export class ZarMoney implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'ZarMoney',
    name: 'zarmoney',
    icon: 'file:zarmoney.svg',
    group: ['input'],
    version: 1,
    description: 'Consume ZarMoney API',
    defaults: {
      name: 'ZarMoney',
    },
    inputs: [NodeConnectionTypes.Main],
    outputs: [NodeConnectionTypes.Main],
    usableAsTool: true,
    credentials: [{
      name: 'zarmoneyOAuth2Api',
      required: true,
      displayOptions: {
        show: {
          authentication: ['oAuth2'],
        },
      },
    }],
    properties: [
      {
        displayName: 'Authentication',
        name: 'authentication',
        type: 'options',
        options: [
          {
            name: 'OAuth2',
            value: 'oAuth2',
          },
        ],
        default: 'oAuth2',
      },
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'User',
            value: 'user'
          },
          {
            name: 'Estimate',
            value: 'estimate'
          },
          {
            name: 'Invoice',
            value: 'invoice'
          },
          {
            name: 'Sales Order',
            value: 'salesOrder'
          },
        ],
        default: 'estimate'
      },
      ...userOps,
      ...estimateOps,
      ...invoiceOps,
      ...salesOrderOps
    ],
  };


  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const returnData: INodeExecutionData[] = [];
    const types = {
      estimate: 'Quote',
      invoice: 'Invoice',
      salesOrder: 'SalesOrder'
    };

    const operation = this.getNodeParameter('operation', 0);
    const resource = this.getNodeParameter('resource', 0);
    const filters = this.getNodeParameter('filters', 0, null);
    const expandUserInfo = this.getNodeParameter('expandUserInfo', 0, false);

    let users = null;
    if (expandUserInfo) {
      users = await zarmoneyApiRequest.call(this, 'GET', `/users`, {});
    }

    const items = this.getInputData();
    for (let i = 0; i < items.length; i++) {
      const params: Record<string, any> = {};

      let endpoint: string = '';
      switch (resource) {
        case 'user':
          endpoint = '/users';
          if (operation === 'getAll') {
            params.active = true;
          } else if (operation === 'get') {
            endpoint += `/${this.getNodeParameter('id', i)}`;
          }
          break;

        case 'estimate':
        case 'invoice':
        case 'salesOrder':
          endpoint = '/sales';
          if (operation === 'getAll') {
            params.saleType = types[resource];
            params.isVoid = false;
          } else if (operation === 'get') {
            endpoint += `/${this.getNodeParameter('id', i)}`;
          }
          break;
      }

      if (filters) {
        const mergedParams = Object.assign({}, params, filters);
        endpoint += '?' + toQueryString(mergedParams);
      }

      Logger.info(`-------------------------`);
      Logger.info(`Operation: ${operation}`);
      Logger.info(`Resource: ${resource}`);
      Logger.info(`Endpoint: ${endpoint}`);

      try {
        const responseData = await zarmoneyApiRequest.call(this, 'GET', endpoint, {});
        switch (resource) {
          case 'estimate':
          case 'invoice':
          case 'salesOrder':
            if (users?.length > 0 && (operation === 'getAll' || operation === 'get')) {
              expandUserProperty(users, responseData, 'salespersonId', 'salesperson');
              expandUserProperty(users, responseData, 'createdBy', 'createdByUser');
            }
            break;
        }

        const executionData = this.helpers.constructExecutionMetaData(
          this.helpers.returnJsonArray(responseData as IDataObject[]),
          { itemData: { item: i } },
        );

        returnData.push(...executionData);
      } catch (error) {
        Logger.error(error);
      }
    }

    return [returnData];
  }
}