'use strict';
const request = require('request')

exports.HTML = (exInfo) => {
  //국가 코드에 따른 도시 시간
  var cityTime = exInfo.objtoday.key;
  switch (cityTime) {
    case '6':
      cityTime = 'Asia - Shanghai'
      break;
    case '9':
      cityTime = 'Europe - London';
      break;
    case '1':
      cityTime = 'Australia - Sydney';
      break;
    case '4':
      cityTime = 'America - Vancouver';
      break;
    case '22':
      cityTime = 'America - New_York';
      break;
    default:
      cityTime = 'America - New_York';
      break;
  }


  return `
    
        <section id="main">            
            
            <!--국가명, 통화명-->
            <h3 id="cur_title">${exInfo.objtoday.currency}</h3>
            <br>
            <!--날짜별 환율 변동 정보-->
            <p class="info_title">${exInfo.objtoday.txtDate} 날짜  ${exInfo.objtoday.resultDate}</p>
            <p id="content1"></p>
            <p class="info_title">${exInfo.objdaysago.txtDate} 날짜  ${exInfo.objdaysago.resultDate}</p>
            <p id="content2"></p>
            <p class="info_title">${exInfo.objweekago.txtDate} 날짜  ${exInfo.objweekago.resultDate}</p>
            <p id="content3"></p>
            <p class="info_title">${exInfo.objmthago1.txtDate} 날짜  ${exInfo.objmthago1.resultDate}</p>
            <p id="content4"></p>
            <p class="info_title">${exInfo.objmthago3.txtDate} 날짜  ${exInfo.objmthago3.resultDate}</p>
            <p id="content5"></p>
            <p class="info_title">${exInfo.objyearago.txtDate} 날짜  ${exInfo.objyearago.resultDate}</p>
            <p id="content6"></p>
            <br>
            <!--환율 그래프-->
            <div id="chart"></div>
            <br>
            <!--환율 계산기-> 매매기준율, 송금보낼때/받을때의 환율을 나누어 계산 가능-->
            <h3>환율 계산기</h3>
            <div id="calculator" >
                
                <input type="radio" id="tr_tab" checked="checked" name="converter_type" value="trading_rate">
                <label class="calType" for="tr_tab">매매기준율</label>

                
                <input type="radio" id="sd_tab"name="converter_type" value="send_rate">                
                <label class="calType" for="sd_tab">송금 보낼 때</label>

                
                <input type="radio" id="rcv_tab" name="converter_type" value="receive_rate">                
                <label class="calType" for="rcv_tab">송금 받을 때</label>
            </div>
            <div id="converter">
              <div class="con">
                <h5>${exInfo.objtoday.currency.replace('(', '').replace(')', '')} (${exInfo.objtoday.cur_code})</h5>
                <input id ="input" type="text" onKeyup="this.value=this.value.replace(/[^0-9]/g,'');"/>
              </div>
              <h1> = </h1>
              <div class="con">
                <h5>한국 원화 (KRW)</h5>
                <input id="output"type="text" onKeyup="this.value=this.value.replace(/[^0-9]/g,'');"/>
              </div>              
            </div>
        </section>
        <div id="footer"></div>
        <section id="bottom_nav">
          <div class="navbar">
            <div><a class="active" href="/"><i class="fa fa-home" aria-hidden="true"></i> Home</a></div>
            <div><a class="active" href="/city/${cityTime}"><i class="fa fa-info" aria-hidden="true"></i> Information</a></div>
            <div><a class="active" href="#" ><i class="fa fa-usd" aria-hidden="true"></i> Exchange Rate</a></div>
            <div><a class="active" href="/community"><i class="fa fa-users" aria-hidden="true"></i> Community</a></div>
            
          
          </div>
        </section>
        <script type="text/javascript">
            //구글 차트 이용하여 환율 그래프 그리기
            google.charts.load('current', {'packages':['corechart']});
            google.charts.setOnLoadCallback(drawChart);
            function drawChart(){
    
              
                //환율 그래프 데이터              
                var data = new google.visualization.arrayToDataTable([
                    ['날짜', '환율 (원)'],
                    ['${exInfo.objyearago.txtDate}  ${exInfo.objyearago.resultDate}', ${exInfo.objyearago.trading_rate}],
                    ['${exInfo.objmthago3.txtDate}  ${exInfo.objmthago3.resultDate}', ${exInfo.objmthago3.trading_rate}],
                    ['${exInfo.objmthago1.txtDate}  ${exInfo.objmthago1.resultDate}', ${exInfo.objmthago1.trading_rate}],
                    ['${exInfo.objweekago.txtDate}  ${exInfo.objweekago.resultDate}', ${exInfo.objweekago.trading_rate}],
                    ['${exInfo.objdaysago.txtDate}  ${exInfo.objdaysago.resultDate}', ${exInfo.objdaysago.trading_rate}],
                    ['${exInfo.objtoday.txtDate}  ${exInfo.objtoday.resultDate}', ${exInfo.objtoday.trading_rate}]
                ]);
                
                var option = {                    
                    width:'80%',
                    height:400,
                    colors: ['red']                   
                    
                };

                var formatter = new google.visualization.NumberFormat({decimalSymbol: '.', pattern:'###,###.##'}); // 소수점변환
                formatter.format(data, 1);



                var chart = new google.visualization.LineChart(document.getElementById('chart'));
                chart.draw(data, option);
                window.addEventListener('resize',drawChart,false);
            }
      
      


        //환율 변동 텍스트 정보 제공    
        var text1 = '매매기준율 : ${String(exInfo.objtoday.trading_rate)}원 / 송금 보낼 때 : ${String(exInfo.objtoday.send_rate)}원 / 송금 받을 때 : ${String(exInfo.objtoday.receive_rate)}원';
        var text2 = '매매기준율 : ${String(exInfo.objdaysago.trading_rate)}원 / 송금 보낼 때 : ${String(exInfo.objdaysago.send_rate)}원 / 송금 받을 때 : ${String(exInfo.objdaysago.receive_rate)}원';
        var text3 = '매매기준율 : ${String(exInfo.objweekago.trading_rate)}원 / 송금 보낼 때 : ${String(exInfo.objweekago.send_rate)}원 / 송금 받을 때 : ${String(exInfo.objweekago.receive_rate)}원';
        var text4 = '매매기준율 : ${String(exInfo.objmthago1.trading_rate)}원 / 송금 보낼 때 : ${String(exInfo.objmthago1.send_rate)}원 / 송금 받을 때 : ${String(exInfo.objmthago1.receive_rate)}원';
        var text5 = '매매기준율 : ${String(exInfo.objmthago3.trading_rate)}원 / 송금 보낼 때 : ${String(exInfo.objmthago3.send_rate)}원 / 송금 받을 때 : ${String(exInfo.objmthago3.receive_rate)}원';
        var text6 = '매매기준율 : ${String(exInfo.objyearago.trading_rate)}원 / 송금 보낼 때 : ${String(exInfo.objyearago.send_rate)}원 / 송금 받을 때 : ${String(exInfo.objyearago.receive_rate)}원';
        
        
        text1 = text1.replace(/null원/gi, ' 결과 없음 ');
        text2 = text2.replace(/null원/gi, ' 결과 없음 ');
        text3 = text3.replace(/null원/gi, ' 결과 없음 ');
        text4 = text4.replace(/null원/gi, ' 결과 없음 ');
        text5 = text5.replace(/null원/gi, ' 결과 없음 ');
        text6 = text6.replace(/null원/gi, ' 결과 없음 ');
        
        document.getElementById('content1').innerHTML= text1;
        document.getElementById('content2').innerHTML= text2;
        document.getElementById('content3').innerHTML= text3;
        document.getElementById('content4').innerHTML= text4;
        document.getElementById('content5').innerHTML= text5;
        document.getElementById('content6').innerHTML= text6;


        
        $(document).ready(function() {
            
            var result;
            
            //매매기준율 타 통화->원화
            $('#input').click(function(){
              $('#input').val('');
              $('#output').val('');

            });
            //라디오버튼 선택 바꿀 시 환율 입력 및 결과 창 비우기
            $("input:radio[name='converter_type']").click(function(){
                  $('#input').val('');
                  $('#output').val('');
            });
            
            //값이 입력될 때마다 (변경될 때마다)
            $('#input').on('propertychange change keyup paste input', function(e) {
                e.preventDefault();                
            
                var input =$(this).val();
              

                //환율 계산기 : 라디오버튼 선택값(매매기준율, 송금보낼때/받을때)에 따라 달라지는 계산 기준
              
                var converterType= $("input:radio[name='converter_type']:checked").val();
                
                var rate;
                switch(converterType){
                  case 'trading_rate':
                   rate = ${exInfo.objtoday.trading_rate};
                    if(rate == null){
                      rate = ${exInfo.objdaysago.trading_rate};
                    }
                    break;
                  case 'send_rate':
                    rate = ${exInfo.objtoday.send_rate};
                    if(rate == null){
                      rate = ${exInfo.objdaysago.send_rate};
                    }                    
                    break;
                  case 'receive_rate':
                    rate = ${exInfo.objtoday.receive_rate};
                    if(rate == null){
                      rate = ${exInfo.objdaysago.receive_rate};      
                    }
                    break;                           
                }
               
                if(rate == null || rate == undefined){
                  rate = 0;
                }else{
                  result = Number(input * rate);
                }
                
             
                
             $.ajax({
                    url: "/exchange/toKRW",
                    dataType: "json",
                    type: "POST",
                    data: {data : result},
                    success: function(result) {
                        if(result){
                            $('#output').val(result.result);

                        }
                    }
                
                });

            
          
              
            });


            //매매기준율 원화->타 통화
            $('#output').click(function(){
              $('#output').val('');
              $('#input').val('');
            });
            //라디오버튼 선택 바꿀 시 환율 입력 및 결과 창 비우기
            $("input:radio[name='converter_type']").click(function(){
                  $('#input').val('');
                  $('#output').val('');
            });
            //값이 입력될 때마다 (변경될 때마다)
            $('#output').on('propertychange change keyup paste input', function(e) {
                e.preventDefault();
                
            
                //사용자 입력값 
                var input = $(this).val();
          
                

                //환율 계산기 : 라디오버튼 선택값(매매기준율, 송금보낼때/받을때)에 따라 달라지는 계산 기준
                var converterType= $("input:radio[name='converter_type']:checked").val();
                var rate;
                switch(converterType){
                  case 'trading_rate':
                    rate = ${exInfo.objtoday.trading_rate};
                    if(rate == null){
                      rate = ${exInfo.objdaysago.trading_rate};
                    }
                    break;
                  case 'send_rate':
                    rate = ${exInfo.objtoday.send_rate};
                    if(rate == null){
                      rate = ${exInfo.objdaysago.send_rate};
                    }                    
                    break;
                  case 'receive_rate':
                    rate = ${exInfo.objtoday.receive_rate};
                    if(rate == null){
                      rate = ${exInfo.objdaysago.receive_rate};
                    }
                    break;                                  

                }

                

                
                if(input == 0 || rate == null || rate == undefined){
                    result = 0;
                }else{
                    result = parseFloat(input / rate);
                }
                
             $.ajax({
                    url: "/exchange/fromKRW",
                    dataType: "json",
                    type: "POST",
                    data: {data : result},
                    success: function(result) {
                        if(result){
                         $('#input').val(result.result);
                        }
                    }
                
                });
              
            });


            

        });    

        
      
      

        
      
       
      
     

        </script>

        

    </body>
    </html>
      `;
}







