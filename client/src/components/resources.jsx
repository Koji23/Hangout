import React, { Component } from 'react';
import { connect } from 'react-redux';
import io from 'socket.io-client';
import * as rtcActions from '../actions/rtc_actions.js';

// Socket.io Rooms
const CHAT_ROOM = 'CHAT_ROOM';
const SIGNAL_ROOM = "SIGNAL_ROOM"
const mainSocket = io.connect('localhost:3000');
let rtcPeerConn = null;
//
class Resource extends Component {
  constructor(props){
    super(props);
    this.state = {
      cameraOptions: [],
    }
  }
  componentWillMount() {
    this.getCameras();

  }
  componentDidMount() {
    // Socket.io Connection
    mainSocket.on('connect', function() {
      mainSocket.emit('room', {
        chatRoom: CHAT_ROOM,
        signalRoom: SIGNAL_ROOM,
      });
    });

    mainSocket.on('joined', function(data) {
      console.log('joined rooms: ', data);
    });

    const context = this;

    mainSocket.on('signaling_message', function(data) {
       console.log('Incoming signaling message:', data);
       if(!rtcPeerConn) {
        // console.log("!!!", context.startSignaling)
         this.startSignaling();
       }
       if (data.type != 'user_here') {
          let message = JSON.parse(data.message);
          if(message.sdp) {
            rtcPeerConn.setRemoteDescription(
              new RTCSessionDescription(message.sdp), 
              function () {
                // if we received an offer, we need to answer
                if (rtcPeerConn.remoteDescription.type == 'offer') {
                  rtcPeerConn.createAnswer(this.sendLocalDesc, this.logError);
                }
              }.bind(this), this.logError);
          } else {
            rtcPeerConn.addIceCandidate(new RTCIceCandidate(message.candidate));
          }
       }
    }.bind(this));
  }
  getCameras() {
    // note: MediaStreamTrack.getSources is deprecated in favor of mediaDevices.enumerateDevices
    navigator.mediaDevices
    .enumerateDevices()
    .then(mediaDevices => {
      let cameraOptions = mediaDevices.filter(mediaDevice => {
        return mediaDevice.kind === "videoinput";
      });
      this.setState({ cameraOptions: cameraOptions });
      // console.log(this.state);
    });
  }
  sendSignal() {
    console.log('sending signal...');
    // this bogus user_here message may not be needed
    mainSocket.emit('signal', {
      type: 'user_here',
      message: 'Are you ready for a call?',
      room: SIGNAL_ROOM,
    });
  }
  startSignaling() {
    var configuration = {
      iceServers: [{
        url: 'stun:stun.l.google.com:19302'
      }]
    }
    rtcPeerConn = new webkitRTCPeerConnection(configuration);
    // send any ice candidates to the other peer
    rtcPeerConn.onicecandidate = function(evt) {
      if(evt.candidate) {
        mainSocket.emit('signal',{
          "type":"ice candidate", 
          "message": JSON.stringify({ 'candidate': evt.candidate }), // a stringified candidate object IS specified by the webrtc standard
          "room":SIGNAL_ROOM
        });
        console.log("completed that ice candidate...");
      }
    }
    // let the 'negotiationneeded' event trigger offer generation
    rtcPeerConn.onnegotiationneeded = function () {
      console.log("on negotiation called");
      rtcPeerConn.createOffer(this.sendLocalDesc.bind(this), this.logError);
    }.bind(this);
    // once remote stream arrives, show it in the remote video element
    rtcPeerConn.onaddstream = function (evt) {
      console.log("going to add their stream...");
      this.theirVid.src = URL.createObjectURL(evt.stream);
    }.bind(this);
    // get a local stream, show it in our video tag and add it to be sent
    this.startStream();
  }
  // this creates our local session description protocol (SDP) which contains info about browser's video codecs, resolution, etc and sends it to peers
  sendLocalDesc(desc) {
    console.log('inside sendLocalDesc~~~~~', desc, rtcPeerConn);
    rtcPeerConn.setLocalDescription(desc, function () {
      console.log("sending local description");
      mainSocket.emit('signal',{
        "type":"SDP", 
        "message": JSON.stringify({ 'sdp': rtcPeerConn.localDescription }), 
        "room":SIGNAL_ROOM
      });
    }, function(err) {
      console.log('error: ', err);
    });
  }
  logError(error) {
    console.log(error.name + ': ' + error.message);
  }
  startStream() {
    // check if getUserMedia is available first!
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    let videoSource = this.cams.value;
    let constraints = { 
      audio: false, 
      video: {  
        mandatory: {
          minWidth: 240,
          maxWidth: 240,
          maxHeight: 240,
          maxHeight: 240,
        }
      },
      optional: [{
        sourceId: videoSource // this should enable camera change, untested
      }]
    };
    navigator.mediaDevices.getUserMedia(constraints) // shim option for browser compatibility >>> https://github.com/addyosmani/getUserMedia.js/
    .then(stream => {
      console.log('Success we have a stream');
      // this.myVid.srcObject = stream; // this appears to do the same as the line below...which is better???
      this.myVid.src = window.URL.createObjectURL(stream); //https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
      this.myVid.play();
      rtcPeerConn.addStream(stream); // this triggers the event our peer needs to get our stream
      this.theirVid.play();
    })
    .catch((err) => {
      console.log('Found error with getUserMedia', err);
    });
  }
  render() {
    return (
      <div>
        <div>Select Camera</div>
        <select ref={node => { this.cams = node; }}>
          { this.state.cameraOptions.map((camera, index) => {
            return <option key={index} value={camera.deviceId}>{camera.label || `Camera ${index + 1}`}</option>
          })}
        </select>
        <br />
        <button onClick={this.sendSignal}>Start Signaling</button>
        <br />
        <h3>My Video:</h3>
        <video ref={node => { this.myVid = node; }} autoPlay></video>
        <h3>Peer Video:</h3>
        <video ref={node => { this.theirVid = node; }} autoPlay></video>
      </div>

    );
  }
}

function mapStateToProps(state) {
  return { message: state.auth.message };
}

export default connect(mapStateToProps, rtcActions)(Resource);
