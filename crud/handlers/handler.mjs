import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, DeleteCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
const client = new DynamoDBClient({
  endpoint: 'https://8000-bhavyagarg1-crudassignm-ye2cshiei55.ws-us105.gitpod.io'
});

const ddbDocClient = DynamoDBDocumentClient.from(client);

const tableName = 'users';

export const lambdaHandler = async (event, context) => {

  const requestBody = JSON.parse(event.body);
  if (event.httpMethod == 'GET') {
    return getFunction(requestBody);
  }

  else if (event.httpMethod == 'POST') {
    return createFunction(requestBody);
  }

  if (event.httpMethod == 'PUT') {
    return updateFunction(requestBody);
  }

  if (event.httpMethod == 'DELETE') {
    return deleteFunction(requestBody);
  }

}

async function getFunction(requestBody) {
  const id = Number(requestBody.id);

  var params = {
    TableName: tableName,
    Key: { id: id },
  };

  try {
    const data = await ddbDocClient.send(new GetCommand(params));
    console.log("from db", item);
    var item = data.Item;
  } catch (err) {
    console.log("Error", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error getting item' }),
    };
  }

  const response = {
    statusCode: 200,
    body: JSON.stringify(item)
  };

  return response;
}

async function createFunction(requestBody) {
  const id = requestBody.id;
  const name = requestBody.name;

  var params = {
    TableName: tableName,
    Item: { id: id, name: name }
  };

  try {
    const data = await ddbDocClient.send(new PutCommand(params));
    console.log("Success - item added or updated", data);
  } catch (err) {
    console.log("Error ", err.stack);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error creating item' }),
    };
  }

  return {
    'statusCode': 200,
    'body': JSON.stringify({
      message: 'Create ',
    })
  }
}

async function deleteFunction(requestBody) {
  const id = Number(requestBody.id);

  const params = {
    TableName: tableName,
    Key: { id: id },
  };

  try {
    await ddbDocClient.send(new DeleteCommand(params));
    console.log("Item deleted successfully");
  } catch (err) {
    console.log("Error ", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error deleting item" }),
    };
  }

  const response = {
    statusCode: 200,
    body: JSON.stringify({ message: 'Item deleted successfully' }),
  };

  return response;
}

async function updateFunction(requestBody) {
  const id = Number(requestBody.id);

  const params = {
    TableName: tableName,
    Key: { id: id },
    UpdateExpression: 'SET #name = :value',
    ExpressionAttributeNames: {
      '#name': 'name',
    },
    ExpressionAttributeValues: {
      ':value': requestBody.name,
    },
    ReturnValues: 'ALL_NEW',
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
}
