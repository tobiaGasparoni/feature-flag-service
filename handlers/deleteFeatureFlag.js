const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

/**
 * Deletes a feature flag by its ID.
 * 
 * The ID of the feature flag to delete is provided in the path parameters 
 * of the request.
 *
 * @param {Object} event - AWS Lambda event object containing the request details.
 *   - `event.pathParameters.id` - The ID of the feature flag to delete.
 * @returns {Promise<Object>} - HTTP response object with a status code and body.
 *   - `200` status code with a success message if the deletion succeeds.
 *   - `500` status code if there is a server error.
 */
const deleteFeatureFlag = async (event) => {
  // Define parameters for the DynamoDB `delete` operation
  const params = {
    TableName: process.env.FEATURE_FLAGS_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
  };

  try {
    // Attempt to delete the item from the DynamoDB table
    await dynamoDb.delete(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Item deleted successfully' })
    };
  } catch (error) {
    // Log the error and return a 500 status code with an error message
    console.error(`Error deleting item with id ${event.pathParameters.id}:`, error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Could not delete item: ${error}` })
    };
  }
};

module.exports = deleteFeatureFlag;
