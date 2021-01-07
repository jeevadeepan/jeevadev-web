import { useState, useRef, useEffect } from 'react';
import './Chat.css';

const socket = new WebSocket('wss://signal.jeeva.dev');
const configuration = {'iceServers': [{'urls': 'stun:coturn.jeeva.dev:3478', username: 'webapp', credential: 'freepass'}]};
let peerConnection = new RTCPeerConnection(configuration);

function Chat() {
  const videoRef = useRef();
  const remoteVideoRef = useRef();
  const [videoStream, setVideoStream] = useState(null);
  const [remoteVideoStream, setRemoteVideoStream] = useState(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    if(videoStream) {
      videoRef.current.srcObject = videoStream;
      videoStream.getTracks().forEach(track => peerConnection.addTrack(track, videoStream));
      console.log('Added video stream to peer connection');
    }
  }, [videoStream] );

  useEffect(() => {
    if(remoteVideoStream) {
      remoteVideoRef.current.srcObject = remoteVideoStream;
    }
  }, [remoteVideoStream] );

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({audio: true, video: true});
      console.log('Received local stream');
      setVideoStream(stream);
    } catch (e) {
      alert(`getUserMedia() error: ${e.name}`);
    }
  };

  socket.addEventListener('message', async ({data}) => {
    const message = JSON.parse(data);
    console.log(message);
    if (message.answer) {
          const remoteDesc = new RTCSessionDescription(message.answer);
          await peerConnection.setRemoteDescription(remoteDesc);
          console.log('Jeeva is online');
      }

    if (message.iceCandidate) {
      try {
          await peerConnection.addIceCandidate(message.iceCandidate);
      } catch (e) {
          console.error('Error adding received ice candidate', e);
      }
    }

    if(message.status === 'online') {
      setStatus('Jeeva is online');
    }
  });

  const makeCall = async function() {
      await startVideo();
      setStatus('connecting');
      peerConnection.addEventListener('icecandidate', async (event) => {
        console.log(event);
        if (event.candidate) {
            socket.send(JSON.stringify({iceCandidate: event.candidate}));
        }
      });

      peerConnection.addEventListener('connectionstatechange', event => {
        if (peerConnection.connectionState === 'connected') {
            // Peers connected!
            console.log('Peers connected');
            setStatus('connected');
        }
      });

      peerConnection.ontrack = (event) => {
        setRemoteVideoStream(event.streams[0]);
      };

      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      socket.send(JSON.stringify({'offer': offer}));
  };

  const hangUp = () => {
    peerConnection.close();
    peerConnection = new RTCPeerConnection(configuration);
  };

  const pingJeeva = () => {
    fetch('https://connect.jeeva.dev/connect');
  };

  return (
    <div className="App">
      <h3>Connect with me</h3>
      {status === 'Jeeva is online' && <button onClick={makeCall}>Call</button>}
      {status === '' && <button onClick={pingJeeva}>Connect</button>}
      <video ref={remoteVideoRef} className={status === 'connected' ? '' : 'hidden'} width={500} height={500} playsInline autoPlay></video>
      <video ref={videoRef} className={(status === 'connecting' || status === 'connected') ? '': 'hidden'} width={200} height={200} playsInline autoPlay muted></video>
      {status !== '' && <p>Status - {status}</p> }
      {status === 'connected' && <button onClick={hangUp}>Hangup</button>}
    </div>
  );
}

export default Chat;