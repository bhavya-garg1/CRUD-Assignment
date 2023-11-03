import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
const client = new DynamoDBClient({
    endpoint: 'https://8000-bhavyagarg1-crudassignm-ye2cshiei55.ws-us105.gitpod.io'
});

const ddbDocClient = DynamoDBDocumentClient.from(client);

const tableName = 'users';

export const lambdaHandler = async (event,context) => {
    // console.info('get received:', event);
   
    const id = Number(event.pathParameters.id);

    var params = {
      TableName : tableName,
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

