/**
 * Created by mgl on 03.06.19.
 */
const textToSpeechLimit = 30;
var socket;

/**
 *@function connect Connects the user html page to the server, connects the client to WebSocket, subscribes client to notifications
 */
function connect() {
  socket = new SockJS('http://mgladki.cern.ch:8080/fake-notifications');
  stompClient = Stomp.over(socket);
  stompClient.connect({}, function (frame) {
    console.log(typeof(frame));
    console.log('Connected: ' + frame);
    stompClient.subscribe('/topic/notification', function (content) {
      console.log(content.body);
      var body = JSON.parse(content.body);
      playOrDelay(body.filename, body.text);
      console.log(body.filename);
      console.log(body.text);
    });
  });
}

/**
 *@function playOrDelay plays or not a notification if there is already a notification playing
 *@param {string} filename The sound to play
 *@param {string} text The text to pronnounce
 *
 *@function annonymous Calls the playOrDelay function after a delay of 3 seconds
 */
function playOrDelay(filename, text){
  if(playing == false && speaking == false){
    playSoundAndSpeak(filename, text);
  }
  else{
    var wait;
    console.log('Ignoring');
    wait = setTimeout(function() {playOrDelay(filename, text);}, 3000);
  }
}

/**
 *@function playSoundAndSpeak Plays at first the sound (with Playsound function) and then pronnounces the text (with textToSpeech function)
 *@param {string} filename The sound to play
 *@param {string} text The text to pronnounce
 *
 *@function annonymous Pronnounces the text when the audio is finish thanks to .onended
 */
function playSoundAndSpeak(filename, text){
  if(filename === undefined || filename == null || filename == ''){
    console.log('No sound - only text');
    textToSpeech(text);
  }
  else if (text === undefined || text == null || text == ''){
    console.log('Message empty - only sound');
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
 *@function annonymous Assigns by default the U2Bell.wav sound if filename is wrong or null
 */
var speaking = false;
var playing = false;
var audio = new Audio();
audio.onerror = function(){
  playSound('u2bell.wav');
}

/**
 *@function playSound Play a sound
 *@param {string} filename The sound to play
 *
 *@function annonymous Create an event called 'ended' on the audio in purpose to assign back to speaking the value : false
 *
 */
function playSound(filename){
    audio.src = ('sounds/' + filename);
    audio.volume = 0.5;
    audio.play();
    playing = true;
    audio.addEventListener('ended', function() {
      playing = false;
    });

}


var msg;
var synth;
var voices;

/**
 *@function textToSpeech Pronnounce a text via a synthesis voice
 *@param {string} text The text to pronnounce
 *
 *@function annonymous function create an event on the end of the text notification in purpose to assign back to speaking the value : false
 *@param {bool} event End event of the text notification
 */
function textToSpeech(text){
  if (text.length > textToSpeechLimit){
    console.log(text)
    text = text.substring(0, textToSpeechLimit);
    console.log(text)
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

  else{
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

/**
*@function annonymous Play functions
*/
(function() {
  //connect();
  //playSoundAndSpeak(undefined, 'exemple')
  //playSoundAndSpeak('u2bell.wav', undefined)
  //textToSpeech('11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111112222222222');
  //playOrDelay('slowdownmybeatingheart.wav', 'thats a test');
  //playOrDelay('test.mp3', 'try');
  //playSoundAndSpeak('zefoihoi','');
})();
