import { APIGatewayProxyResult } from 'aws-lambda';

export const handleError = ({ message }: any): APIGatewayProxyResult => ({
  statusCode: 500,
  body: JSON.stringify(`Unhandled error: ${message}`),
});
