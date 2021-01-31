import { useState } from 'react';
import Chat from '../chat/Chat';
import { useInterval } from '../hooks';
import './Hero.css';

const messages = ["Build Web Applications.", "bring designs to life.", "love javascript."];

function Hero() {
  const [typedMessage, setTypedMessage] = useState('');
  const [typeState, setTypeState] = useState({
      msgNum: 0,
      state: 'type',
      charNum: 0
  });
  const [isPaused, setIsPaused] = useState(false);

  // message number, state = type|untype, char
  const typeHelper = () => {
      let state = typeState.state;
      let newMsg;
    if(state === 'type') {
        let msgNum = typeState.msgNum;
        let message = messages[msgNum];
        let charNum = typeState.charNum;
        let char = message[charNum];
        newMsg = `${typedMessage}${char}`;
        charNum = charNum + 1;
        // nextMsg
        if(charNum === message.length) {
            charNum = 0;
            msgNum = (msgNum + 1) < messages.length ? (msgNum + 1) : 0;
            state = 'untype';
            setIsPaused(true);
            setTimeout(() => {
                setIsPaused(false);
            }, 2000);
        }
        // nextState
        setTypeState({
            msgNum,
            state,
            charNum
        });
    } else {
        newMsg = typedMessage.substr(0, typedMessage.length - 1);
        // setTypedMessage(newMsg);
        let state = 'untype';
        if(newMsg.length === 0) {
            state = 'type';
        }
        setTypeState(typeState => ({
            ...typeState, state
        }));
    }
    setTypedMessage(newMsg);
  }

useInterval(typeHelper, isPaused ? null : 75);

  return (
    <div className="section-hero-content">
          <h1>
              <p>Hey there !</p>
              <p>I'm <span>Jeevadeepan Amuthurajan</span></p>
              <p>Front end Developer</p>
          </h1>
          <div className="block">
            <h4 className="sec-font">I <span>{typedMessage}</span>
                <span className="typed-cursor">|</span>
            </h4>
          </div>
          <Chat></Chat>
    </div>
  );
}

export default Hero;