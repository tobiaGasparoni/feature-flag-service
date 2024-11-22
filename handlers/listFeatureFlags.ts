const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

/**
 * Lists all feature flags in the DynamoDB table specified by the 
 * environment variable `FEATURE_FLAGS_TABLE`.
 * 
 * @param {Object} event - AWS Lambda event object containing the request details.
 * @returns {Promise<Object>} - HTTP response object with a status code and body.
 *   - `200` status code with an array of feature flags in the body if successful.
 *   - `500` status code if there is a server error.
 */
const listFeatureFlags = async (event) => {
  // Define parameters for DynamoDB `scan` operation
  const params = {
    TableName: process.env.FEATURE_FLAGS_TABLE,
  };

  try {
    // Attempt to retrieve all items from the DynamoDB table
    const result = await dynamoDb.scan(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
  } catch (error) {
    // Log the error and return a 500 status code with an error message
    console.error('Error retrieving items:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not retrieve items' }),
    };
  }
};

module.exports = listFeatureFlags;
