const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

// Delete a feature flag by ID
const deleteFeatureFlag = async (event) => {
  const params = {
    TableName: process.env.FEATURE_FLAGS_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
  };

  try {
    await dynamoDb.delete(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Item deleted successfully' })
    };
  } catch (error) {
    console.error(`Error deleting item with ${event.pathParameters.id}:`, error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Could not delete item: ${error}` })
    };
  }
};

module.exports = deleteFeatureFlag;
