const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const { v4: uuidv4 } = require('uuid');  // For generating unique IDs

// Create an item
module.exports.createItem = async (event) => {
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

// Get an item by ID
module.exports.getItem = async (event) => {
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

// Update an item by ID
module.exports.updateItem = async (event) => {
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

// Delete an item by ID
module.exports.deleteItem = async (event) => {
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
