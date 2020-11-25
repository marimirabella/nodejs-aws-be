import { ProductWithStock } from '../../data-access';
import { sns } from '../constants';

export enum Cost {
  Budget = 'budget',
  Expensive = 'expensive',
}

export const publishSns = async (products: ProductWithStock[]) => {
  const budgetProducts = products?.filter(({ price }) => price <= 500);
  const expensiveProducts = products?.filter(({ price }) => price > 500);

  const getPublishSnsParams = (cost: Cost, products: ProductWithStock[]) => ({
    Subject: 'Products were successfully created',
    Message: `We would like to inform you that the following products have been created: \n ${JSON.stringify(
      products,
      null,
      2
    )} \n`,
    TopicArn: process.env.SNS_ARN,
    MessageAttributes: {
      cost: { DataType: 'String', StringValue: cost },
    },
  });

  if (budgetProducts?.length) {
    await sns.publish(getPublishSnsParams(Cost.Budget, budgetProducts)).promise();
  }

  if (expensiveProducts?.length) {
    await sns.publish(getPublishSnsParams(Cost.Expensive, expensiveProducts)).promise();
  }
};
