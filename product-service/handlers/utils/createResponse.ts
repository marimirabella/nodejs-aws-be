import { APIGatewayProxyResult } from 'aws-lambda';

interface ResponseParams {
  statusCode: number;
  body: Record<string, any> | Record<string, any>[];
}

export const createResponse = ({
  statusCode,
  body,
}: ResponseParams): APIGatewayProxyResult => ({
  statusCode,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  },
  body: JSON.stringify(body),
});
