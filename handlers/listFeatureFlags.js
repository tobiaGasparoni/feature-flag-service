const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

// List all feature flags
const listFeatureFlags = async (event) => {
  const params = {
    TableName: process.env.FEATURE_FLAGS_TABLE,
  };

  try {
    const result = await dynamoDb.scan(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
  } catch (error) {
    console.error('Error retrieving items:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not retrieve items' }),
    };
  }
};

module.exports = listFeatureFlags;
