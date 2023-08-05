function playArtecoVideo() {


    const loginToken = document.getElementById("token_label").innerHTML;
    const serverMediaSecret = document.getElementById("mediaSecret_label").innerHTML;
    const artecoServerIP = document.getElementById("server_host").value;
    const channelId = document.getElementById("server_list_channel").value;


    if (channelId == undefined || loginToken == undefined || serverMediaSecret == undefined || artecoServerIP == undefined) {
        console.log("Data validation failed")
        return
    }

    const formattedId =  channelId.padStart(2, '0');

    // Get the video tag
    var video = document.getElementById('arteco-player');

    if (Hls.isSupported()) {
        // check if HLS is supported
        var hls = new Hls({
            debug: true,
            xhrSetup: xhr => {
                xhr.setRequestHeader('Authorization', 'Bearer ' + loginToken)
            }
        });

        hls.loadSource(`${artecoServerIP}/hls/${formattedId}/Live/stream.m3u8?MediaSecret=${serverMediaSecret}`);
        hls.attachMedia(video);
        hls.on(Hls.Events.MEDIA_ATTACHED, function () {
            video.muted = true;
            video.play();
        });
    }
    // hls.js is not supported on platforms that do not have Media Source Extensions (MSE) enabled.
    // When the browser has built-in HLS support (check using `canPlayType`), we can provide an HLS manifest (i.e. .m3u8 URL) directly to the video element through the `src` property.
    // This is using the built-in support of the plain video element, without using hls.js.
    else {
        console.log('HLS not supported')
    }
}
