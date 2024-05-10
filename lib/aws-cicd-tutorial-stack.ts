import * as cdk from 'aws-cdk-lib';
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as dotenv from "dotenv";
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class AwsCicdTutorialStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'AwsCicdTutorialQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });

    // Load the environment .env file.
    dotenv.config();

    const table = new dynamodb.Table(this, 'AccessTimes', {
      partitionKey: { name: 'key', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    const lambdaFunc = new lambda.Function(this, 'LambdaFunction', {
      runtime: lambda.Runtime.PYTHON_3_12,
      code: lambda.Code.fromAsset("lambda"),
      handler: 'main.handler',
      environment: {
        VERSION: process.env.VERSION || "0.0",
        TABLE_NAME: table.tableName
      }
    });

    table.grantReadWriteData(lambdaFunc);

    const functionUrl = lambdaFunc.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
      cors: {
        allowedOrigins: ["*"],
        allowedMethods: [lambda.HttpMethod.ALL],
        allowedHeaders: ["*"],
      },
    });

    new cdk.CfnOutput(this, "Url", {
      value: functionUrl.url,
    });
  }
}
