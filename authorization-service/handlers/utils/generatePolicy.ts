import { APIGatewayAuthorizerResult } from 'aws-lambda';

import { Effect } from '../typings';

export const generatePolicy = (
  principalId: string,
  resource: string,
  effect = Effect.Allow
): APIGatewayAuthorizerResult => ({
  principalId,
  policyDocument: {
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'execute-api:Invoke',
        Effect: effect,
        Resource: resource,
      },
    ],
  },
});
