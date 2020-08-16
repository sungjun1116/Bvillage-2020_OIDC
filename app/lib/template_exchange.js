'use strict';
const request = require('request')

exports.HTML = (exInfo) => {
  return `
    
        <section id="main">            
            
            <br> 
            <h3>${exInfo.objtoday.currency}</h3>
            <br>
            <p id="content"></p>
            <br>
            <br>
            <div id="chart"></div>
            <br>
            <br>
            <div id="calculator">
            <h3>환율 계산기</h3>
            <h5>입력 (${exInfo.objtoday.cur_code})</h5>
            <input id ="input" type="text" onKeyup="this.value=this.value.replace(/[^0-9]/g,'');"/> 
            <h2> = </h2>
            <h5>결과 (KRW)</h5>
            <input id="output"type="text"/> 

            </div>

           
            




        </section>
        



        

    
        <script type="text/javascript">
            google.charts.load('visualization', '1.1', {packages: ['line']});
            google.charts.setOnLoadCallback(drawChart);
            function drawChart(){
    
               
               
                var data = new google.visualization.arrayToDataTable([
                    ['날짜', '환율'],
                    ['${exInfo.objyearago.txtDate}  ${exInfo.objyearago.resultDate}', ${exInfo.objyearago.trading_rate}],
                    ['${exInfo.objmthago3.txtDate}  ${exInfo.objmthago3.resultDate}', ${exInfo.objmthago3.trading_rate}],
                    ['${exInfo.objmthago1.txtDate}  ${exInfo.objmthago1.resultDate}', ${exInfo.objmthago1.trading_rate}],
                    ['${exInfo.objweekago.txtDate}  ${exInfo.objweekago.resultDate}', ${exInfo.objweekago.trading_rate}],
                    ['${exInfo.objdaysago.txtDate}  ${exInfo.objdaysago.resultDate}', ${exInfo.objdaysago.trading_rate}],
                    ['${exInfo.objtoday.txtDate}  ${exInfo.objtoday.resultDate}', ${exInfo.objtoday.trading_rate}]
                ]);
                

                
               
            


              
                
                var option = {                    
                    width:800,
                    height:400,
                    colors: ['red']
                    
                };

                var formatter = new google.visualization.NumberFormat({decimalSymbol: '.', pattern:'###,###.##'}); // 소수점변환
                formatter.format(data, 1);



                var chart = new google.charts.Line(document.getElementById('chart'));
                chart.draw(data, option);
            }


            
        var text='${exInfo.objtoday.txtDate} 날짜  ${exInfo.objtoday.resultDate}   매매기준율 : ${String(exInfo.objtoday.trading_rate)}원 /(전신환)송금 보낼 때 : ${String(exInfo.objtoday.send_rate)}원 /(전신환)송금 받을 때 : ${String(exInfo.objtoday.receive_rate)}원<br>${exInfo.objdaysago.txtDate} 날짜  ${exInfo.objdaysago.resultDate}   매매기준율 : ${String(exInfo.objdaysago.trading_rate)}원 /(전신환)송금 보낼 때 : ${String(exInfo.objdaysago.send_rate)}원 /(전신환)송금 받을 때 : ${String(exInfo.objdaysago.receive_rate)}원<br>${exInfo.objweekago.txtDate} 날짜  ${exInfo.objweekago.resultDate}   매매기준율 : ${String(exInfo.objweekago.trading_rate)}원 /(전신환)송금 보낼 때 : ${String(exInfo.objweekago.send_rate)}원 /(전신환)송금 받을 때 : ${String(exInfo.objweekago.receive_rate)}원<br>${exInfo.objmthago1.txtDate} 날짜  ${exInfo.objmthago1.resultDate}   매매기준율 : ${String(exInfo.objmthago1.trading_rate)}원 /(전신환)송금 보낼 때 : ${String(exInfo.objmthago1.send_rate)}원 /(전신환)송금 받을 때 : ${String(exInfo.objmthago1.receive_rate)}원<br>${exInfo.objmthago3.txtDate} 날짜  ${exInfo.objmthago3.resultDate}   매매기준율 : ${String(exInfo.objmthago3.trading_rate)}원 /(전신환)송금 보낼 때 : ${String(exInfo.objmthago3.send_rate)}원 /(전신환)송금 받을 때 : ${String(exInfo.objmthago3.receive_rate)}원<br>${exInfo.objyearago.txtDate} 날짜  ${exInfo.objyearago.resultDate}   매매기준율 : ${String(exInfo.objyearago.trading_rate)}원 /(전신환)송금 보낼 때 : ${String(exInfo.objyearago.send_rate)}원 /(전신환)송금 받을 때 : ${String(exInfo.objyearago.receive_rate)}원<br>';
        
        text = text.replace(/null원/gi, ' 결과 없음 ');
        
        document.getElementById('content').innerHTML= text;


        
        $(document).ready(function() {
            
            var result;
            
            //매매기준율 타 통화->원화
            $('#input').change(function(e) {
                e.preventDefault();
                
            
                var input =$(this).val();
          
                console.log("인풋값 "+input);
               
                var rate = ${exInfo.objtoday.trading_rate};
                if (rate == null){
                    rate = ${exInfo.objyesterday.trading_rate};
                    if(rate == null){
                        rate = ${exInfo.objdaysago.trading_rate};
                        if(rate == null) {
                            rate = ${exInfo.objweekago.trading_rate};
                        }
                    }
                }

                
                result = input * rate;
                result = String(result);
                console.log("계싼 형"+ typeof result);
                console.log("계산 값: " + result);
                
             $.ajax({
                    url: "/exchange/toKRW",
                    dataType: "json",
                    type: "POST",
                    data: {data : result},
                    success: function(result) {
                        if(result){
                            $('#output').val(result.result);
                            $('#post_output').html(result.result);
                        }
                    }
                
                });

            
          
              
            });


            //매매기준율 원화->타 통화
            $('#output').change(function(e) {
                e.preventDefault();
                
            
                var input =$(this).val();
          
                console.log("인풋값 "+input);
               
                var rate = ${exInfo.objtoday.trading_rate};
                if (rate == null){
                    rate = ${exInfo.objyesterday.trading_rate};
                    if(rate == null){
                        rate = ${exInfo.objdaysago.trading_rate};
                        if(rate == null) {
                            rate = ${exInfo.objweekago.trading_rate};
                        }
                    }
                }

                if(input == 0){
                    result = 0;
                }else{
                    result = parseFloat(input / rate);
                    console.log("계싼 형"+ typeof result);
                    console.log("소수계산 값: " + result);
                }

                
                
                console.log("계산 값: " + result);
                
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

  //console.log(api_url);
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

          let result = `${date} 날짜 - 결과없음`;
          console.log(result);
          resolve({ key: countryNo, txtDate: date, resultDate: searchDate, currency: curName, cur_code: curCode, send_rate: null, receive_rate: null, trading_rate: null });

        }
        else {

          let result = `key: ${countryNo}, ${date} 날짜 : ${searchDate}, 국가 및 통화 : ${eachobj.cur_nm}, 송금보낼 때 환율 : ${eachobj.tts} \n`;

          console.log("국가코드 " + countryNo + " 표시내용" + curName + "성공적임" + result);
          resolve({ key: countryNo, txtDate: date, resultDate: searchDate, currency: curName, cur_code: curCode, send_rate: eachobj.ttb.replace(',', ''), receive_rate: eachobj.tts.replace(',', ''), trading_rate: eachobj.deal_bas_r.replace(',', '') });
          //key:json 데이터 키 값, txtDate : 오늘 or ~전 날짜 텍스트 표시  , resultdate : 20201008 날짜표시,
          //currency:통화명, cur_code:통화 코드
          //send_rate:(전신환)송금보낼때, receive_rate:(전신환)송금받을때, trading_rate:매매기준율



        }


      }
      else {
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










