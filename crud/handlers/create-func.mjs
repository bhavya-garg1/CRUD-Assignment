import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
const client = new DynamoDBClient({
    endpoint: 'https://8000-bhavyagarg1-crudassignm-ye2cshiei55.ws-us105.gitpod.io'
});
const ddbDocClient = DynamoDBDocumentClient.from(client);

const tableName = 'users';

export const putItemHandler = async (event, context) => {
    // console.info('create received:', event);

    const body = JSON.parse(event.body);
    const id = body.id;
    const name = body.name;

    var params = {
        TableName : tableName,
        Item: { id : id, name: name }
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
};
