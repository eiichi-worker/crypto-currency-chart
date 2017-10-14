var express = require('express')
var router = express.Router()
let http = require('http')
let https = require('https')
let request = require('then-request')
let fs = require('fs')
let async = require('async')
let apiUrl = ' https://coinbin.org/'

router.get('/', function(req, res, next) {
  res.render('admin/index', { title: 'Express' });
});

/**
 * chartデータの更新
 */
router.get('/update', function (req, res, next) {
  var apiList = {
    'history': [
      'btc',
      'eth',
      'xmr'
    ]
  }

  // todo 非同期のせいでなんかおかしい
  async.each(apiList.history, function (name, callback) {
    var url = apiUrl +  name + '/history'
    console.log("start: "+ url)
    request('GET', url).done(function (res) {
      console.log("done: "+ url)
      // console.log(res.getBody('utf8'))
      fs.writeFile('public/data/history-'+name+".json", res.getBody('utf8'));
    })
    console.log("end: "+ url)
    callback()
  },function(err){
    res.render('admin/update', { title: 'Update' })
  })

})

module.exports = router
