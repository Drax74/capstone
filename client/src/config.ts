// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'zcbu5bwcd2'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-35u5rsu8.eu.auth0.com', // Auth0 domain
  clientId: '14hQNHpUQ9Hp26SpPisb8Oinj3Q8xYDr', // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
