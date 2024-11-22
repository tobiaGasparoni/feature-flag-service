const createFeatureFlag = require('./handlers/createFeatureFlag');
const getFeatureFlag = require('./handlers/getFeatureFlag');
const listFeatureFlags = require('./handlers/listFeatureFlags');
const updateFeatureFlag = require('./handlers/updateFeatureFlag');
const deleteFeatureFlag = require('./handlers/deleteFeatureFlag');

module.exports = {
  createFeatureFlag,
  getFeatureFlag,
  listFeatureFlags,
  updateFeatureFlag,
  deleteFeatureFlag
};
