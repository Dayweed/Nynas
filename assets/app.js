'use strict';

const KEY = '168a02b255e509a1c6a69687febcdc44';
const API_URL = 'http://api.openweathermap.org/data/2.5/forecast?q=nynashamn&APPID=' + KEY;

function HttpGet(url) {
    this.url = url;
    this.ajax = new XMLHttpRequest();
}

HttpGet.prototype.proceed = function(callback) {
    this.ajax.onreadystatechange = function() {
        if(this.readyState === 4 && this.status === 200) {
            callback(this.response);
        }
    }
    this.ajax.open('GET', this.url, true);
    this.ajax.send();
}

function fetch(url) {
    return new HttpGet(url);
}

function $(selector) {
    return document.querySelector(selector);
}

function DOMElement(selector) {
    this.element = $(selector)
}

DOMElement.prototype.select = function(target) {
    this.selected = $(target);
    return this;
}

DOMElement.prototype.click = function(callback) {
    this.element.addEventListener('click', event => {
        event.selected = this.selected;
        callback(event);
    });
}

function find(selector) {
    return new DOMElement(selector);
}

find('.fetch-data').select('.weather-data').click(event => {
    fetch(API_URL).proceed(response => {
        //event.selected.innerHTML = response;
        //Om knapen är en fomrulär knapp bör du anropa preventDefault för att undvika att sidan ladas om.
        // event.preventDefault();

        //Baklänges blir JSON-stringify(weatherData)
        var weatherData = JSON.parse(response);
        var weatherList = weatherData.list;

        //Denna skriver ut alla element. Vi vill bara skriva ut 5 element i Nynas projektet.
        // weatherList.forEach(data => {
        //   console.log(data);
        //});
        var tbody = event.selected
        for(let index = 0; index < 5; index++) {
            var time = weatherList[index].dt_txt;
            var date = new Date(time);
            var hour = date.getHours() + ":00";
            var speed = weatherList[index].wind.speed;
            var timestamp = `
                <tr>
                    <td>${hour}</td>
                    <td>${speed}</td>
                </tr>
            `;
            tbody.innerHTML += timestamp;
        }
    });
});