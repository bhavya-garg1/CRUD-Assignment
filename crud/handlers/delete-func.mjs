import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, DeleteCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({
    endpoint: 'https://8000-bhavyagarg1-crudassignm-ye2cshiei55.ws-us105.gitpod.io'
});
const ddbDocClient = DynamoDBDocumentClient.from(client);

const tableName = 'users';

export const lambdaHandler = async (event, context) => {
    // console.info("delete received:", event);

    const id = Number(event.pathParameters.id);

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
};
