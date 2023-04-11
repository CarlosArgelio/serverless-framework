const aws = require("aws-sdk")

let dynamoDBClienteParams = {}

if (process.env.IS_OFFLINE){
    dynamoDBClienteParams = {
        region: 'localhost',
        endpoint: 'http://localhost:8000',
        accessKeyId: 'DEFAULT_ACCESS_KEY',  // needed if you don't have aws credentials at all in env
        secretAccessKey: 'DEFAULT_SECRET' // needed if you don't have aws credentials at all in env
    }
}

const dynamodb = new aws.DynamoDB.DocumentClient(dynamoDBClienteParams)


const users = async (event, context) => {

    let userId = event.pathParameters.id

    var params = {
        ExpressionAttributeValues: {':pk':userId},
        KeyConditionExpression: 'pk = :pk',
        TableName: 'usersTable'
    };

    return dynamodb.query(params).promise().then(res => {
        console.log(res)
        return {
            "statusCode": 200,
            "body": JSON.stringify({ 'user': res})
        }
    })
}

module.exports = {
    users
}
