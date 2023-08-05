function loginToArtecoServer() {

  const artecoServerIP = document.getElementById("server_host").value;
  const username = document.getElementById("server_username").value;
  const password = document.getElementById("server_password").value;
  const selectListOfChannels = document.getElementById("server_list_channel");
  const divChannelBlock = document.getElementById("channels_block");


  const url = artecoServerIP + "/api/v2/login"; // connection to the server

  const XHR = new XMLHttpRequest(); // making the request

  // Define what happens on successful data submission
  XHR.addEventListener("load", (event) => {

    console.log("Response from the server obtained")

    let responseJson = JSON.parse(event.target.responseText);
    let loginToken = responseJson.root.access_token; // ok, we got the token !
    let serverMediaSecret = responseJson.root.server.MediaSecret; // ok, we got the token !

    document.getElementById("token_label").innerHTML = loginToken; 
    document.getElementById("mediaSecret_label").innerHTML = serverMediaSecret; 

    // listing the channels

    const listOfChannels = Object.values(responseJson.root.server.channels.channel).map(channel => {
      return {
        name: channel.descr,
        id: channel.id,
      }
    })


    for (var i = 0; i < listOfChannels.length; i++) {
      var opt = listOfChannels[i];
      var el = document.createElement("option");
      el.textContent = opt.name;
      el.value = opt.id;
      selectListOfChannels.appendChild(el);
    }

    divChannelBlock.style.display = "block"; // to show


  });

  // Define what happens in case of error
  XHR.addEventListener("error", (event) => {
    alert('Oops! Something went wrong.');
  });

  // Set up our request
  XHR.open("POST", url);
  //Send the proper header information along with the request
  XHR.setRequestHeader("Content-Type", "application/json");

  const data = {
    "username": username,
    "password": password
  }
  // The data sent is what the user provided in the form
  XHR.send(JSON.stringify(data));
}