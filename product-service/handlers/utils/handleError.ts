import { APIGatewayProxyResult } from 'aws-lambda';

export enum ValidationErrors {
  uniqueViolation = 23505,
  notNullViolation = 23502,
  invalidText = '22P02',
}

const validationErrorCodes = Object.values(ValidationErrors);

export const handleError = ({ code, message }: any): APIGatewayProxyResult => {
  if (validationErrorCodes.includes(code)) {
    return {
      statusCode: 400,
      body: JSON.stringify(`Validation error: ${message}`),
    };
  }

  return {
    statusCode: 500,
    body: JSON.stringify(`Unhandled error: ${message}`),
  };
};
