'use strict';
const express = require('express')
const router = express.Router()
const template = require('../lib/template')


/* GET home page. */
router.get('/', (req, res) => {
  const html = `
  <!doctype html>
    <html>
    <head>
      <title>B-village - Information</title>
      <meta charset="utf-8">
      <link rel="stylesheet" type="text/css" href="/css/index.css">
    </head>
    <body>
      <img src="/images/Bvillage.jpg" style="">
      <form action="/city/enter" method="post">
      <p>
        ${template.citySelect()}
      </p>
      <p style="font-size:2em">거주하는 곳을 선택하세요</p>
      <p>
        <input id="go" type="submit" value="G   O" >
      </p>
    </form>
    </body>
    </html>
  `
  res.send(html);
});

module.exports = router;
