var FONT = require('./font');
var pnglib = require('./pnglib');

function Captcha(width, height, dispNumber, padding) {
  this.depth = 256;
  this.width = width;
  this.height = height;
  this.padding = padding || 20;
  this.dispNumber = '' + dispNumber.toString();
  this.widthAverage = parseInt((this.width - padding * 2) / this.dispNumber.length);
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

Captcha.prototype.render = function() {
  for (var numSection = 0; numSection < this.dispNumber.length; numSection++) {
    // var rotary_src = new pnglib(this.width, this.height, this.depth);
    // rotary_src.color(0, 0, 0, 0);
    // var dispNum = this.dispNumber[numSection].valueOf();

    // var random_x_offs = parseInt(0.5 * (this.widthAverage - FONT[dispNum][0].length));
    // var random_y_offs = parseInt(0.5 * (this.height - FONT[dispNum].length));

    // random_x_offs = (random_x_offs < 0 ? 0 : random_x_offs);
    // random_y_offs = (random_y_offs < 0 ? 0 : random_y_offs);

    // random_x_offs += padding;

    // for (var i = 0;
    //   (i < FONT[dispNum].length) && ((i + random_y_offs) < this.height); i++) {
    //   for (var j = 0; j < FONT[dispNum][i].length; j++) {
    //     if ((FONT[dispNum][i][j] == '1') && (this.widthAverage * numSection + random_x_offs + j) < this.width) {
    //       rotary_src.buffer[rotary_src.index(this.widthAverage * numSection + random_x_offs, i + random_y_offs) + j] = '1';
    //     } else {
    //       rotary_src.buffer[rotary_src.index(this.widthAverage * numSection + random_x_offs, i + random_y_offs) + j] = '';
    //     }
    //   }
    // }

    // this.rotary({
    //   width: 120,
    //   height: 44
    // }, png, rotary_src, Math.PI / 30);
  }
};

Captcha.prototype.rotary = function(pos, src, angle, zoom) {
  var rx = src.width * 0.5;
  var ry = src.height * 0.5;
  var color = dest.color(82, 146, 208);

  for (var y = 0; y < src.height; y++) {
    for (var x = 0; x < src.width; x++) {
      var srcx = (x - rx) / zoom * Math.cos(angle) - (y - ry) / zoom * Math.sin(angle) + rx;
      var srcy = (x - rx) / zoom * Math.sin(angle) + (y - ry) / zoom * Math.cos(angle) + ry;
      if (src.buffer[src.index(parseInt(srcx), parseInt(srcy))] !== '1') continue;
      this.dest.buffer[dest.index(pos.x + x, pos.y + y)] = color;
    }
  }
};

Captcha.prototype.noise = function() {
  var dest = this.dest;
  var color = dest.color(165, 213, 236);
  for (var x = 0; x < this.width; x++) {
    for (var y = 0; y < this.height; y++) {
      if (Math.random() < .03) {
        dest.buffer[dest.index(x + 0, y + 0)] = color;
      }
      if (Math.random() < .001) {
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