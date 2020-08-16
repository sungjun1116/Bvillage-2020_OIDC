'use strict';
const request = require('request')
const cheerio = require('cheerio')
const moment = require('moment-timezone')


exports.HTML = (filteredCity, time, news) => {
  let cityId;
  if (filteredCity === 'Asia - Shanghai') {
    cityId = 6;
  } else if (filteredCity === 'Europe - London') {
    cityId = 9;
  } else if (filteredCity === 'Australia - Sydney') {
    cityId = 1;
  } else if (filteredCity === 'America - Vancouver') {
    cityId = 4;
  } else {
    cityId = 22;
  }
  return `
  <!doctype html>
  <html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">  <!-- open souce CDN -->
    <link rel="stylesheet" type="text/css" href="/css/country.css">
  </head>
    <body>
     <!-- Simulate a smartphone / tablet -->
      <div class="mobile-container">
      <!-- Top Navigation Menu -->
        <div class="topnav">
          <a href="/city/${filteredCity}" class="active">Information</a>
          <div id="myLinks">
            <a href="/community">Community</a>
            <a href=/exchange/?id=${cityId}>Exchange Rate</a>
            <a href="/">Home</a>
          </div>
          <a href="javascript:void(0);" class="icon" onclick="myFunction()">
            <i class="fa fa-bars"></i>
          </a>
        </div>
        <div style="padding-left:16px">
          ${time}
          ${news}
        </div>
        <!-- End smartphone / tablet look -->
      </div>       
      <script>
        function myFunction() {
          var x = document.getElementById("myLinks");
          if (x.style.display === "block") {
            x.style.display = "none";
          } else {
            x.style.display = "block";
          }
        }
      </script>
        </body>
        </html>
    `;
}

exports.news = urlParse => {
  let list = '<ul>';
  let i = 0;

  while (i < urlParse.length) {
    list = list + `<li>[Category: ${urlParse[i].category}]
    <a href="${urlParse[i].url}" target="blank">
    <p>${urlParse[i].title}</p></a></li>
    `;
    i = i + 1;
  }
  list = list + '</ul>';
  return list;
}

exports.getUrl = url => {
  return new Promise(resolve => {
    request(url, (err, res, body) => {
      const $ = cheerio.load(body);
      let category = $(".gnb_comm")[0].attribs['data-category'];
      let title = $(".tit_view")[0].children[0].data;
      let contentArr = $('#harmonyContainer p');
      let content = "";
      for (let i = 0; i < contentArr.length; i++) {
        content += contentArr[i].children[0].data + " ";
      }
      let makepage = new page(url, category, title, content);

      function page(url, category, title, content) {  // page Object 생성
        this.url = url;
        this.category = category;
        this.title = title
        this.content = content;
      }
      resolve(makepage);
    })
  })
}

exports.citySelect = () => {
  let tag = '';
  let i = 0;
  const city = ['America - Los_Angeles', 'America - New_York', 'America - Vancouver', 'Asia - Shanghai', 'Europe - London', 'Australia - Sydney'];

  while (i < city.length) {
    tag += `<option value="${city[i]}">${city[i]}</option>`
    i++;
  }
  return `<select id="box" name="city" >
      ${tag}
      </select>
      `
}

exports.time = city_id => {
  const newId = city_id.replace(' - ', '/');
  const idSplit = newId.split('/')
  let country = ''; let korea = '';
  let tag = ``;

  country = moment.tz(newId).format('YYYY-MM-DD HH:mm');
  korea = moment.tz('Asia/Seoul').format('YYYY-MM-DD HH:mm');
  tag = `<p style="display: inline-block; margin-right:15%; font-size:1em;" >${idSplit[1]} 시각<br>${country}</p>
  <p style="display: inline-block;font-size:1em;"> 한국(Seoul) 시각<br>${korea}</p>`;

  return `${tag}`
}