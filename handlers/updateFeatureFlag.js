const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

// Update a feature flag by ID
const updateFeatureFlag = async (event) => {
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.FEATURE_FLAGS_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
    UpdateExpression: 'set #name = :value',
    ExpressionAttributeNames: {
      '#name': 'isEnabled'
    },
    ExpressionAttributeValues: {
      ':value': data.isEnabled,
    },
    ReturnValues: 'UPDATED_NEW',
  };

  try {
    const result = await dynamoDb.update(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(result.Attributes)
    };
  } catch (error) {
    console.error('Error updating item:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Could not update item: ${error}` })
    };
  }
};

module.exports = updateFeatureFlag;
