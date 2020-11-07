import { APIGatewayProxyResult } from 'aws-lambda';

export const handleError = (message: string): APIGatewayProxyResult => ({
  statusCode: 500,
  body: JSON.stringify(message),
});
