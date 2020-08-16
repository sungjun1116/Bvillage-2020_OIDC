'use strict';
const express = require('express')
const router = express.Router()
const request = require('request')
const moment = require('moment')
const temExch = require('../lib/template_exchange')

router.get('/', function (req, res) {
  let countryCode;
  countryCode = req.query.id;
  if (countryCode == undefined) {
    res.redirect('/exchange/?id=22');
  }
  console.log('주소' + req.query);
  //API 경로
  const urlApi = 'https://www.koreaexim.go.kr/site/program/financial/exchangeJSON';
  //발급키
  //const key = '0qVBnO7zW0GWjvwVSkNmD2XKIk76QMLm';
  const key = 'FdtgWWLiHCNUkpmzJwS5vYLwVNyCATkH';

  let api_url = `${urlApi}?authkey=${key}`;
  //let api_url = urlApi+ '?authkey=' + key + '&searchdate=' + searchDate+ '&data=' +data;

  function printAll() {
    request(api_url, async function (error, response, body) {


      //form 태그//

      let html1 = `<!DOCTYPE html>
          <html>
          <head>
          <meta charset="utf-8">
          <title id="title"></title>
          <script src="http://code.jquery.com/jquery-1.10.2.js"></script>
          <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
          
          </head>
          <body>
              <form>
              <select name="country" id="country">
                  <option value="55">--선택--</option>
                  <option value="22">미국</option>
                  <option value="9">영국</option>
                  <option value="6">중국</option>
                  <option value="4">캐나다</option>
                  <option value="1">호주</option>
              </select>
              </form>
              <script>
              $(document).ready(function(){
                
                //셀렉트 박스 선택 바뀌는 값 저장
                $('#country').change(function(){
                    var code;
                    code = $("#country option:selected").val();
                    console.log(code);
                    window.location.href = "/exchange/?id="+code;
                       
                });

                });
              </script>
              `;



      ///// 날짜 구하기 /////
      //오늘 날짜  
      let todayDate = moment().format("YYYYMMDD");
      //3일전 날짜
      let daysago = moment().subtract(3, 'd').format("YYYY-MM-DD");
      //일주일 전 날짜
      let weekago = moment().subtract(7, 'd').format("YYYY-MM-DD");
      //한 달 전 날짜
      let mthago1 = moment().subtract(1, 'M').format("YYYY-MM-DD");
      //세 달전 날짜
      let mthago3 = moment().subtract(3, 'M').format("YYYY-MM-DD");
      //일 년전 날짜
      let yearago = moment().subtract(1, 'Y').format("YYYY-MM-DD");



      let exInfo = new Object();
      exInfo.objtoday = await temExch.getApiInfo(api_url, countryCode, '오늘', todayDate);
      exInfo.objyesterday = await temExch.getApiInfo(api_url, countryCode, '어제', todayDate);
      exInfo.objdaysago = await temExch.getApiInfo(api_url, countryCode, '3일 전', daysago);
      exInfo.objweekago = await temExch.getApiInfo(api_url, countryCode, '1주 전', weekago);
      exInfo.objmthago1 = await temExch.getApiInfo(api_url, countryCode, '1달 전', weekago);
      exInfo.objmthago3 = await temExch.getApiInfo(api_url, countryCode, '3달 전', mthago3);
      exInfo.objyearago = await temExch.getApiInfo(api_url, countryCode, '1년 전', yearago);

      //const title = `Exchange Rate Info`;
      let html2 = temExch.HTML(exInfo);
      let htmlResult = html1 + html2;







      res.send(htmlResult);



    });
  }

  printAll();

});

router.post('/toKRW', function (req, res) {

  var result = req.body.data;
  res.send({ result: result });

});

router.post('/fromKRW', function (req, res) {

  var result = req.body.data;
  res.send({ result: result });

});


module.exports = router;