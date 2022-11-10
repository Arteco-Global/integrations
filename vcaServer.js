var http = require('http');
var fs = require('fs');
var multiparty = require('multiparty');
var https = require('https');

var server = http.createServer(function (req, res) {

  console.log("Server starting ..")

  if (req.method === "POST") {
    var form = new multiparty.Form();
    form.parse(req, function (err, fields, files) {
      // fields fields fields
      const vcaBodyData = fields.vca[0];
      const imageBased64 = getImageAsbase64(files);

      if (imageBased64 != undefined) {
        // got the image

        const objToSend = {
          "lane": "manageEvent",
          "data": {
            "ctx": "liveEvent",
            "chId": 4,
            "param": "{{name}} {{type.string}} ",
            "cat": 200,
            "image": imageBased64
          }
        }


        const res = sendToArtecoDearFriend('https://mdalprato.lan.omniaweb.cloud:443/api/v2/event', objToSend)

        console.log("Object sent ... from now on you are fu**** up !")


      } else {
        console.log("No image provided, live event ");
      }

    });
  }

}).listen(5000);

function getImageAsbase64(files) {

  let base64Image = undefined;
  const currentImg = files.vca[1];

  if (currentImg != undefined) {
    const tempPath = currentImg.path;
    base64Image = getBase64(tempPath);
  }

  return base64Image
}

function getBase64(file) {
  let buff = fs.readFileSync(file);
  let base64data = buff.toString('base64');
  return "data:image/jpeg;base64," + base64data;
}




async function sendToArtecoDearFriend(url, data) {
  const dataString = JSON.stringify(data)

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
      //  return reject(new Error(`HTTP status code ${res.statusCode}`))
      }

      const body = []
      res.on('data', (chunk) => body.push(chunk))
      res.on('end', () => {
        const resString = Buffer.concat(body).toString()
        //resolve(resString)
      })
    })

    req.on('error', (err) => {
      //reject(err)
    })

    req.on('timeout', () => {
      req.destroy()
     // reject(new Error('Request time out'))
    })

    req.write(dataString)
    req.end()
  
}