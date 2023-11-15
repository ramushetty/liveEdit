const AWS = require('aws-sdk');

require('dotenv').config();

AWS.config.update({
  region: 'us-west-2', // Replace with your AWS region
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  endpoint:process.env.DYNAMODB_URL
});
// AWS.config.update({
//   region: "us-west-2",
//   endpoint: "http://localhost:8000",
//   accessKeyId: "fakeMyKeyId",
//   secretAccessKey: "fakeSecretAccessKey"
// });


const ddb = new AWS.DynamoDB();
const docClient = new AWS.DynamoDB.DocumentClient();
// Parameters for creating the table
const tableParams = {
  TableName : "Notes",
  KeySchema: [
    { AttributeName: "noteId", KeyType: "HASH"} // Partition key
  ],
  AttributeDefinitions: [
    { AttributeName: "noteId", AttributeType: "S" }
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 10, // Set read capacity for your table
    WriteCapacityUnits: 10 // Set write capacity for your table
  }
};

// Create the table
ddb.createTable(tableParams, function(err, data) {
  if (err) {
    console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
  } else {
    console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
  }
});

const params = {
  TableName: 'Users',
  KeySchema: [
    { AttributeName: 'email', KeyType: 'HASH' }, // Partition key
    // You can add a sort key here if needed
  ],
  AttributeDefinitions: [
    { AttributeName: 'email', AttributeType: 'S' },
    // Add other attribute definitions here
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1
  }
};

ddb.createTable(params, (err, data) => {
  if (err) {
    console.error('Unable to create table. Error JSON:', JSON.stringify(err, null, 2));
  } else {
    console.log('Created table. Table description JSON:', JSON.stringify(data, null, 2));
  }
});




module.exports = docClient;
