import AWS from 'aws-sdk';

export const awsImportBucket = 'aws-import-s3';

export const s3 = new AWS.S3({ region: 'eu-west-1' });
