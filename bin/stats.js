const measured = require('measured')

module.exports = measured.createCollection();

module.exports.shutdown = async (hookName, context) => {
  module.exports.end();
};
