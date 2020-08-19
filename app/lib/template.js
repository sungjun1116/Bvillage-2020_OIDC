'use strict';
const request = require('request')
const cheerio = require('cheerio')
const moment = require('moment-timezone')


// 도시정보, 시간정보, 뉴스정보 모두를 취합해서 구성한 HTML page 
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
    <title>B-village - Information</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">  <!-- open souce CDN -->
    <link rel="stylesheet" type="text/css" href="/css/country.css">
  </head>
    <body>
     
        <div style="padding-left:16px">
          ${time}
          ${news}
        </div>       
      
      <div id="footer"></div>
        <section id="bottom_nav">
          <div class="navbar">
          <div><a class="active" href="/"><i class="fa fa-home" aria-hidden="true"></i> Home</a></div>
          <div><a class="active" href="#"><i class="fa fa-info" aria-hidden="true"></i> Information</a></div>
          <div><a class="active" href="/exchange/?id=${cityId}" ><i class="fa fa-usd" aria-hidden="true"></i> Exchange Rate</a></div>
          <div><a class="active" href="/community"><i class="fa fa-users" aria-hidden="true"></i> Community</a></div>
                       
          
          </div>
        </section>    
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


// news url 에서 title, content, category를 따로 parsing하여 사용하는 기능
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


// 뉴스 정보 제공
exports.news = urlParse => {
  let list = '<ul>';
  let i = 0;

  while (i < urlParse.length) {
    list = list + `<li>[Category: ${urlParse[i].category}]
    <a href="${urlParse[i].url}" target="blank">
    <p id="news_title">${urlParse[i].title}</p></a></li>
    `;
    i = i + 1;
  }
  list = list + '</ul>';
  return list;
}


// index page의 도시선택 부분 
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

// 해당하는 도시정보를 받아서 한국과 현지시각을 비교해주는 부분
exports.time = city_id => {
  const newId = city_id.replace(' - ', '/');
  const idSplit = newId.split('/')
  let country = ''; let korea = '';
  let tag = ``;

  country = moment.tz(newId).format('YYYY-MM-DD HH:mm');
  korea = moment.tz('Asia/Seoul').format('YYYY-MM-DD HH:mm');
  tag = `<div id="time"><p class='showTime'>${idSplit[1]} 시각<br>${country}</p>
  <div class="vl"></div><p class='showTime'> 한국(Seoul) 시각<br>${korea}</p></div>`;

  return `${tag}`
}