var http = require('http');
var httpProxy = require('http-proxy');

var BACKEND_SERVER = 'http://localhost:3000';

// Start proxy
var proxy = httpProxy.createProxyServer({});

/**
 * Url class for handling URL related checks
 * @param url HTTP request's URL
 * @constructor
 */
function Url(url) {
  this.url = url;
}

/**
 * Checks if requests' URL starts with some specific string
 * @param {string[]} parts - List of strings to check
 * @returns {boolean} - True if requests' URL starts with the string
 */
Url.prototype.startsWith = function(parts) {
  for (var i = 0; i < parts.length; i++) {
    var part = parts[i];
    if (this.url.indexOf(part) !== -1) {
      return true;
    }
  }
  return false;
};

Url.prototype.is = function(parts) {
  for (var i = 0; i < parts.length; i++) {
    var part = parts[i];
    if (this.url == part) {
      return true;
    }
  }
  return false;
};

var server = http.createServer(function(req, res) {
  var url = new Url(req.url);

  if (url.startsWith(['/api/', '/tmp/'])) {
    proxy.web(req, res, { target: BACKEND_SERVER },
      function(e) {console.error(e)});
  }
  else {
    proxy.web(req, res, { target: 'http://localhost:3333/' },
      function(e) {console.error(e)});
  }
});

console.log("Listening on port 9000");
server.listen(9000);
