


const issURL = "https://api.wheretheiss.at/v1/satellites/25544";
function preload () {

    soundFormats('mp3');
    mySound = loadSound("sub.mp3");
}

// test for Heroku
function setup() {
    noCanvas();

//   const  p1 = createElement('p',"Test header");
//   p1.html(lat);
//   p1.parent(Title);
}
let mymap;
let marker;
let audioB;
let d ;
let t;
let closeVel;
let deltaDiff;

let myLatitude;
let myLongitude;
let firstSound = true;
let ISSviz = 750;
let updateInterval = 5000;    // in miliseconds

getCurrentLocation();
getISS();

setInterval(getISS,updateInterval);



async function getISS() {
const response = await fetch(issURL);
const data = await response.json();

const lat = data.latitude;
const lng = data.longitude;
let vel = data.velocity;


const latP = document.getElementById("pLat");
latP.innerText = "Latitude = " + lat;
const lngP = document.getElementById("pLong");
lngP.innerText = "Longitude = " + lng;
const velP = document.getElementById("pVelocity");
let velS = addCommas(round(vel));
velP.innerText = "Velocity " + velS + " km/h";
const closeVelP = document.getElementById("pCloseVel");
let closeVelS = addCommas(closeVel);
closeVelP.innerText = "Closing Velocity " + closeVelS + " km/h";
const maplock = document.getElementById('maplock');



if (!mymap) {    //  only if we haven't already initialised the map
mymap = L.map('mapISS').setView([lat, lng], 4);
marker = L.marker([0,0]).addTo(mymap);
}
if (maplock.checked) {
mymap.setView([lat, lng]);
}
const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
const tileURL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tiles = L.tileLayer(tileURL, {attribution});
tiles.addTo(mymap);

marker.setLatLng([lat,lng]);
// calculate distance from current location to the ISS

let prevT =t;
let prevD = d;   // what was the last distance to us. in km
var R = 6371e3; // metres
var lat1 = radians(lat);
var lat2 = radians(myLatitude);
var deltaLat = radians(myLatitude-lat);
var deltaLong = radians(myLongitude-lng);

var a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
        Math.cos(lat1) * Math.cos(lat2) *
        Math.sin(deltaLong/2) * Math.sin(deltaLong/2);
        
var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    
t = Date.now();

d = floor((R * c) /1000);  // convert from m to km and floor it
const distanceP = document.getElementById("pDistance");
pDistance.innerText = "Distance from current location =  " + d + " KM ";

deltaDiff = prevD- d;
let deltaTime = t - prevT;
const timeSec = deltaTime/1000;
closeVel = round(deltaDiff * (60/timeSec) *60);


let audioB  = document.getElementById("audioButton");


if (getAudioContext().state == 'running') {
    audioB.textContent = "Proximity alert on, press to disable";
  } else {
    audioB.textContent = "Proximity alert off. press to enable";
  }

if (d<ISSviz & firstSound) {
    console.log(" Play sound");
    mySound.play();
    firstSound = false;
}
if (d>ISSviz+100 & !firstSound) {
    console.log("Turn sound off");
    firstSound = true;
    
    firstSound = false;
}

}

async function getCurrentLocation () {

    if ('geolocation' in navigator) {
        console.log("we can find you");
    

    navigator.geolocation.getCurrentPosition(async position =>{
      
        myLatitude = position.coords.latitude;
        myLongitude = position.coords.longitude;
       
    });
}
}
function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }
  
  function toggleAudio(id) {
    if (getAudioContext().state == 'running') {
        getAudioContext().suspend();
    } else {
        getAudioContext().resume();

    }
  }

function addCommas(nStr) {
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}