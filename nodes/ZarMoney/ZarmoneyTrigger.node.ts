import type {
  IHookFunctions,
  IWebhookFunctions,
  IDataObject,
  INodeType,
  INodeTypeDescription,
  IWebhookResponseData,
} from 'n8n-workflow';
import { NodeConnectionTypes, /*NodeOperationError,*/ LoggerProxy as Logger } from 'n8n-workflow';

import { zarmoneyApiRequest, decapitalizeFirstLetter } from './GenericFunctions';

export class ZarmoneyTrigger implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'ZarMoney Trigger',
    name: 'zarmoneyTrigger',
    icon: 'file:zarmoney.svg',
    group: ['trigger'],
    version: 1,
    description: 'Starts the workflow when ZarMoney events occur.',
    defaults: {
      name: 'ZarMoney Trigger',
    },
    inputs: [],
    outputs: [NodeConnectionTypes.Main],
    credentials: [
      {
        name: 'zarmoneyOAuth2Api',
        required: true,
        displayOptions: {
          show: {
            authentication: ['oAuth2'],
          },
        },
      },
    ],
    webhooks: [
      {
        name: 'default',
        httpMethod: 'POST',
        responseMode: 'onReceived',
        path: 'webhook',
      },
    ],
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
        displayName: 'Events',
        name: 'events',
        type: 'multiOptions',
        required: true,
        default: [],
        description: 'The event to listen to',
        options: [
          {
            name: 'Customer Created',
            value: 'Customer.create',
            description: 'Occurs whenever a customer is created',
          },
          {
            name: 'Customer Deleted',
            value: 'Customer.delete',
            description: 'Occurs whenever a customer is deleted',
          },
          {
            name: 'Customer Updated',
            value: 'Customer.update',
            description: 'Occurs whenever a customer is updated',
          },
          {
            name: 'Estimate Created',
            value: 'Quote.create',
            description: 'Occurs whenever an estimate is created',
          },
          {
            name: 'Estimate Deleted',
            value: 'Quote.delete',
            description: 'Occurs whenever an estimate is deleted',
          },
          {
            name: 'Estimate Updated',
            value: 'Quote.update',
            description: 'Occurs whenever an estimate is updated',
          },
          {
            name: 'Invoice Created',
            value: 'Invoice.create',
            description: 'Occurs whenever an invoice is created',
          },
          {
            name: 'Invoice Deleted',
            value: 'Invoice.delete',
            description: 'Occurs whenever an invoice is deleted',
          },
          {
            name: 'Invoice Updated',
            value: 'Invoice.update',
            description: 'Occurs whenever an invoice is updated',
          },
          {
            name: 'Sales Order Created',
            value: 'SalesOrder.create',
            description: 'Occurs whenever a sales order is created',
          },
          {
            name: 'Sales Order Deleted',
            value: 'SalesOrder.delete',
            description: 'Occurs whenever a sales order is deleted',
          },
          {
            name: 'Sales Order Updated',
            value: 'SalesOrder.update',
            description: 'Occurs whenever a sales order is updated',
          },
        ]
      }
    ],
  };

  webhookMethods = {
    default: {
      async checkExists(this: IHookFunctions): Promise<boolean> {
        Logger.info(`-------------------------checkExists`);

        const webhookUrl = this.getNodeWebhookUrl('default') as string;

        const webhookData = this.getWorkflowStaticData('node');
        if (webhookData?.webhookId) {
          const webhook = await zarmoneyApiRequest.call(this, 'GET', `/webhooks/${webhookData.webhookId}`, {});
          if (webhook && webhook.endpoint === webhookUrl) {
            return true;
          }
        }

        return false;
      },

      async create(this: IHookFunctions): Promise<boolean> {
        Logger.info(`-------------------------create`);

        const eventData = [] as any;

        const events = this.getNodeParameter('events', []) as string[];
        events?.forEach(event => {
          const [eventId, action] = event.split('.');

          let found = eventData.find((ed: any) => ed.eventId === eventId);
          if (!found) {
            found = { eventId: eventId };
            found[action] = true;

            eventData.push(found);
          } else {
            found[action] = true;
          }
        });

        const webhookUrl = this.getNodeWebhookUrl('default') as string;
        Logger.info(`webhookUrl: ${webhookUrl}`);
        Logger.info(`events: ${JSON.stringify(eventData, null, 2)}`);

        try {
          const body = { endpoint: webhookUrl, active: true, events: eventData };

          const responseData = await zarmoneyApiRequest.call(this, 'POST', '/webhooks', body);
          if (!responseData) {
            return false;
          }

          Logger.info(JSON.stringify(responseData, null, 2));

          const webhookData = this.getWorkflowStaticData('node');
          webhookData.webhookId = responseData.id as number;
          webhookData.events = eventData as any[];
        }
        catch (error) {
          return false;
        }

        return true;
      },

      async delete(this: IHookFunctions): Promise<boolean> {
        const webhookData = this.getWorkflowStaticData('node');

        Logger.info(`-------------------------delete`);
        Logger.info(`webhookData: ${JSON.stringify(webhookData, null, 2)}`);

        if (webhookData?.webhookId) {
          try {
            await zarmoneyApiRequest.call(this, 'DELETE', `/webhooks/${webhookData.webhookId}`, {});

            // Remove from the static workflow data so that it is clear that no webhooks are registered anymore.
            delete webhookData.webhookId;
            delete webhookData.events;
          } catch (error) {
            return false;
          }
        }

        return true;
      },
    },
  };

  async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
    Logger.info(`-------------------------webhook called`);
    const bodyData = this.getBodyData();
    const headerData = this.getHeaderData() as IDataObject;
    const req = this.getRequestObject();

    const webhookData = this.getWorkflowStaticData('node');
    if (!webhookData?.events) {
      return {};
    }

    const { 'zarmoney-signature': signature } = headerData;
    const { name: eventName, operation, entityIds } = bodyData;

    const eventOp = decapitalizeFirstLetter(operation as string);

    Logger.info(`eventName: ${eventName}, eventOp: ${eventOp}, entityIds: ${entityIds}`);
    Logger.info(`webhookData.events: ${JSON.stringify(webhookData.events, null, 2)}`);

    const found = (webhookData.events as []).find((ed: any) => ed.eventId === eventName && ed[eventOp] === true);
    if (!found) {
      return {};
    }

    Logger.info(`zarmoneySignature: ${signature}`);

    return {
      workflowData: [this.helpers.returnJsonArray(req.body as IDataObject)],
    };
  }
}
