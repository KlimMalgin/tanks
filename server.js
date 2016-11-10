
var express = require('express');
var app = new (express)()
var host = process.env.IP;
var port = process.env.PORT || 8080;

app.use('/public', express.static('public'));
app.use(express.static('libs'));
app.use(express.static('app'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html')
})

app.listen(port, host, function(error) {
  if (error) {
    console.error(error)
  } else {
    console.info('==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.', port, port)
  }
})