import {
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class ZarMoneyOAuth2Api implements ICredentialType {
  name = 'zarmoneyOAuth2Api';
  extends = ['oAuth2Api'];
  displayName = 'ZarMoney OAuth2 API';
  documentationUrl = 'https://docs.zarmoney.com';

  properties: INodeProperties[] = [
    {
      displayName: 'Grant Type',
      name: 'grantType',
      type: 'hidden',
      default: 'authorizationCode',
    },
    {
      displayName: 'Authorization URL',
      name: 'authUrl',
      type: 'hidden',
      default: 'https://accounts.zarmoney.com/core/connect/authorize',
      required: true,
    },
    {
      displayName: 'Access Token URL',
      name: 'accessTokenUrl',
      type: 'hidden',
      default: 'https://accounts.zarmoney.com/core/connect/token',
      required: true,
    },
    {
      displayName: 'Scope',
      name: 'scope',
      type: 'hidden',
      default: 'openid profile offline_access read:basicCompanyInfo read:sales read:customers read:events',
    },
    {
      displayName: 'Auth URI Query Parameters',
      name: 'authQueryParameters',
      type: 'hidden',
      default: '',
    },
    {
      displayName: 'Authentication',
      name: 'authentication',
      type: 'hidden',
      default: 'body',
    },
  ];
}
