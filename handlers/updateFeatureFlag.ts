const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

/**
 * Updates the `isEnabled` status of a specific feature flag by ID.
 * 
 * The ID of the feature flag is specified in the path parameters of the 
 * request, and the `isEnabled` value is provided in the request body.
 *
 * @param {Object} event - AWS Lambda event object containing the request details.
 *   - `event.pathParameters.id` - The ID of the feature flag to update.
 *   - `event.body` - JSON string containing the `isEnabled` value to set.
 * @returns {Promise<Object>} - HTTP response object with a status code and body.
 *   - `200` status code with updated attributes in the body if the update succeeds.
 *   - `500` status code if there is a server error.
 */
const updateFeatureFlag = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // Parse the JSON body to get the update data
  if (event.body === null) {
    console.error('Endpoint event is null');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Endpoint event is null' })
    };
  }
  const data = JSON.parse(event.body);

  // Define parameters for the DynamoDB `update` operation
  if (event.pathParameters === null) {
    console.error('Error updating feature flag: event.pathParameters === null');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not updating feature flag' })
    };
  }
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
    // Attempt to update the item in the DynamoDB table
    const result = await dynamoDb.update(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(result.Attributes)
    };
  } catch (error) {
    // Log the error and return a 500 status code with an error message
    console.error('Error updating feature flag:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Could not update feature flag: ${error}` })
    };
  }
};

module.exports = updateFeatureFlag;
