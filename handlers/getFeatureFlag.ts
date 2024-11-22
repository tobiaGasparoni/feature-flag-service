const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

/**
 * Retrieves a feature flag by ID from the DynamoDB table specified by the 
 * environment variable `FEATURE_FLAGS_TABLE`.
 * 
 * @param {Object} event - AWS Lambda event object containing the request details.
 * @param {Object} event.pathParameters - Object containing path parameters for the request.
 * @param {string} event.pathParameters.id - The ID of the feature flag to retrieve.
 * @returns {Promise<Object>} - HTTP response object with a status code and body.
 *   - `200` status code with the feature flag data in body if found.
 *   - `404` status code if the item is not found.
 *   - `500` status code if there is a server error.
 */
const getFeatureFlag = async (event) => {
  // Define parameters for DynamoDB `get` operation
  const params = {
    TableName: process.env.FEATURE_FLAGS_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
  };

  try {
    // Attempt to retrieve the item from the DynamoDB table
    const result = await dynamoDb.get(params).promise();
    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Item not found' })
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify(result.Item)
    };
  } catch (error) {
    // Log the error and return a 500 status code with an error message
    console.error(`Error retrieving item with id ${event.pathParameters.id}:`, error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not retrieve item' })
    };
  }
};

module.exports = getFeatureFlag;
