var connect = require('connect')
  , http = require('http')
  , fs = require('fs')
  , exec = require('child_process').exec
;

var app = connect()
  .use(connect.favicon())
  .use(connect.bodyParser())
  .use(function (req, res, next) {
    if (req.method === 'POST') {
      espeak(req.body, function (filename) {
        res.writeHead(200);
        res.end('{"filename":"'+ filename + '"}');
      });
    }
    else {
      next();
    }
  })
  .use(connect.static('public'))
  .use(function (req, res, next) {
    fs.readFile(__dirname + '/public/index.html',
    function (err, data) {
      res.writeHead(200);
      res.end(data);
    });
  })
;

var espeak = function (data, callback) {
  var d = Date.now()
    , espeak = 'espeak -f '+ __dirname + '/public/tmp/text.txt ' +
               '-w ' + __dirname + '/public/tmp/'+ d +'.wav'
  ;

  fs.writeFile(__dirname + '/public/tmp/text.txt', data.text, 'utf-8',
  function (err) {
    exec(espeak,
    function (err, stdout, stderr) {
      if (err) {console.log(err);}
    });
  });

  if(typeof callback === 'function') {
    process.nextTick(function () {
      callback(d+'.wav');
    });
  }
};

http.createServer(app).listen(9000);
