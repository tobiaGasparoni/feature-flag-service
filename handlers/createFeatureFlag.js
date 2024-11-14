const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const { v4: uuidv4 } = require('uuid');

// Create a feature flag
const createFeatureFlag = async (event) => {
  const data = JSON.parse(event.body);
  if (data.name === null || data.name === '') {
    return { statusCode: 400, body: JSON.stringify({ error: '"name" must not be empty or null' }) };
  }
  const params = {
    TableName: process.env.FEATURE_FLAGS_TABLE,
    Item: {
      id: uuidv4(),
      name: data.name,
      isEnabled: false,
      createdAt: Date.now()
    },
  };

  try {
    await dynamoDb.put(params).promise();
    return {
      statusCode: 201,
      body: JSON.stringify({
        message: 'Item created successfully',
        newItemData: params.Item
      }),
    };
  } catch (error) {
    console.error('Error creating item:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not create item' })
    };
  }
};

module.exports = createFeatureFlag;
