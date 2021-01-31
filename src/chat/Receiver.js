import { useState, useRef, useEffect } from 'react';
import './Chat.css';

const socket = new WebSocket('wss://signal.jeeva.dev');
const configuration = {'iceServers': [{'urls': 'stun:coturn.jeeva.dev:3478', username: 'webapp', credential: 'freepass'}]};
let peerConnection = new RTCPeerConnection(configuration);

// Connection opened
socket.addEventListener('open', function (event) {
  console.log('socket open');
});

function Receiver() {
  const videoRef = useRef();
  const remoteVideoRef = useRef();
  const [videoStream, setVideoStream] = useState(null);
  const [remoteVideoStream, setRemoteVideoStream] = useState(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    if(videoStream) {
      videoRef.current.srcObject = videoStream;
      videoStream.getTracks().forEach(track => peerConnection.addTrack(track, videoStream));
    }
  }, [videoStream] );

  // useEffect(() => {
  //   if(remoteVideoStream) {
  //     remoteVideoRef.current.srcObject = remoteVideoStream;
  //   }
  // }, [remoteVideoStream] );

  useEffect(() => {
    const firebaseConfig = {
      apiKey: "key",
      authDomain: "fleet-radar-299112.firebaseapp.com",
      projectId: "fleet-radar-299112",
      storageBucket: "fleet-radar-299112.appspot.com",
      messagingSenderId: "895377398415",
      appId: "1:895377398415:web:0edb13bc5d138b98b3aefa"
    };
    
    // Initialize Firebase
    window.firebase.initializeApp(firebaseConfig);
    const messaging = window.firebase.messaging();
    messaging.getToken({vapidKey: "BJWAxinpUXb487t6NHrnt2KkGEGY-vXsHxu7s9p8EH3mhhufu2cBc18QQrAQNABZoGt6BwRn4e4SfPkHGC1F9BE"});
    // Get registration token. Initially this makes a network call, once retrieved
    // subsequent calls to getToken will return from cache.
    messaging.getToken({vapidKey: 'BJWAxinpUXb487t6NHrnt2KkGEGY-vXsHxu7s9p8EH3mhhufu2cBc18QQrAQNABZoGt6BwRn4e4SfPkHGC1F9BE'}).then(async (currentToken) => {
      if (currentToken) {
        // sendTokenToServer(currentToken);
        const res = await fetch('https://connect.jeeva.dev/register', {
          headers: {
            'Content-Type': 'application/json'
          },
          method: 'POST',
          mode: 'cors',
          body: JSON.stringify({token: currentToken})
        });
        console.log(res);
      } else {
        console.log('No registration token available. Request permission to generate one.');
      }
    }).catch((err) => {
      console.log('An error occurred while retrieving token. ', err);
    });

    messaging.onMessage((payload) => {
      console.log('Message received. ', payload);
    });

    makeCall();
  }, []);

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({audio: true, video: true});
      console.log('Received local stream');
      setVideoStream(stream);
    } catch (e) {
      alert(`getUserMedia() error: ${e.name}`);
    }
  };

  const makeCall = async function() {
      await startVideo();
      setStatus('connecting');
      socket.addEventListener('message', async ({data}) => {
        const message = JSON.parse(data);
        console.log(message);
        if (message.offer) {
            peerConnection.setRemoteDescription(new RTCSessionDescription(message.offer));
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);
            socket.send(JSON.stringify({'answer': answer}));
        }
        if (message.iceCandidate) {
          try {
              await peerConnection.addIceCandidate(message.iceCandidate);
          } catch (e) {
              console.error('Error adding received ice candidate', e);
          }
        }
      });

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
        if(videoStream) {
            videoStream.getTracks().forEach(track => peerConnection.addTrack(track, videoStream));
        }
      };

      socket.send(JSON.stringify({status: 'online'}));
  };

  const hangUp = () => {
    peerConnection.close();
    peerConnection = new RTCPeerConnection(configuration);
  };

  const srvs = () => {
    if(remoteVideoStream) {
      remoteVideoRef.current.srcObject = remoteVideoStream;
    }
  };

  return (
    <div className="App">
      <h3>Chat with client</h3>
      {/* {status === '' && <button onClick={makeCall}>Call</button>} */}
      <video ref={remoteVideoRef} className={status === 'connected' ? '' : 'hidden'} width={500} height={500} playsInline autoPlay></video>
      <video ref={videoRef} className={(status === 'connecting' || status === 'connected') ? '': 'hidden'} width={200} height={200} playsInline autoPlay muted></video>
      {status !== '' && <p>Status - {status}</p> }
      {status === 'connected' && <button onClick={hangUp}>Hangup</button>}
      <button onClick={srvs()}>Answer</button>
    </div>
  );
}

export default Receiver;