//API Json 파싱 함수
exports.getApiInfo = (url, countryNo, date, searchDate) => {


  //검색 타입 (AP01:환율)
  const data = 'AP01';
  url += `&searchdate=${searchDate}&data=${data}`
  return new Promise(resolve => {
    request(url, function (err, res, body) {


      if (!err && res.statusCode == 200) {
        let obj = JSON.parse(body);
        let eachobj = obj[countryNo];

        let curName;
        let curCode;

        //국가 코드에 따라 검색 데이터 달라짐.
        switch (countryNo) {
          case '22':
            curName = '미국 (달러)';
            curCode = 'USD';
            break;
          case '9':
            curName = '영국 (파운드)';
            curCode = 'GBP';
            break;
          case '6':
            curName = '중국 (위안화)';
            curCode = 'CNH';
            break;
          case '4':
            curName = '캐나다 (달러)';
            curCode = 'CAD';
            break;
          case '1':
            curName = '호주 (달러)';
            curCode = 'AUD';
            break;
          default:
            curName = '환율';
            curCode = '';
        }



        if (eachobj == undefined) {
          //데이터 없을 시

          let result = `${date} 날짜 - 결과없음`;
          resolve({ key: countryNo, txtDate: date, resultDate: searchDate, currency: curName, cur_code: curCode, send_rate: null, receive_rate: null, trading_rate: null });


        }
        else {
          //데이터가 존재할 때 객체 형태로 환율 정보 리턴

          let result = `key: ${countryNo}, ${date} 날짜 : ${searchDate}, 국가 및 통화 : ${eachobj.cur_nm}, 송금보낼 때 환율 : ${eachobj.tts} \n`;

          resolve({ key: countryNo, txtDate: date, resultDate: searchDate, currency: curName, cur_code: curCode, send_rate: eachobj.ttb.replace(',', ''), receive_rate: eachobj.tts.replace(',', ''), trading_rate: eachobj.deal_bas_r.replace(',', '') });




        }


      }
      else { //통신 에러
        console.log('error');

        if (res != null) {
          res.statusCode(res.statusCode).end();
          console.log('error = ' + res.statusCode);
        }

        reject(new Error("Request is failed"));
      }



    });
  });

}
