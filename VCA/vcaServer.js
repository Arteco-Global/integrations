var http = require('http');
var fs = require('fs');
var multiparty = require('multiparty');
var https = require('https');

const artecoServerAPIurl = 'https://artecoServerIp.lan.omniaweb.cloud:443/api/v2/event';
const serverPort = 5000;
{}
/*
Payload example:
{
  "lane": "manageEvent",
  "data": {
    "ctx": "liveEvent",
    "chId": 4,
    "param": "type: vca; name: {{name}}; classiicatio: {{#Object}}{{#DLClassification}}{{class}}{{/DLClassification}}{{/Object}}",
    "cat": 200
  }
}
*/
// creation of the web server

var server = http.createServer(function (req, res) {

  console.log("Server listening on port " + serverPort);

  if (req.method === "POST") {
    // data must be sent as POST data

    var form = new multiparty.Form();
    form.parse(req, function (err, fields, files) {

      if (fields == undefined) {
        console.log("Invalid fields"); // out of the game
        return;
      }

      if (files == undefined) {
        console.log("Invalid files"); // out of the game
        return;
      }

      if (Array.isArray(fields.vca) && fields.vca.length == 0) {
        console.log("fields.vca is not an array"); // out of the game
        return;
      }

      // obtaining the base64 image
      const imageBased64 = getImageAsbase64(files);
      // Body obtained, adding some image to it
      const vcaBody = fields.vca[0];
      let bodyObject = JSON.parse(vcaBody);

      if (imageBased64 != undefined) {
        bodyObject.data.image = imageBased64;
        console.log("Image provided.");
      }

      sendPayloadToArtecoServer(artecoServerAPIurl, bodyObject)
      console.log("VCA payload sent to server");

    });
  }

}).listen(serverPort);


function getImageAsbase64(files) {

  let base64Image = undefined;
  if (Array.isArray(files.vca) && files.vca.length > 0) {

    files.vca.forEach(element => {

      if (element.originalFilename.includes("current")) {
        if (element != undefined) {
          const tempPath = element.path;
          base64Image = getBase64(tempPath);
        }
      }

    });

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