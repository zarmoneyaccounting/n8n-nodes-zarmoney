import type { INodeProperties } from 'n8n-workflow';

export const userOps: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['user'],
      },
    },
    options: [
      {
        name: 'Get',
        value: 'get',
        description: 'Returns a single user by ID',
        action: 'Get a user',
      },
      {
        name: 'Get Many',
        value: 'getAll',
        description: 'Returns many users',
        action: 'Get many users',
      },
    ],
    default: 'getAll',
  },
  {
    displayName: 'User ID',
    name: 'id',
    type: 'string',
    required: true,
    default: '',
    description: 'The ID of the user to retrieve',
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['get'],
      },
    },
  },
];