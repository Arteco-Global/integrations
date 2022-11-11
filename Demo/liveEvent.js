const http = require('http');
const fs = require('fs');
const https = require('https');
const path = require('path');

const artecoServerAPIurl = 'https://mdalprato.lan.omniaweb.cloud:443/api/v2/event';
const image = './steve-jobs-640x320.jpg';
const cameraId = 4;
const eventText = "Arteco event test";

function sendEvent() {

  console.log("Sending event ...");

  // obtaining the base64 image
  const imageBased64 = getImageAsbase64(image);
  // Body obtained, adding some image to it
  let bodyObject = {
    "lane": "manageEvent",
    "data": {
      "ctx": "liveEvent",
      "chId": cameraId,
      "param": eventText,
      "cat": 200
    }
  }

  if (imageBased64 != undefined) {
    bodyObject.data.image = imageBased64;
    console.log("Image provided.");
  }

  sendPayloadToArtecoServer(artecoServerAPIurl, bodyObject)
  console.log("Payload sent to server");

}

function getImageAsbase64(img) {
  let base64Image = undefined;
  if (img != undefined) {
    const logo = path.resolve(__dirname, img);
    base64Image = getBase64(logo);
  }
  return base64Image
}

function getBase64(file) {
  let buff = fs.readFileSync(file);
  let base64data = buff.toString('base64');
  return "data:image/jpeg;base64," + base64data;
}

async function sendPayloadToArtecoServer(url, data) {
  // contact arteco server in order to post the event
  const dataString = JSON.stringify(data);
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': dataString.length,
    },
    timeout: 1000, // in ms
  }

  const req = https.request(url, options, (res) => {
    if (res.statusCode < 200 || res.statusCode > 299) {
      console.log(`HTTP status code ${res.statusCode}`);
    }

    const body = []
    res.on('data', (chunk) => body.push(chunk))
    res.on('end', () => {
      const resString = Buffer.concat(body).toString()
      console.log(resString);
    })
  })

  req.on('error', (err) => {
    console.log(err);
  })

  req.on('timeout', () => {
    req.destroy()
    console.log('Request time out');
  })

  req.write(dataString)
  req.end()

}

sendEvent();