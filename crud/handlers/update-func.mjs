import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({
    endpoint: 'https://8000-bhavyagarg1-crudassignm-ye2cshiei55.ws-us105.gitpod.io'
});
const ddbDocClient = DynamoDBDocumentClient.from(client);

const tableName = 'users';

export const updateItemHandler = async (event, context) => {
  console.info('update received:', event);

  const id = Number(event.pathParameters.id);
  const requestBody = JSON.parse(event.body);

  // Define the update parameters
  const params = {
    TableName: tableName,
    Key: { id: id },
    UpdateExpression: 'SET #name = :value',
    ExpressionAttributeNames: {
      '#name': 'name',
    },
    ExpressionAttributeValues: {
      ':value': requestBody.name, // New name value
    },
    ReturnValues: 'ALL_NEW', // This option returns the updated item
  };

  try {
    const data = await ddbDocClient.send(new UpdateCommand(params));
    const updatedItem = data.Attributes;

    const response = {
      statusCode: 200,
      body: JSON.stringify(updatedItem),
    };

    return response;
  } catch (err) {
    console.log('Error', err);
    const response = {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error updating item' }),
    };
    return response;
  }
};
