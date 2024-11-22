const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const { v4: uuidv4 } = require('uuid');

/**
 * Creates a new feature flag entry in the DynamoDB table specified by the 
 * environment variable `FEATURE_FLAGS_TABLE`.
 * 
 * @param {Object} event - AWS Lambda event object containing the request details.
 * @param {string} event.body - JSON stringified body with a `name` property for the new feature flag.
 * @returns {Promise<Object>} - HTTP response object with a status code and body.
 *   - `201` status code with created feature flag data in body if successful.
 *   - `400` status code if the `name` is empty or null.
 *   - `500` status code if there is a server error.
 */
const createFeatureFlag = async (event) => {
  // Parse the request body and validate the `name` property
  const data = JSON.parse(event.body);
  if (data.name === null || data.name === '') {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: '"name" must not be empty or null' })
    };
  }

  // Define parameters for DynamoDB `put` operation
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
    // Attempt to insert the new item into the DynamoDB table
    await dynamoDb.put(params).promise();
    return {
      statusCode: 201,
      body: JSON.stringify({
        message: 'Item created successfully',
        newItemData: params.Item
      }),
    };
  } catch (error) {
    // Log the error and return a 500 status code with an error message
    console.error('Error creating item:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not create item' })
    };
  }
};

module.exports = createFeatureFlag;
