import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Receiver from './chat/Receiver';
import Hero from './hero/Hero';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/chat">
          <Receiver />
        </Route>
        <Route path="/">
          <div className="App">
            <Hero />
          </div>
        </Route>
      </Switch>
  </Router>
  );
}

export default App;
