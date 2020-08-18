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

  //API 경로
  const urlApi = 'https://www.koreaexim.go.kr/site/program/financial/exchangeJSON';
  //발급키
  //const key = '0qVBnO7zW0GWjvwVSkNmD2XKIk76QMLm';
  // const key = 'FdtgWWLiHCNUkpmzJwS5vYLwVNyCATkH';
  const key = 'VetZYnrCBpsNBsrE8wbziEue3huMrUfk';

  let api_url = `${urlApi}?authkey=${key}`;
  //let api_url = urlApi+ '?authkey=' + key + '&searchdate=' + searchDate+ '&data=' +data;

  function printAll() {
    request(api_url, async function (error, response, body) {


      //form 태그//

      let html1 = `<!DOCTYPE html>
          <html>
          <head>
          <meta charset="utf-8">
          <title>B-village - Exchange Rate</title>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
          <script src="http://code.jquery.com/jquery-1.10.2.js"></script>
          <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
          <link rel="stylesheet" type="text/css" href="/css/exchange.css">
          </head>
          <body>              
              <!-- 셀렉트박스 -> 국가 선택 -->
              <form>                
                <select name="country" id="country">
                  <option value="22" >== 선택 ==</option>
                  <option value="22">미국</option>
                  <option value="9">영국</option>
                  <option value="6">중국</option>
                  <option value="4">캐나다</option>
                  <option value="1">호주</option>
                </select>                                      
              </form>
              <br>
              

              <script>
              $(document).ready(function(){
                
                //셀렉트 박스 선택 바뀌는 값 저장 -> 국가 선택에 따라 페이지 이동
                $('#country').change(function(){
                    var code;
                    code = $("#country option:selected").val();
                    window.location.href = "/exchange/?id="+code;
                       
                });

                });
              </script>
              `;



      ///// 날짜 구하기 /////
      //오늘 날짜  
      let todayDate = moment();
      //어제 날짜
      let yesterDate = moment().subtract(1, 'd');
      //3일전 날짜
      let daysago = moment().subtract(3, 'd');
      //일주일 전 날짜
      let weekago = moment().subtract(7, 'd');
      //한 달 전 날짜
      let mthago1 = moment().subtract(1, 'M');
      //세 달전 날짜
      let mthago3 = moment().subtract(3, 'M');
      //일 년전 날짜
      let yearago = moment().subtract(1, 'Y');




      let exInfo = new Object();
      //오늘~2일전 환율 정보
      exInfo.objtoday = await temExch.getApiInfo(api_url, countryCode, '오늘', todayDate.format("YYYY-MM-DD"));
      if (exInfo.objtoday.trading_rate == null) {
        exInfo.objtoday = await temExch.getApiInfo(api_url, countryCode, '어제', yesterDate.format("YYYY-MM-DD"));
        if (exInfo.objtoday.trading_rate == null) {
          let dbyDate = moment().subtract(2, 'd');
          exInfo.objtoday = await temExch.getApiInfo(api_url, countryCode, '2일 전', dbyDate.format("YYYY-MM-DD"));
        }
      }
      exInfo.objyesterday = await temExch.getApiInfo(api_url, countryCode, '어제', yesterDate.format("YYYY-MM-DD"));

      //3~5일전 환율 정보
      exInfo.objdaysago = await temExch.getApiInfo(api_url, countryCode, '3일 전', daysago.format("YYYY-MM-DD"));
      if (exInfo.objdaysago.trading_rate == null) {
        let daysago4 = moment().subtract(4, 'd');
        exInfo.objdaysago = await temExch.getApiInfo(api_url, countryCode, '4일 전', daysago4.format("YYYY-MM-DD"));
        if (exInfo.objdaysago.trading_rate == null) {
          let daysago5 = moment().subtract(5, 'd');
          exInfo.objdaysago = await temExch.getApiInfo(api_url, countryCode, '5일 전', daysago5.format("YYYY-MM-DD"));
        }
      }

      //일주일 전 환율 정보
      exInfo.objweekago = await temExch.getApiInfo(api_url, countryCode, '1주 전', weekago.format("YYYY-MM-DD"));
      //7일 전 데이터가 없을 경우를 대비하여 13일 전까지 데이터 있을 때까지 검색
      for (var i = 8; i < 14; i++) {
        weekago = moment().subtract(i, 'd');
        exInfo.objweekago = await temExch.getApiInfo(api_url, countryCode, '1주 전', weekago.format("YYYY-MM-DD"));
      }


      //한 달 전 환율 정보
      exInfo.objmthago1 = await temExch.getApiInfo(api_url, countryCode, '1달 전', mthago1.format("YYYY-MM-DD"));

      //데이터가 없을 경우를 대비하여 5일전까지 데이터 있을 때까지 검색
      for (var i = 1; i < 6; i++) {
        //오늘과 1달 전의 날짜 차이
        var diff = todayDate.diff(mthago1, 'days');
        if (exInfo.objmthago1.trading_rate == null) {
          mthago1 = moment().subtract(diff + i, 'd');
          exInfo.objmthago1 = await temExch.getApiInfo(api_url, countryCode, '1달 전', mthago1.format("YYYY-MM-DD"));
        } else {
          break;
        }
      }


      //3달전 환율 정보
      exInfo.objmthago3 = await temExch.getApiInfo(api_url, countryCode, '3달 전', mthago3.format("YYYY-MM-DD"));

      //데이터가 없을 경우를 대비하여 5일전까지 데이터 있을 때까지 검색
      for (var i = 1; i < 6; i++) {
        //오늘과 3달 전의 날짜 차이
        var diff = todayDate.diff(mthago3, 'days');
        if (exInfo.objmthago3.trading_rate == null) {
          mthago3 = moment().subtract(diff + i, 'd');
          exInfo.objmthago3 = await temExch.getApiInfo(api_url, countryCode, '3달 전', mthago3.format("YYYY-MM-DD"));
        } else {
          break;
        }
      }

      //1년 전 국가 코드는 현재와 1만큼 다름
      if (countryCode != "1") {
        countryCode = countryCode - 1;
      }


      //일 년전 환율 정보
      exInfo.objyearago = await temExch.getApiInfo(api_url, countryCode, '1년 전', yearago.format("YYYY-MM-DD"));

      //데이터가 없을 경우를 대비하여 5일전까지 데이터 있을 때까지 검색
      for (var i = 1; i < 6; i++) {
        //오늘과 3달 전의 날짜 차이
        var diff = todayDate.diff(yearago, 'days');
        if (exInfo.objyearago.trading_rate == null) {
          yearago = moment().subtract(diff + i, 'd');
          exInfo.objyearago = await temExch.getApiInfo(api_url, countryCode, '1년 전', yearago.format("YYYY-MM-DD"));
        } else {
          break;
        }
      }




      let html2 = temExch.HTML(exInfo); //모든 환율 정보가 저장된 객체를 템플릿에 파라미터로 전달.

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