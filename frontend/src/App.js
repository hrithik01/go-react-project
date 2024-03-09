import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Switch } from 'react-router-dom/cjs/react-router-dom.min';
import FooterComponent from './components/FooterComponent';
import HeaderComponent from './components/HeaderComponent';
import ListUserComponent from './components/ListUserComponent';

function App() {
  return (
    <div>
      <Router>
        <HeaderComponent />
        <Switch>
          <Route path="" component={ListUserComponent}></Route>
          <Route path="/users" component={ListUserComponent}></Route>
        </Switch>
        <FooterComponent />
      </Router>
    </div>
  )
}

export default App;
