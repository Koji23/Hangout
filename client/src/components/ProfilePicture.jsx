import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as authActions from '../actions/auth_actions.js';

class ProfilePicture extends Component {
  constructor(props){
    super(props);
    this.state = {
      cameraOptions: [],
      profilePicSrc: null,
      streaming: false, //Used to determine when the video has loaded
      width: 240, //Desired width of the profile picture
      height: 0, //Calculated later (canplay event) based on image ratio
    }
  }
  componentWillMount() {
    // this.props.fetchMessage();
    this.getCameras();
  }
  componentDidMount() {
    this.startStream();
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
      console.log(this.state);
    });
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
      // this.vid.srcObject = stream; // this appears to do the same as the line below...which is better???
      this.vid.src = window.URL.createObjectURL(stream); //https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
      this.vid.play();
    })
    .catch((err) => {
      console.log('Found error with getUserMedia', err);
    });
  }
  takeProfilePic(e) {
    // note: canvas is hidden because it is only used for temporary processing of the image
    let context = this.profilePicCanvas.getContext('2d');
    let width = this.state.width;
    let height = this.state.height;
    if(height && width) {
      context.drawImage(this.vid, 0, 0, width, height);
      this.setState({
        profilePicSrc: this.profilePicCanvas.toDataURL('image/png'),
      });
    }
    e.preventDefault();
  }
  processSizing(e) {
    if(!this.state.streaming) {
      let height = this.vid.videoHeight / (this.vid.videoWidth/this.state.width);
      if (isNaN(height)) {
        height = width / (4/3);
      }
      this.setState({
        height: height,
        streaming: true,
      });
    }
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
        <video ref={node => { this.vid = node; }} 
               onCanPlay={e => { this.processSizing(e); }}
               width={this.state.width}
               height={this.state.height}
               autoPlay></video>
        <br />
        <button id="takePic" onClick={e => { this.takeProfilePic(e); }} autoFocus="true">Take Profile Pic</button>
        <canvas ref={node => { this.profilePicCanvas = node; }} 
                style={{display: 'none'}}
                width={this.state.width}
                height={this.state.height}></canvas>
        <div>
          <img id="profilePicOutput" src={this.state.profilePicSrc}/>
        </div>
      </div>

    );
  }
}

function mapStateToProps(state) {
  return { message: state.auth.message };
}

export default connect(mapStateToProps, authActions)(ProfilePicture);
