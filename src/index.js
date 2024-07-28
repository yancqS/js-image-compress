(function (win) {
  function ImgCompress() {
  }

  let _proto = ImgCompress.prototype;
  let log = console.log;
  win.imgCompress = ImgCompress;

  _proto.file2DataUrl = function file2DataUrl(file, callback = log) {
    return new Promise((resolve) => {
      let reader = new FileReader();
      reader.onload = function () {
        callback('loaded in file2DataUrl', reader.result.slice(0, 50));
        resolve(reader.result)
      }
      reader.readAsDataURL(file);
    })
  }

  _proto.file2Image = function file2Image(file, callback = log) {
    return new Promise((resolve) => {
      let img = new Image();
      let URL = win.webkitURL || win.URL;
      if (URL) {
        let url = URL.createObjectURL(file);
        img.onload = function () {
          callback('loaded in file2Image', url);
          document.body.querySelector('.imgList').appendChild(img);
          URL.revokeObjectURL(url);
          resolve(img);
        };
        img.src = url;
      }
    })
  }

  _proto.url2Image = function url2Image(url, callback = log) {
    return new Promise((resolve) => {
      let img = new Image();
      img.onload = function () {
        callback('loaded in url2Image', img);
        document.body.querySelector('.imgList').appendChild(img);
        resolve(img);
      }
      img.src = url;
    })
  }

  _proto.img2Canvas = function img2Canvas(img, callback = log) {
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    document.body.querySelector('.imgList').appendChild(canvas);
    callback('loaded in img2Canvas', canvas);
    return canvas;
  }

  _proto.canvas2DataUrl = function canvas2DataUrl(canvas, quality, type) {
    return canvas.toDataURL(type || 'image/jpeg', quality || 0.8);
  }

  _proto.dataUrl2Image = function dataUrl2Image(url, callback = log) {
    return new Promise((resolve) => {
      let img = new Image();
      img.onload = function () {
        callback('loaded in dataUrl2Image', img);
        document.body.querySelector('.imgList').appendChild(img);
        resolve(img);
      }
      img.src = url;
    })
  }

  _proto.dataUrl2Blob = function dataUrl2Blob(dataUrl, type) {
    let data = dataUrl.split(',')[1];
    let mimePattern = /^data:(.*);base64,/;
    let mime = dataUrl.match(mimePattern)[1];
    let binStr = atob(data); // base64解码
    let len = binStr.length;
    let arr = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
      arr[i] = binStr.charCodeAt(i);
    }
    return new Blob([arr], {type: type || mime});
  }

  _proto.canvas2Blob = function canvas2Blob(canvas, callback = log, quality, type) {
    canvas.toBlob(blob => {
      callback(blob);
    }, type || 'image/jpeg', quality || 0.8);
  }

  _proto.blob2DataUrl = function blob2DataUrl(blob, callback = log) {
    return _proto.file2DataUrl(blob, callback);
  }

  _proto.blob2Image = function blob2Image(blob, callback = log) {
    return _proto.file2Image(blob, callback);
  }

  _proto.upload = function upload(url, file, callback) {
    const xhr = new XMLHttpRequest();
    const fd = new FormData();
    fd.append('file', file);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          // 上传成功
          callback && callback(xhr.responseText);
        } else {
          throw new Error('upload fail');
        }
      }
    }
    xhr.open('POST', url, true);
    xhr.send(fd);
  }
})(window)