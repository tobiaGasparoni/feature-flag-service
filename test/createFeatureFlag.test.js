// __tests__/createFeatureFlag.test.js
const AWS = require('aws-sdk');
const handler = require('../handler');
const { v4: uuidv4 } = require('uuid');

// Mock AWS SDK DynamoDB DocumentClient
const putMock = jest.fn();
AWS.DynamoDB.DocumentClient.prototype.put = putMock;

// Mock UUID generation
jest.mock('uuid', () => ({ v4: jest.fn() }));

// Set up environment variables
process.env.FEATURE_FLAGS_TABLE = 'test-feature-flags-table';

describe('createFeatureFlag', () => {
  beforeEach(() => {
    // Clear mocks before each test
    jest.clearAllMocks();
  });

  test('creates a feature flag successfully', async () => {
    // Arrange
    const mockId = 'd9428888-122b-4c42-ae3e-54b81b8a6f33';
    uuidv4.mockReturnValue(mockId);

    const mockEvent = {
      body: JSON.stringify({ name: 'New Feature' }),
    };

    putMock.mockReturnValue({
      promise: () => Promise.resolve(),
    });

    // Act
    const result = await handler.createFeatureFlag(mockEvent);

    // Assert
    expect(result.statusCode).toBe(201);

    const response = JSON.parse(result.body)
    expect(response.message).toEqual('Item created successfully')
    expect(response.newItemData.id).toEqual(mockId)
    expect(response.newItemData.name).toEqual('New Feature')
    expect(response.newItemData.isEnabled).toEqual(false)
    expect(response.newItemData.createdAt).toBeGreaterThan(0)

    expect(putMock).toHaveBeenCalledWith({
      TableName: process.env.FEATURE_FLAGS_TABLE,
      Item: {
        id: mockId,
        name: 'New Feature',
        isEnabled: false,
        createdAt: expect.any(Number),
      },
    });
  });

  test.each([
    { name: ''}, { name: null}
  ])('returns 400 if name is empty or null', async ({ name }) => {
    // Arrange
    const mockEvent = {
      body: JSON.stringify({ name }),
    };

    // Act
    const result = await handler.createFeatureFlag(mockEvent);

    // Assert
    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toEqual({ error: '"name" must not be empty or null' });
  });
});
