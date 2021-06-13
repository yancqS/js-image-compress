const express = require('express');
const multer = require('multer');
const upload = multer({ dest: '/Users/yanchongqing/uploads/' });
const fs = require('fs');

const app = express();

app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'content-type');
  res.header('Access-Control-Allow-Methods', 'POST');

  next();
})

app.post('/upload', upload.any(), (req, res, next) => {
  res.send('上传成功')
  console.log(req.files);
})

app.listen(3000, () => {
  console.log('file upload server is running in 3000 port');
})