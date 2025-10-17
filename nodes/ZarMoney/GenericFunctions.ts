import type {
  IExecuteFunctions,
  IHookFunctions,
  IDataObject,
  ILoadOptionsFunctions,
  JsonObject,
  IHttpRequestMethods,
  IHttpRequestOptions,
} from 'n8n-workflow';

import { NodeApiError/*, NodeOperationError*/, LoggerProxy as Logger } from 'n8n-workflow';

export async function zarmoneyApiRequest(
  this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
  method: IHttpRequestMethods,
  endpoint: string,
  body: object,
  query?: IDataObject,
  option: IDataObject = {},
): Promise<any> {
  const options: IHttpRequestOptions = { method, headers: { 'User-Agent': 'n8n' }, body, qs: query, url: '', json: true };
  if (Object.keys(option).length !== 0) {
    Object.assign(options, option);
  }

  try {
    const credentials = await this.getCredentials('zarmoneyOAuth2Api');
    const credentialType = 'zarmoneyOAuth2Api';

    const baseUrl = credentials.server || 'https://api.zarmoney.com/api/v1';
    options.url = `${baseUrl}${endpoint}`;

    Logger.info(`url: ${baseUrl}`);
    Logger.info(JSON.stringify(options));

    return await this.helpers.httpRequestWithAuthentication.call(this, credentialType, options);
  } catch (error) {
    throw new NodeApiError(this.getNode(), error as JsonObject);
  }
}


export function toQueryString(obj: Record<string, any>): string {
  const queryStringParts: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    queryStringParts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
  }

  return queryStringParts.join('&');
}


export async function expandUserProperty(users: Array<any>, responseData: any, sourcePropName: string, targetPropName: string) {
  const setUserProperty = (data: any) => {
    const prop = data?.[sourcePropName];
    if (prop) {
      const user = users?.find((user: any) => user.id === prop);
      if (user) {
        data[targetPropName] = user;
      }
    }
  };

  if (Array.isArray(responseData)) {
    responseData.forEach(setUserProperty);
  } else {
    setUserProperty(responseData);
  }
};

export function decapitalizeFirstLetter(str: string): string {
  if (typeof str !== 'string' || str.length === 0) {
    return str;
  }
  return str.charAt(0).toLowerCase() + str.slice(1);
};