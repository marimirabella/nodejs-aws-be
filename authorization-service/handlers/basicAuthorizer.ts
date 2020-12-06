import { APIGatewayTokenAuthorizerHandler } from 'aws-lambda';

import { generatePolicy } from './utils';
import { APIGatewayEventType, AuthorizationError, Effect } from './typings';

export const basicAuthorizer: APIGatewayTokenAuthorizerHandler = (event, context, cb) => {
  console.log('Event: ', JSON.stringify(event, null, 2));

  if (event.type !== APIGatewayEventType.Token) {
    cb(AuthorizationError.Unauthorized);
  }

  try {
    const { authorizationToken, methodArn } = event;

    const encodedCredentials = authorizationToken.split(' ')[1];
    const buffer = Buffer.from(encodedCredentials, 'base64');
    const plainCredentials = buffer.toString('utf-8').split(':');
    const username = plainCredentials[0];
    const password = plainCredentials[1];

    console.log(`username: ${username} and password: ${password}`);

    const storedUserPassword = process.env[username];
    const effect =
      !storedUserPassword || storedUserPassword !== password ? Effect.Deny : Effect.Allow;

    const policy = generatePolicy(encodedCredentials, methodArn, effect);

    cb(null, policy);
  } catch (err) {
    cb(`${AuthorizationError.InvalidToken}: ${err.message}`);
  }
};
