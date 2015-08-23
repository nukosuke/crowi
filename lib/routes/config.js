module.exports = function(crowi, app) {
  'use strict';

  var debug = require('debug')('crowi:routes:config'),
    config = crowi.getConfig(),
    actions = {};

  var api = actions.api = {};

  /**
   * routing: /_api/config
   */
  api.get = function (req, res) {
    return res.json({
      status: 'ok',
      data: config,
    });
  };

  return actions;
};
