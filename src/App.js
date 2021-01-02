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
            <header className="App-header">
              Hi! This is Jeevadeepan Amuthurajan!
              <Chat></Chat>
            </header>
          </div>
        </Route>
      </Switch>
  </Router>
  );
}

export default App;
