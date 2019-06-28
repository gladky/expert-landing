/**
 * Created by mgl on 03.06.19.
 */

/**
 * Create a limit for the text to pronnounce.
 * @type {number}
 */
const textToSpeechLimit = 30;
/**
 * Link of the end point.
 * @type {Object}
 */
var socket;
/**
 * Text is actually playing or not.
 * @type {bool}
 */
var speaking = false;
/**
 * Sound is actually playing or not.
 * @type {bool}
 */
var playing = false;
/**
 * Sound content and parametters.
 * @type {Object}
 */
var audio = new Audio();
/**
* Dynamic array for playing notifications
* one by one.
* @type {array}
*/
var queue = [];

<<<<<<< HEAD
/**
 * Connects the user html page to the server,
 * connects the client to WebSocket and
 * subscribes client to notifications
 */
=======
 /**
  * Connects the user html page to the server,
  * connects the client to WebSocket and
  * subscribes client to notifications
  */
>>>>>>> banner
function connect() {
  socket = new SockJS('http://mgladki.cern.ch:8080/fake-notifications');
  stompClient = Stomp.over(socket);
  stompClient.connect({}, function (frame) {
    stompClient.subscribe('/topic/notification', function (content) {
      var body = JSON.parse(content.body);
    });
  });
}

<<<<<<< HEAD
canAutoplay.audio().then(({result, error}) => {
  if(result === false) {
    Swal.fire({
      title: 'Autoplay disabled !',
      text: 'Please allow autoplay in browser settings or press "Ok"',
      type: 'warning',
      confirmButtonText: 'Ok'
    })
  }
});

=======
>>>>>>> banner
/**
 * Plays or not a notification if there
 * is already a notification playing
 * @param {string} filename The sound to play
 * @param {string} text The text to pronnounce
 */

function produce(filename, text) {
  var job;
    if(empty === false){
      job = {filename: filename, text : text};
      queue.push(job);
      consume();
    }
}

async function consume() {
  let job = queue.shift();

  if(job !== undefined && speaking === false && playing === false) {
    console.log('test');
    await playSoundAndSpeak(job.filename, job.text);
    console.log(job);
  }
}

/**
 * Plays at first the sound (with Playsound function)
 * and then pronnounces the text (with textToSpeech function)
 * @param {string} filename The sound to play
 * @param {string} text The text to pronnounce
 */
function playSoundAndSpeak(filename, text) {
  if(filename === undefined) {
    textToSpeech(text);
  }
  else if (text === undefined) {
    playSound(filename);
  }
  else if(filename !== undefined && text !== undefined) {
    playSound(filename);
    audio.onended = function() {
      textToSpeech(text);
      audio.onended = undefined;
    }
  }
}

/**
 * Plays a sound
 * @param {string} filename The sound to play
 */
function playSound (filename) {
  audio.src = ('sounds/' + filename);
  audio.volume = 0.5;
  playing = true;
  var playPromise = audio.play();

  if (playPromise !== undefined) {
    playPromise.then(function() {
      audio.addEventListener('ended', function() {
        playing = false;
      });
    }).catch(function(error) {
<<<<<<< HEAD
      var keys = Object.keys(error)
      if(error.code === 9) {
        playSound('u2bell.wav');
      }
=======
      console.log(error);
      //playSound('u2bell.wav');
>>>>>>> banner
    });
  }
}

/**
 * Pronnounces a text via a synthesis voice
 * @param {string} text The text to pronnounce
 */
function textToSpeech(text) {
  var msg;
  var voices;
  var synth;

  if (text.length > textToSpeechLimit) {
    text = text.substring(0, textToSpeechLimit);
  }
  if(text === undefined) {
    text = "empty";
  }

  msg = new SpeechSynthesisUtterance(text);
  synth = window.speechSynthesis;
  voices = synth.getVoices();
  msg.voices = voices[0];

  msg.lang = 'en-EN';
  msg.volume = 0.9;
  synth.speak(msg);
  speaking = true;
  msg.onend = function(event) {
    speaking = false;
  }
}

<<<<<<< HEAD
(function(){
  produce('test1', 'test1')
  produce('test2', 'test2')
  produce('test3', 'test3')
  produce('test4', 'test4')
})
=======
window.onload = function () {

  detectIfAutoplaySettingsEnabled();
  retieveSoundSystemConf()
};



setTimeout(function () {
  disableSoundSystemMessage = false;
}, 1000);

setTimeout(function () {
  disableSoundSystemMessage = true;
}, 20000);

function retieveSoundSystemConf() {
  var browserSoundSystemRequestedFromStorage = localStorage.getItem('dashboardBrowserSoundSystemEnabled');
  if (browserSoundSystemRequestedFromStorage !== null) {
    browserSoundSystemRequested = browserSoundSystemRequestedFromStorage;
  }
}

function storeSoundSystemConf(value) {
  localStorage.setItem('dashboardBrowserSoundSystemEnabled', value);
  browserSoundSystemRequested = value;
  // TODO: enable/disable sound system
}

function detectIfAutoplaySettingsEnabled() {
  canAutoplay.audio().then(({result, error}) => {
    browserSettingsAllowAutoplay = result;
  });
}
>>>>>>> banner
