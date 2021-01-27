import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Chat from './chat/Chat';
import Receiver from './chat/Receiver';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/chat">
          <Receiver />
        </Route>
        <Route path="/">
          <div className="App">
            <Chat></Chat>
          </div>
        </Route>
      </Switch>
  </Router>
  );
}

export default App;
