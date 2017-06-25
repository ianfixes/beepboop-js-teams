'use strict'
const Wreck = require('wreck')
const url = require('url')

module.exports = function serviceProvider (config) {
  if (!config) throw new Error('Must set config for service provider')
  if (!config.token) throw new Error('Must set token for service provider')
  if (!config.url) throw new Error('Must set url for service provider')

  let wreck = Wreck.defaults({
    baseUrl: config.url,
    headers: { 'Authorization': 'Bearer ' + config.token },
    timeout: 10000
  })

  return {
    type: 'beepboop',

    list: function (page, per_page, cb) {
      let reqUrl = {
        pathname: '/slack-teams'
      }
      if (typeof page === 'number') {
        reqUrl.query = { page: page }
      }
      if (typeof per_page === 'number') {
        reqUrl.query = { per_page: per_page }
      }

      wreck.request('GET', url.format(reqUrl), null, function (err, res) {
        if (err) return cb(err)
        if (res.statusCode === 404) return cb(null, [])

        wreck.read(res, {json: true}, function (err, body) {
          if (err) return cb(err)
          if (res.statusCode === 500 || res.statusCode === 400) return cb(new Error(body && body.error))
          if (res.statusCode !== 200) return cb(new Error('Unexpected response (' + res.statusCode + ')'))

          cb(null, body)
        })
      })
    },

    get: function (team_id, cb) {
      wreck.request('GET', '/slack-teams/' + team_id, null, function (err, res) {
        if (err) return cb(err)
        if (res.statusCode === 404) return cb(null, undefined)

        wreck.read(res, {json: true}, function (err, body) {
          if (err) return cb(err)
          if (res.statusCode === 500 || res.statusCode === 400) return cb(new Error(body && body.error))
          if (res.statusCode !== 200) return cb(new Error('Unexpected response (' + res.statusCode + ')'))

          cb(null, unwrap(body.value))
        })
      })
    },

    create: function (
      access_token,
      bot_access_token,
      incoming_webhook_url,
      incoming_webhook_channel,
      incoming_webhook_config_url,
      cb) {

      if (!config.serialize && typeof value !== 'string') {
        return cb(new Error(`value may only be string when serialize=false, not ${typeof value}`))
      }

      let payload = JSON.stringify({
        slack_bot_access_token: access_token,
        slack_access_token: bot_access_token,
        slack_incoming_webhook_url: incoming_webhook_url,
        slack_incoming_webhook_channel: incoming_webhook_channel,
        slack_incoming_webhook_config_url: incoming_webhook_config_url,
      })
      let headers = { 'Content-Type': 'application/json' }

      wreck.request('POST', '/slack-teams/', { payload, headers }, function (err, res) {
        if (err) return cb(err)
        if (res.statusCode === 404) return cb(null, '')

        wreck.read(res, {json: true}, function (err, body) {
          if (err) return cb(err)
          if (res.statusCode === 500 || res.statusCode === 400) return cb(new Error(body && body.error))
          if (res.statusCode !== 201) return cb(new Error('Unexpected response (' + res.statusCode + ')'))

          cb(null, unwrap(body.value))
        })
      })
    },

    del: function (team_id, cb) {
      wreck.request('DELETE', '/slack-teams/' + team_id, null, function (err, res) {
        if (err) return cb(err)
        if (res.statusCode === 404) return cb(null)
        if (res.statusCode === 200) return cb(null)

        wreck.read(res, {json: true}, function (err, body) {
          if (err) return cb(err)
          if (res.statusCode === 500 || res.statusCode === 400) return cb(new Error(body && body.error))

          cb(new Error('Unexpected response (' + res.statusCode + ')'))
        })
      })
    },
  }
}
