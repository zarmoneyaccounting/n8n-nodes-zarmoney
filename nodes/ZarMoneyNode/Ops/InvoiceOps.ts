import type { INodeProperties } from 'n8n-workflow';

export const invoiceOps: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['invoice'],
      },
    },
    options: [
      {
        name: 'Get',
        value: 'get',
        description: 'Returns a single invoice by ID.',
        action: 'Get an invoice',
      },
      {
        name: 'Get Many',
        value: 'getAll',
        description: 'Returns all invoices.',
        action: 'Get many invoices',
      },
    ],
    default: 'getAll',
  },
  {
    displayName: 'Invoice ID',
    name: 'id',
    type: 'number',
    required: true,
    default: '',
    description: 'The ID of the invoice to retrieve.',
    displayOptions: {
      show: {
        resource: ['invoice'],
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
        resource: ['invoice'],
        operation: ['get', 'getAll'],
      },
    },
  },
  {
    displayName: 'Invoices matching all filters (if any)',
    name: 'filters',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    options: [
      {
        displayName: 'Invoice ID',
        name: 'id',
        type: 'number',
        default: 0,
        placeholder: 'Invoice ID',
        description: 'Fetch an invoice by its ID.',
      },
      {
        displayName: 'Customer ID',
        name: 'customerId',
        type: 'number',
        default: 0,
        placeholder: 'Customer ID',
        description: 'Fetch invoices by customer ID.',
      },
      {
        displayName: 'Customer Name',
        name: 'customerName',
        type: 'string',
        default: '',
        placeholder: 'Customer Name',
        description: 'Fetch invoices by customer name.',
      },
      {
        displayName: 'Customer Phone#',
        name: 'phone',
        type: 'string',
        default: '',
        placeholder: 'Phone#',
        description: 'Fetch invoices by customer\'s phone number.',
      },
      {
        displayName: 'Closed',
        name: 'isClosed',
        type: 'boolean',
        default: false,
        placeholder: 'Closed',
        description: 'Fetch either open or closed invoices.',
      }
    ],
    displayOptions: {
      show: {
        resource: ['invoice'],
        operation: ['getAll'],
      },
    },
  },
];