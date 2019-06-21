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
 * Text content and parametters.
 * @type {Object}
 */
var msg;
/**
 * Synthetis voice API.
 * @type {string}
 */
var synth;
/**
 * Voice parametters.
 * @type {array}
 */
var voices;
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
  * Connects the user html page to the server,
  * connects the client to WebSocket and
  * subscribes client to notifications
  * @constructor
  */
function connect() {
  socket = new SockJS('http://mgladki.cern.ch:8080/fake-notifications');
  stompClient = Stomp.over(socket);
  stompClient.connect({}, function (frame) {
    stompClient.subscribe('/topic/notification', function (content) {
      var body = JSON.parse(content.body);
      playOrDelay(body.filename, body.text);
    });
  });
}

/**
 * Plays or not a notification if there
 * is already a notification playing
 * @param {string} filename The sound to play
 * @param {string} text The text to pronnounce
 */
function playOrDelay(filename, text){
  if(playing == false && speaking == false){
    playSoundAndSpeak(filename, text);
  }
  else{
    var wait;
    wait = setTimeout(function() {playOrDelay(filename, text);}, 3000);
  }
}

/**
 * Plays at first the sound (with Playsound function)
 * and then pronnounces the text (with textToSpeech function)
 * @param {string} filename The sound to play
 * @param {string} text The text to pronnounce
 */
function playSoundAndSpeak(filename, text){
  if(filename === undefined){
    textToSpeech(text);
  }
  else if (text === undefined){
    playSound(filename);
  }
  else{
    playSound(filename);
    audio.onended = function(){
      textToSpeech(text);
    }
  }
}

/**
 * Play a sound
 * @param {string} filename The sound to play
 * @constructor
 */
function playSound(filename){
  audio.src = ('sounds/' + filename);
  audio.volume = 0.5;

  var playPromise = audio.play();

  if (playPromise !== undefined) {
    playPromise.then(function() {
      playing = true;
      audio.addEventListener('ended', function() {
        playing = false;
      });
    }).catch(function(error) {
    });
  }
}

/**
 * Pronnounce a text via a synthesis voice
 * @param {string} text The text to pronnounce
 * @constructor
 */
function textToSpeech(text){
  if (text.length > textToSpeechLimit){
    text = text.substring(0, textToSpeechLimit);
  }
    msg = new SpeechSynthesisUtterance(text);
    synth = window.speechSynthesis;
    voices = synth.getVoices();
    msg.voices = voices[0];
    msg.lang = 'en-EN';
    msg.volume = 0.9;
    synth.speak(msg);
    speaking = true;
    msg.onend = function(event){
      speaking = false;
    }
  }
}

(function() {
  //connect();
  //playSoundAndSpeak(undefined, 'exemple')
  //playSoundAndSpeak('u2bell.wav', undefined)
  //textToSpeech('11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111112222222222');
  //playOrDelay('slowdownmybeatingheart.wav', 'thats a test');
  //playOrDelay('test.mp3', 'try');
  //playSoundAndSpeak('zefoihoi','');
})();
