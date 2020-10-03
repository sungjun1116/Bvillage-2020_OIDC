'use strict';
const express = require('express')
const router = express.Router()
const path = require('path')
const request = require('request')
const cheerio = require('cheerio')  // Crawlling 관련 module
const template = require('../lib/template')

// 선택한 도시정보를 사용해 redirect하는 page
router.post('/enter', (req, res, next) => {
  const post = req.body;
  // const city = post.city;
  // res.redirect(`/city/${city}`);
  res.send(`${post}`);
});

// 선택한 도시정보에 해당하는 information page
router.get('/:pageId', function (req, res, next) {
  const filteredCity = path.parse(req.params.pageId).base

  // 'https://news.daum.net'에서 new url만 뽑아서 처리
  const crawllingByNewsHome = () => {
    request('https://news.daum.net/', async function (error, response, body) {
      const $ = cheerio.load(body);
      let aArr = [];
      aArr = $("a");

      let newsArr = [];
      for (let i = 0; i < aArr.length; i++) {
        if (aArr[i].attribs.href.includes("news.v.daum.net") && ((aArr[i].attribs.class.includes('link_txt'))))
          newsArr.push(aArr[i].attribs.href);
      }

      let urlParse = [];
      for (let url of newsArr) {
        urlParse.push(await template.getUrl(url));
      }

      const time = template.time(filteredCity);
      const news = template.news(urlParse);
      const html = template.HTML(filteredCity, time, news);

      res.send(html);

    })
  }
  crawllingByNewsHome();
});


module.exports = router;
