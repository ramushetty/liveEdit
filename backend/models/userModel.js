
const docClient = require('../config/dbConfig');

const USERS_TABLE = 'Users'; 

const createUser = async (userData) => {
    const params = {
        TableName: USERS_TABLE,
        Item: userData
    };

    return docClient.put(params).promise();
};

const findUserByEmail = async (email) => {
    const params = {
        TableName: USERS_TABLE,
        KeyConditionExpression: 'email = :email',
        ExpressionAttributeValues: {
            ':email': email
        }
    };

    const result = await docClient.query(params).promise();
    return result.Items[0]; // Assuming email is a unique identifier
};

module.exports = {
    createUser,
    findUserByEmail
};
