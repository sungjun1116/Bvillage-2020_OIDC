'use strict';
const express = require('express')
const router = express.Router()



router.get('/', (req, res) => {
  const html = `
    <!doctype html>
      <html>
      <head>
        <title>B-village - Community</title>
        <meta charset="utf-8">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
        <link rel="stylesheet" type="text/css" href="/css/community.css">
      </head>
      <body>
      
      <iframe src="http://101.101.217.192:8080/BBS" frameborder="0"></iframe>
      
      
      
      <section id="bottom_nav">
        <div class="navbar">
          <div><a class="active" href="/"><i class="fa fa-home" aria-hidden="true"></i> Home</a></div>
          <div><a class="active" href="/city/America - New_York"><i class="fa fa-info" aria-hidden="true"></i> Information</a></div>
          <div><a class="active" href="/exchange" ><i class="fa fa-usd" aria-hidden="true"></i> Exchange Rate</a></div>
          <div><a class="active" href="#"><i class="fa fa-users" aria-hidden="true"></i> Community</a></div>
          
        
        </div>
      </section>
      </body>
      </html>
    `
  res.send(html);
});

module.exports = router;