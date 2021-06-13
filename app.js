const express = require('express');
const multer = require('multer');
const dest = '/Users/yanchongqing/uploads/';
const upload = multer({ dest });
const fs = require('fs');
const path = require('path');

const app = express();

app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'content-type');
  res.header('Access-Control-Allow-Methods', 'POST');

  next();
})

app.post('/upload', upload.any(), (req, res, next) => {
  res.send(`上传成功: 文件大小为${Math.floor(req.files[0].size / 1000)}K`);
  let { name, ext } = path.parse(req.files[0].originalname);
  fs.rename(`${dest}${req.files[0].filename}`, `${dest}${name}_${new Date().getTime()}${ext || '.jpeg'}`, (err) => {
    if (err) throw new Error(err);
    console.log('重命名完成');
  });
})

app.listen(3000, () => {
  console.log('file upload server is running in 3000 port');
})