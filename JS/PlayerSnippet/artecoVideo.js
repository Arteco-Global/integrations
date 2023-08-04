
document.addEventListener('DOMContentLoaded', function () {
    const videoUrl = 'https://arteco1020.lan.omniaweb.cloud:496/hls/02/Live/stream.m3u8?MediaSecret=9267679cf30ee2e8d3ec67c95366eac5';
    const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImRhbHBpIiwicGFzc3dvcmQiOiIkYXJnb24yaWQkdj0xOSRtPTQwOTYsdD0zLHA9MSRhT0o4MXRWOTBoeWNmcG5RcXRTR1RBJDRJQUdReHdDVjR3azNScFhXS0lzbFZLVVYrYjhPMU56dWw5bUlxakRzRE0iLCJpYXQiOjE2OTEwNjc1MDIsImV4cCI6MTY5MTA4MTkwMn0.Vsl19ghE2ly3G06HDmj2FwdA-QWsx7a2o9EyrM1KzQc'; 


    const player = videojs('my-video', {
        // Opzioni video.js, se necessario
    });

    fetch(videoUrl, {
        headers: {
            Authorization: `Bearer ${authToken}` // Utilizza l'autenticazione via header
        }
    })
        .then(videoBlob => {
            const videoUrlObject = URL.createObjectURL(videoBlob);
            player.src({ src: videoUrlObject, type: 'application/x-mpegURL' });
        })
        .catch(error => {
            console.error('Errore nel caricamento del video:', error);
        });
});

