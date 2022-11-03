const IValtApi = require('ivalt-api-js');
const defaultClient = IValtApi.ApiClient.instance;

const API_KEY_IVALT = "JRfX4EdCdM2pTqbRIgy2m4u3yCDfkUCQ6mK0VT90";
const ApiKeyAuth = defaultClient.authentications.ApiKeyAuth;
ApiKeyAuth.apiKey = API_KEY_IVALT;

const api = new IValtApi.DefaultApi();

window.ivalt = api;
