# CRUD-Assignment

Run the following commands in sequence before working on the code.

1. sudo ./aws/install
2. aws configure
3. docker run -p 8000:8000 -d amazon/dynamodb-local
4. aws dynamodb create-table --cli-input-json file://table-schema.json --endpoint-url http://localhost:8000
