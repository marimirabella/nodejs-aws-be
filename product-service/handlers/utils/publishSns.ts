import AWS from 'aws-sdk';

import { ProductWithStock } from '../../data-access';

export enum Cost {
  Budget = 'budget',
  Expensive = 'expensive',
}

export const publishSns = async (cost: Cost, products: ProductWithStock[]) => {
  const sns = new AWS.SNS({ region: 'eu-west-1' });

  const publishParams = {
    Subject: 'Product were successfully created',
    Message: `We would like to inform you that the following products have been created:
    \n ${JSON.stringify(products, null, 2)} \n`,
    TopicArn: process.env.SNS_ARN,
    MessageAttributes: {
      cost: { DataType: 'String', StringValue: cost },
    },
  };

  await sns.publish(publishParams).promise();
};
