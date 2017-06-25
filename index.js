var deap = require('deap')
var beepboopProvider = require('./lib/beepboop-provider')
var Logger = require('./lib/logger')

var providers = {
  'beepboop': beepboopProvider,
}

module.exports = function NewAPI (options) {
  var config = deap.update({
    logger: null, // override logger
    debug: false, // enables logging of calls/errors
    token: process.env.BEEPBOOP_TOKEN, // auth token
    url: process.env.BEEPBOOP_API_URL || 'https://beepboophq.com/api/v1', // endpoint
  }, options || {})

  var logger = config.logger || Logger(config.debug)
  var provider = beepboopProvider(config)

  // return a wrapper around provider to normalize args and logging
  return {
    type: provider.type,

    list: function (page, per_page, cb) {
      provider.list(page, per_page, function (err, value) {
        if (err) {
          logger.error('Error calling list(%s, %s): %s', page, per_page, err.message)
        } else {
          logger.debug('list(%s, %s)', page, per_page)
        }

        cb(err, value)
      })
    },
    get: function (team_id, cb) {
      provider.get(key, function (err, value) {
        if (err) {
          logger.error('Error calling get(%s): %s', team_id, err.message)
        } else {
          logger.debug('get(%s)', team_id)
        }

        cb(err, value)
      })
    },
    create: function (
      access_token,
      bot_access_token,
      incoming_webhook_url,
      incoming_webhook_channel,
      incoming_webhook_config_url,
      cb) {
      cb = cb || noop

      provider.set(key, value, function (err, value) {
        if (err) {
          logger.error('Error calling create(%s): %s, %s, %s, %s, %s',
            access_token,
            bot_access_token,
            incoming_webhook_url,
            incoming_webhook_channel,
            incoming_webhook_config_url,
            err.message)
        } else {
          logger.debug('create(%s, %s, %s, %s, %s)',
            access_token,
            bot_access_token,
            incoming_webhook_url,
            incoming_webhook_channel,
            incoming_webhook_config_url)
        }

        cb(err, value)
      })
    },
    del: function (team_id, cb) {
      provider.del(team_id, function (err, value) {
        if (err) {
          logger.error('Error calling del(%s): %s', team_id, err.message)
        } else {
          logger.debug('del(%s)', team_id)
        }

        cb(err, value)
      })
    },
  }
}

function noop () {}
