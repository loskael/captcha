var FONT = require('./font');
var pnglib = require('./pnglib');

function Captcha(width, height, dispNumber, padding) {
  this.depth = 256;
  this.width = width;
  this.height = height;
  this.padding = padding || 27;
  this.dispNumber = '' + dispNumber.toString();
  this.widthAverage = parseInt((this.width - this.padding * 2) / this.dispNumber.length);
  this.dest = new pnglib(this.width, this.height, this.depth);
  this.background();
  this.render();
  this.noise();
}

Captcha.prototype.background = function() {
  var dest = this.dest;
  dest.color(0, 0, 0, 0);
  for (var x = 0; x < this.width; x++) {
    var temp = 180 + x * 0.3;
    for (var y = 0; y < this.height; y++) {
      var gray = Math.min(temp + y * 1, 255);
      dest.buffer[dest.index(x + 0, y + 0)] = dest.color(gray, gray, gray);
    }
  }
};

Captcha.prototype.char = function(number){
  var font = FONT[parseInt(number, 10)];

  var char = new pnglib(this.height, this.height, this.depth);
  char.color(0, 0, 0, 0);

  var rx = Math.floor((this.height - font[0].length) / 2);
  var ry = Math.floor((this.height - font.length) / 2);
  for (var x = 0; x < font.length; x++) {
    for (var y = 0; y < font[x].length; y++) {
      if (font[x][y] !== '1') continue;
      char.buffer[char.index(rx, x + ry) + y] = '1';
    }
  }

  return char;
};

Captcha.prototype.random_angle = function() {
  return (Math.random() > 0.5 ? 1 : -1) * Math.PI / (Math.random() * 30 + 30);
};

Captcha.prototype.render = function() {
  var index = 0;
  var chars = this.dispNumber.split('');
  while(chars.length) {
    var char = this.char(chars.shift());
    var offset = {
      x: this.padding + index * this.widthAverage - Math.floor((this.height - this.widthAverage) / 2),
      y: 0,
    };
    this.rotary(offset, char, this.random_angle(), 1.5);
    index++;
  }
};

Captcha.prototype.rotary = function(offset, src, angle, zoom) {
  var rx = src.width * 0.5;
  var ry = src.width * 0.5;
  var color = this.dest.color(82, 146, 208);

  for (var y = 0; y < src.height; y++) {
    for (var x = 0; x < src.width; x++) {
      var srcx = (x - rx) / zoom * Math.cos(angle) - (y - ry) / zoom * Math.sin(angle) + rx;
      var srcy = (x - rx) / zoom * Math.sin(angle) + (y - ry) / zoom * Math.cos(angle) + ry;
      if (src.buffer[src.index(parseInt(srcx), parseInt(srcy))] !== '1') continue;
      this.dest.buffer[this.dest.index(offset.x + x, offset.y + y)] = color;
    }
  }
};

Captcha.prototype.noise = function() {
  var dest = this.dest;
  var color = dest.color(165, 213, 236);
  for (var x = 0; x < this.width; x++) {
    for (var y = 0; y < this.height; y++) {
      if (Math.random() < 0.03) {
        dest.buffer[dest.index(x + 0, y + 0)] = color;
      }
      if (Math.random() < 0.01) {
        dest.buffer[dest.index(x + 0, y + 0)] = color;
        dest.buffer[dest.index(x + 1, y + 0)] = color;
        dest.buffer[dest.index(x + 0, y + 1)] = color;
        dest.buffer[dest.index(x + 1, y + 1)] = color;
      }
    }
  }
};

Captcha.prototype.get = function(type) {
  if (type === 'base64') {
    return new Buffer(this.dest.getBase64(), 'base64');
  }
  return this.dest;
};

module.exports = Captcha;