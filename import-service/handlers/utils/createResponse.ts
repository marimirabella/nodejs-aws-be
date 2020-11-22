import { APIGatewayProxyResult } from 'aws-lambda';

interface ResponseParams {
  statusCode: number;
  body: string[] | string;
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
