const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const { v4: uuidv4 } = require('uuid');  // For generating unique IDs

// Create a feature flag
module.exports.createFeatureFlag = async (event) => {
  const data = JSON.parse(event.body);
  if (data.name === null || data.name === '') {
    return { statusCode: 400, body: JSON.stringify({ error: '"name" must not be empty or null' }) };
  }
  const params = {
    TableName: process.env.FEATURE_FLAGS_TABLE,
    Item: {
      id: uuidv4(),  // unique identifier
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
    return { statusCode: 500, body: JSON.stringify({ error: 'Could not create item' }) };
  }
};

// Get a feature flag by ID
module.exports.getFeatureFlag = async (event) => {
  const params = {
    TableName: process.env.FEATURE_FLAGS_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
  };

  try {
    const result = await dynamoDb.get(params).promise();
    if (!result.Item) {
      return { statusCode: 404, body: JSON.stringify({ error: 'Item not found' }) };
    }
    return { statusCode: 200, body: JSON.stringify(result.Item) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Could not retrieve item' }) };
  }
};

// List all feature flags
module.exports.listFeatureFlags = async () => {
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
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not retrieve items' }),
    };
  }
};

// Update a feature flag by ID
module.exports.updateFeatureFlag = async (event) => {
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.FEATURE_FLAGS_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
    UpdateExpression: 'set #name = :value',  // Example attributes
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
    return { statusCode: 200, body: JSON.stringify(result.Attributes) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Could not update item' }) };
  }
};

// Delete a feature flag by ID
module.exports.deleteFeatureFlag = async (event) => {
  const params = {
    TableName: process.env.FEATURE_FLAGS_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
  };

  try {
    await dynamoDb.delete(params).promise();
    return { statusCode: 200, body: JSON.stringify({ message: 'Item deleted successfully' }) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Could not delete item' }) };
  }
};
