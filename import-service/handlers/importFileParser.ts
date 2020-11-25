import { S3Handler } from 'aws-lambda';
import csvParser from 'csv-parser';

import { awsImportBucket, s3, sqs } from './constants';

export const importFileParser: S3Handler = async ({ Records }) => {
  try {
    await new Promise((resolve, reject) => {
      Records.forEach(record => {
        const recordKey = record.s3.object.key;
        const getObjectParams = {
          Bucket: awsImportBucket,
          Key: recordKey,
        };

        const s3Stream = s3.getObject(getObjectParams).createReadStream();

        s3Stream
          .pipe(csvParser())
          .on('data', async item => {
            console.log('csv row', item);

            const sqsSendMessageParams = {
              QueueUrl: process.env.PRODUCT_SQS_URL!,
              MessageBody: JSON.stringify(item),
            };

            await sqs.sendMessage(sqsSendMessageParams).promise();
          })
          .on('end', async () => {
            console.log(`Copy from ${awsImportBucket}/${recordKey}`);

            const parsePath = recordKey.replace('uploaded', 'parsed');

            const copyObjectParams = {
              Bucket: awsImportBucket,
              CopySource: `${awsImportBucket}/${recordKey}`,
              Key: parsePath,
            };

            await s3.copyObject(copyObjectParams).promise();

            console.log(`Copied into ${awsImportBucket}/${parsePath}`);

            const deleteObjectParams = {
              Bucket: awsImportBucket,
              Key: recordKey,
            };

            await s3.deleteObject(deleteObjectParams).promise();

            console.log(`Removed from ${awsImportBucket}/${recordKey}`);

            resolve(true);
          })
          .on('error', error => {
            console.log('Parse error:', error);

            reject(error);
          });
      });
    });
  } catch (err) {
    console.log('Import file parser error:', err.message);
  }
};
