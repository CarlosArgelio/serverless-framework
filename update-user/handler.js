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


const update_users = async (event, context) => {

    let userId = event.pathParameters.id

    const body = JSON.parse(event.body)

    var params = {
        TableName: 'usersTable',
        Key: { pk: userId},
        UpdateExpression: "set #name = :name, #number = :number, #address = :address",
        ExpressionAttributeNames: {
            '#name':'name',
            '#number': 'number',
            '#address': 'address'
        }, 
        ExpressionAttributeValues: {
            ':name':body.name,
            ':number':body.number,
            ':address':body.address,
        },
        ReturnValues: 'ALL_NEW'
    };

    return dynamodb.update(params).promise().then(res => {
        console.log(res)
        return {
            "statusCode": 200,
            "body": JSON.stringify({ 'user': res.Attributes})
        }
    })
}

module.exports = {
    update_users
}
