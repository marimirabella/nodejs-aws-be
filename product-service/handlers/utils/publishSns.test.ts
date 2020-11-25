import { Cost, publishSns } from './publishSns';
import AWSMock from 'aws-sdk-mock';
import AWS from 'aws-sdk';

import { ProductWithStock } from '../../data-access';

const mockAwsInstance = jest.fn();

jest.mock('../constants', () => ({
  get sns() {
    return mockAwsInstance();
  },
}));

describe('publishSns', () => {
  let mockSNS: AWS.SNS;
  let products: ProductWithStock[];

  beforeEach(() => {
    products = [
      {
        id: 'id-1',
        title: 'title-1',
        description: 'description-1',
        price: 500,
        image_url: 'https://image-url-1/',
        count: 13,
      },
      {
        id: 'id-2',
        title: 'title-2',
        description: 'description-2',
        price: 1000,
        image_url: 'https://image-url-2/',
        count: 20,
      },
    ];

    AWSMock.setSDKInstance(AWS);
    AWSMock.mock('SNS', 'publish', (params: any, callback: Function) => callback(null, {}));

    mockSNS = new AWS.SNS();
    mockAwsInstance.mockReturnValue(mockSNS);
  });

  it('should send a message to AWS SNS topic for budget products subscription', async () => {
    const publishSpy = jest.spyOn(mockSNS, 'publish');

    const params = {
      Subject: 'Products were successfully created',
      Message: `We would like to inform you that the following products have been created: \n ${JSON.stringify(
        [products[0]],
        null,
        2
      )} \n`,
      TopicArn: process.env.SNS_ARN,
      MessageAttributes: {
        cost: { DataType: 'String', StringValue: Cost.Budget },
      },
    };

    await publishSns(products);

    expect(publishSpy).toHaveBeenCalledWith(params);
  });

  it('should send a message to AWS SNS topic for expensive products subscription', async () => {
    const publishSpy = jest.spyOn(mockSNS, 'publish');

    const params = {
      Subject: 'Products were successfully created',
      Message: `We would like to inform you that the following products have been created: \n ${JSON.stringify([products[1]], null, 2)} \n`,
      TopicArn: process.env.SNS_ARN,
      MessageAttributes: {
        cost: { DataType: 'String', StringValue: Cost.Expensive },
      },
    };

    await publishSns(products);

    expect(publishSpy).toHaveBeenCalledWith(params);
  });
});
