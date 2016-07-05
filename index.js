var uuid = require('node-uuid');
var Captcha = require('./lib/captcha');

var SESSION_NAME = 'SESSIONID';
var SESSION_REG = /SESSIONID=([-\w]+)/;

var session_map = {
  get: function() {
    var id = uuid.v4();
    setTimeout(function() {
      delete session_map[id]
    }, 10 * 60 * 1000);
    return id;
  },
  remove: function(id) {
    delete session_map[id];
  }
};

function get(ctx, width, height, code) {
  width = width || 120;
  height = height || 44;
  code = code || Math.random().toString().substr(-4);
  var imgbase64 = new Captcha(width, height, code).get('base64');
  var session_id = session_map.get();
  ctx.cookies.set(SESSION_NAME, session_id);
  session_map[session_id] = code;
  return [imgbase64, session_id];
};

function check(ctx, code) {
  var cookie = ctx.headers['cookie'] || '';
  var session_id = (cookie.match(SESSION_REG) || [0, 0])[1];
  if (!session_id) return false;
  var result = session_map[session_id] === code;
  session_map.remove(session_id);
  return result;
}

module.exports = {
  get: get,
  check: check
};