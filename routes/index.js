var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('../config');

router.get('/', function(req, res) {
  res.render('index', { community: config.community });
});

router.post('/invite', function(req, res) {
  request.post({
    url: 'https://'+ config.slackUrl + '/api/users.admin.invite',
    form: {
      email: req.body.email,
      token: config.slacktoken,
      set_active: true
    }
  }, function(err, httpResponse, body) {
    // body looks like:
    //   {"ok":true}
    //       or
    //   {"ok":false,"error":"already_invited"}
    if (err) { return res.render('error',{error: err}); }
    body = JSON.parse(body);
    if (body.ok) {
      res.render('success', { email: req.body.email });
    } else {
      res.render('error', { error: body.error })
    }
  });
});

module.exports = router;
