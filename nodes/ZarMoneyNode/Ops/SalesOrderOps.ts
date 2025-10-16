import type { INodeProperties } from 'n8n-workflow';

export const salesOrderOps: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['salesOrder'],
      },
    },
    options: [
      {
        name: 'Get',
        value: 'get',
        description: 'Returns a single sales order by ID.',
        action: 'Get a sales order',
      },
      {
        name: 'Get Many',
        value: 'getAll',
        description: 'Returns all sales orders.',
        action: 'Get many sales orders',
      },
    ],
    default: 'getAll',
  },
  {
    displayName: 'Sales Order ID',
    name: 'id',
    type: 'number',
    required: true,
    default: '',
    description: 'The ID of the sales order to retrieve.',
    displayOptions: {
      show: {
        resource: ['salesOrder'],
        operation: ['get'],
      },
    },
  },
  {
    displayName: 'Expand User Info',
    name: 'expandUserInfo',
    type: 'boolean',
    required: false,
    default: false,
    description: 'Turn this on to expand associated users\' info.',
    displayOptions: {
      show: {
        resource: ['salesOrder'],
        operation: ['get', 'getAll'],
      },
    },
  },
  {
    displayName: 'Sales orders matching all filters (if any)',
    name: 'filters',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    options: [
      {
        displayName: 'Sales Order ID',
        name: 'id',
        type: 'number',
        default: 0,
        placeholder: 'Sales Order ID',
        description: 'Fetch a sales order by its ID.',
      },
      {
        displayName: 'Customer ID',
        name: 'customerId',
        type: 'number',
        default: 0,
        placeholder: 'Customer ID',
        description: 'Fetch sales orders by customer ID.',
      },
      {
        displayName: 'Customer Name',
        name: 'customerName',
        type: 'string',
        default: '',
        placeholder: 'Customer Name',
        description: 'Fetch sales orders by customer name.',
      },
      {
        displayName: 'Customer Phone#',
        name: 'phone',
        type: 'string',
        default: '',
        placeholder: 'Phone#',
        description: 'Fetch sales orders by customer\'s phone number.',
      },
      {
        displayName: 'Closed',
        name: 'isClosed',
        type: 'boolean',
        default: false,
        placeholder: 'Closed',
        description: 'Fetch either open or closed sales orders.',
      }
    ],
    displayOptions: {
      show: {
        resource: ['salesOrder'],
        operation: ['getAll'],
      },
    },
  },
];