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
      <img src="/images/Bvillage.jpg" style="width:80%; display:block; margin-top:20%">
      <form action="/city/enter" method="post">
      <p>
        ${template.citySelect()}
      </p>
      <p>
        <input type="submit" value="도시 선택" style="width:40%;height:20%;font-size:30px;margin:10% 30%;">
      </p>
    </form>
    </body>
    </html>
  `
  res.send(html);
});

module.exports = router;
