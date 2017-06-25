[![Sponsored by Beep Boop](https://img.shields.io/badge/%E2%9D%A4%EF%B8%8F_sponsored_by-%E2%9C%A8_Robots%20%26%20Pencils%20%2F%20Beep%20Boop_%E2%9C%A8-FB6CBE.svg)](https://beepboophq.com)

# [Beep Boop](https://beepboophq.com) Teams JS Client

This is a node.js client for the [Beep Boop Teams service](https://beepboophq.com/docs/article/api-teams).
If running on Beep Boop the below example should just work. If running outside of Beep Boop it will fall back to an in memory
store. See further configuration options below.

```javascript
var teams = require('beepboop-teams')()
var page = 0
var per_page = 10
teams.list(page, per_page, function (err, result) {
  // handle error :)
  console.log(JSON.stringify(result, null, 2));
})
```

## BeepBoopPersist([options])
Returns a Beep Boop Perist api:

+ `options.token` - defaults to `process.env.BEEPBOOP_TOKEN` - auth token passed into environment by Beep Boop
+ `options.url` - defaults to `process.env.BEEPBOOP_API_URL || 'https://beepboophq.com/api/v1'` - service url passed into environment by Beep Boop
+ `options.debug` - defaults to `false` - if `true` then api calls and errors are logged.
+ `options.logger` - defaults to `null` - Should be an object w/ a `debug` and `error` function.


## I was too lazy to copy the API over at the moment
