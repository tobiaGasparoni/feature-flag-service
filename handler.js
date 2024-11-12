const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");

const {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} = require("@aws-sdk/lib-dynamodb");

const express = require("express");
const serverless = require("serverless-http");

const app = express();

const FEATURE_FLAGS_TABLE = process.env.FEATURE_FLAGS_TABLE;
const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

app.use(express.json());

app.get("/featureFlags/:featureFlagId", async (req, res) => {
  const params = {
    TableName: FEATURE_FLAGS_TABLE,
    Key: {
      featureFlagId: req.params.featureFlagId,
    },
  };

  try {
    const command = new GetCommand(params);
    const { Item } = await docClient.send(command);
    if (Item) {
      const { featureFlagId, name } = Item;
      res.json({ featureFlagId, name });
    } else {
      res
        .status(404)
        .json({ error: 'Could not find feature flag with provided "featureFlagId"' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not retrieve feature flag" });
  }
});

app.post("/featureFlags", async (req, res) => {
  const { featureFlagId, name } = req.body;
  if (typeof featureFlagId !== "string") {
    res.status(400).json({ error: '"featureFlagId" must be a string' });
  } else if (typeof name !== "string") {
    res.status(400).json({ error: '"name" must be a string' });
  }
  const nameEnhanced = name + ' BUT ENHANCED'

  const params = {
    TableName: FEATURE_FLAGS_TABLE,
    Item: { featureFlagId, name, nameEnhanced },
  };

  try {
    const command = new PutCommand(params);
    await docClient.send(command);
    res.json({ featureFlagId, name, nameEnhanced });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not create feature flag" });
  }
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

exports.handler = serverless(app);
