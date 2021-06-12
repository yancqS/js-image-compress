(function(win) {
  function imgCompress() {}
  let _proto = imgCompress.prototype;
  let log = console.log;
  win.imgCompress = imgCompress;

  _proto.file2DataUrl = function file2DataUrl(file, callback = log) {
    let reader = new FileReader();
    reader.onload = function() {
      _proto.url2Image(reader.result, callback);
      callback('loaded in file2DataUrl', reader.result.slice(0, 50));
    }
    reader.readAsDataURL(file);
  }

  _proto.file2Image = function file2Image(file, callback = log) {
    let img = new Image();
    let URL = win.webkitURL || win.URL;
    if(URL) {
      let url = URL.createObjectURL(file);
      img.onload = function() {
        callback('loaded in file2Image', url);
        document.body.querySelector('.imgList').appendChild(img);

        let canvas = _proto.img2Canvas(img);
        document.body.querySelector('.imgList').appendChild(canvas);

        let canvas_url = _proto.canvas2DataUrl(canvas, 0.1, 'image/webp');
        _proto.url2Image(canvas_url);

        _proto.dataUrl2Image(canvas_url);

        URL.revokeObjectURL(url);
      };
      img.src = url;
    }
  }

  _proto.url2Image = function url2Image(url, callback = log) {
    let img = new Image();
    img.onload = function() {
      callback('loaded in url2Image', img);
      document.body.querySelector('.imgList').appendChild(img);
    }
    img.src = url;
  }

  _proto.img2Canvas = function img2Canvas(img) {
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas;
  }

  _proto.canvas2DataUrl = function canvas2DataUrl(canvas, quality, type) {
    return canvas.toDataURL(type || 'image/jpeg', quality || 0.8);
  }

  _proto.dataUrl2Image = function dataUrl2Image(url, callback = log) {
    let img = new Image();
    img.onload = function() {
      document.body.querySelector('.imgList').appendChild(img);
      callback(img);
    };
    img.src = url;
  }
})(window)