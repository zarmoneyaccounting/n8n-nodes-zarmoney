import type { INodeProperties } from 'n8n-workflow';

export const estimateOps: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['estimate'],
      },
    },
    options: [
      {
        name: 'Get',
        value: 'get',
        description: 'Returns a single estimate by ID.',
        action: 'Get an estimate',
      },
      {
        name: 'Get Many',
        value: 'getAll',
        description: 'Returns all estimates.',
        action: 'Get many estimates',
      },
    ],
    default: 'getAll',
  },
  {
    displayName: 'Estimate ID',
    name: 'id',
    type: 'number',
    required: true,
    default: '',
    description: 'The ID of the estimate to retrieve.',
    displayOptions: {
      show: {
        resource: ['estimate'],
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
        resource: ['estimate'],
        operation: ['get', 'getAll'],
      },
    },
  },
  {
    displayName: 'Estimates matching all filters (if any)',
    name: 'filters',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    options: [
      {
        displayName: 'Estimate ID',
        name: 'id',
        type: 'number',
        default: 0,
        placeholder: 'Estimate ID',
        description: 'Fetch an estimate by its ID.',
      },
      {
        displayName: 'Customer ID',
        name: 'customerId',
        type: 'number',
        default: 0,
        placeholder: 'Customer ID',
        description: 'Fetch estimates by customer ID.',
      },
      {
        displayName: 'Customer Name',
        name: 'customerName',
        type: 'string',
        default: '',
        placeholder: 'Customer Name',
        description: 'Fetch estimates by customer name.',
      },
      {
        displayName: 'Customer Phone#',
        name: 'phone',
        type: 'string',
        default: '',
        placeholder: 'Phone#',
        description: 'Fetch estimates by customer\'s phone number.',
      },
      {
        displayName: 'Closed',
        name: 'isClosed',
        type: 'boolean',
        default: false,
        placeholder: 'Closed',
        description: 'Fetch either open or closed estimates.',
      }
    ],
    displayOptions: {
      show: {
        resource: ['estimate'],
        operation: ['getAll'],
      },
    },
  },
];