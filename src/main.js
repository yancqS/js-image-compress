class ImageCompress {
  REGEXP_IMAGE_TYPE = /^image\//;
  defaultOption = {
    file: null,
    quality: 0.8
  };
  isFunc = fn => typeof fn === 'function';
  isImage = type => this.REGEXP_IMAGE_TYPE.test(type);

  constructor(options) {
    this.options = Object.assign({}, this.defaultOption, options);
    this.file = this.options.file;
    this.init();
  }

  async init() {
    let file = this.file;
    let options = this.options;

    if (!file || !this.isImage(file.type)) {
      console.error('请上传图片');
    }

    if (!this.isImage(options.mimeType)) {
      options.mimeType = file.type;
    }

    let image = await this.file2Image(file);
    options.container && document.querySelector(options.container).appendChild(image);
    options.beforeCompress && options.beforeCompress(file);
    let canvas = this.image2Canvas(image);
    let blob = await this.canvas2Blog(canvas, options.quality, options.mimeType);
    let compress_img = await this.file2Image(blob);
    options.container && document.querySelector(options.container).appendChild(compress_img);
    options.successCompress && options.successCompress(blob);
    options.upload_url && this.upload(options.upload_url, blob, console.log);
    let compress_img_url = await this.file2DataUrl(blob);
    this.download(compress_img_url);
  }

  download(url) {
    let a = document.createElement('a');
    a.href = url;
    a.download = 'downImage' + new Date().getTime();
    a.innerText = '下载';
    document.body.appendChild(a);
  }

  file2Image(file) {
    return new Promise((resolve, reject) => {
      let img = new Image();
      let URL = window.webkitURL || window.URL;
      if (URL) {
        let url = URL.createObjectURL(file);
        img.onload = function () {
          URL.revokeObjectURL(url);
          resolve(img);
        };
        img.src = url;
      }
    })
  }

  file2DataUrl(file) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.onload = function () {
        resolve(reader.result)
      }
      reader.readAsDataURL(file);
    })
  }

  image2Canvas(img) {
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    canvas.width = this.options.width || img.naturalWidth;
    canvas.height = this.options.height || img.naturalHeight;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    this.options.watermark && this.drawWaterMark(ctx, canvas, this.options.watermark);
    return canvas;
  }

  canvas2Blog(canvas, quality, type) {
    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        resolve(blob);
      }, type || 'image/jpeg', quality || 0.8);
    })
  }

  upload(url, file, callback) {
    var xhr = new XMLHttpRequest();
    var fd = new FormData();
    fd.append('file', file);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          // 上传成功
          callback && callback(xhr.responseText);
        } else {
          throw new Error(xhr);
        }
      }
    }
    xhr.open('POST', url, true);
    xhr.send(fd);
  }

  drawWaterMark(ctx, canvas, watermark) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.font = (canvas.width * 0.05) + 'px microsoft yahei';
    ctx.fillText(watermark, 10, canvas.height - 20);
  }
}