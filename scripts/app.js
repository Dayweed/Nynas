'use strict';

const KEY = '168a02b255e509a1c6a69687febcdc44';
const API_URL = 'https://api.openweathermap.org/data/2.5/forecast?q=nynashamn&APPID=' + KEY;
var tågtabell = [
    {
        Nummer: '101',
        Avgår: '14:12',
        Ankommer: '23:56'
    },
    {
        Nummer: '102',
        Avgår: '02:03',
        Ankommer: '19:01'
    },
    {
        Nummer: '101',
        Avgår: '08:40',
        Ankommer: '08:41'
    },
    {
        Nummer: '3',
        Avgår: '04:13',
        Ankommer: '23:01'
    },
    {
        Nummer: '102',
        Avgår: '12:34',
        Ankommer: '19:56'
    }
];

/**************************************KLASS HttpGet*******************************************/
//Klass för HttpGet-objekt.
function HttpGet(url){
    this.url = url;
    this.updater = new XMLHttpRequest();
}
//Det som gör att jag har svårt med js är att metoder kan sättas in i en klass utanför klassen(förlåt, funktionen...(?)).
//Metod som sätts in i våran HttpGet-klass.
HttpGet.prototype.proceed = function(callback){
    this.updater.onreadystatechange = function(){
        //När readyState är 4 och status är 200 är allt okey. Inga fel har då påträffats.
        if(this.readyState === XMLHttpRequest.DONE && this.status === 200){
            callback(this.response);
        }
    }
    this.updater.open('GET', this.url, true);
    this.updater.send();
}
/**********************************************************************************************/
/**************************************Skapande av HttpGet-objektet(ajax)**********************/
//Skapar nytt HttpGet-objekt 
function create(url){
    return new HttpGet(url);
}
//Här skapar vi nytt HttpGet-objekt med url medskickat.
create(API_URL).proceed(response =>{
    //Hämtar och parsar en json-lista.
    var weatherList = JSON.parse(response).list; 

    //nu tar vi bara 5 element eftersom de ska vara så i nynäs. Vi vill här få alla tr. 
    var tbody = document.getElementById('weather-data');
    for(let i = 0; i < 5; i++) {
        var time = weatherList[i].dt_txt;
        var date = new Date(time);
        var hour = date.getHours() + ":00";
        var weatherType = (weatherList[i].weather[0].description).charAt(0).toUpperCase() + (weatherList[i].weather[0].description).substring(1);
        var temperature =  ((weatherList[i].main.temp) - 273.15).toFixed(1) +  "°C";
        var windSpeed = weatherList[i].wind.speed.toFixed(1) + " m/s"; 
        var timestamp = `
            <tr>
                <td>${hour}</td>
                <td>${weatherType}</td>
                <td>${temperature}</td>
                <td>${windSpeed}</td>
            </tr>
        `;
        tbody.innerHTML += timestamp; // += är för att vi vill plusa på den föregående strängen
    }
});
/**********************************************************************************************/
/**************************************Skapande av HttpGet-objektet(ajax)**********************/

document.getElementById('button').addEventListener('click', (event) => { 
    event.preventDefault();
    var table = document.getElementById('infoTable');
    var input = document.getElementById('input').value;
    var trafikInfo = `<p>Inga förseningar eller problem i trafiken.<br>
        Åker ifrån: ${input}</p>`;
    table.innerHTML = trafikInfo;

    while(document.getElementById("infoRow").firstChild){
        document.getElementById("infoRow").removeChild(document.getElementById("infoRow").firstChild);
    }

    for(var i = 0; i<tågtabell.length; i++){
        var tbody = document.getElementById('infoRow');
        var number = tågtabell[i].Nummer;
        var departure = tågtabell[i].Avgår;
        var arrival = tågtabell[i].Ankommer;

        var infoTableRow = `
            <tr>
                <td>${number}</td>
                <td>${departure}</td>
                <td>${arrival}</td>
            </tr>
            `;

        tbody.innerHTML += infoTableRow;
    
    }
});
