var express = require('express')
var router = express.Router()
let http = require('http')
let https = require('https')
let request = require('then-request')
let fs = require('fs')
let async = require('async')
let apiUrl = ' https://coinbin.org/'

/* GET home page. */
router.get('/update', function (req, res, next) {
  var apiList = {
    'history': [
      'btc',
      'eth',
      'xmr'
    ]
  }

  async.each(apiList.history, function (name, callback) {
    var url = apiUrl +  name + '/history'
    console.log(url)
    request('GET', url).done(function (res) {
      console.log(res.getBody('utf8'))
      fs.writeFile('public/data/history-'+name+".json", res.getBody('utf8'));
    })
  })

  res.render('admin/update', { title: 'Update' })
})

module.exports = router
