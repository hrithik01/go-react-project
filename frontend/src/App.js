import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Switch } from 'react-router-dom/cjs/react-router-dom.min';
import FooterComponent from './components/FooterComponent';
import HeaderComponent from './components/HeaderComponent';
import ListUserComponent from './components/ListUserComponent';
import ViewUserComponent from './components/ViewUserComponent';
import CreateUserComponent from './components/CreateUserComponent';

function App() {
  return (
    <div>
      <Router>
        <HeaderComponent />
        <Switch>
          <Route path="/view-user/:id" component={ViewUserComponent}></Route>
          <Route path="/add-user/:id" component={CreateUserComponent}></Route>
          <Route path="" component={ListUserComponent}></Route>
          <Route path="/users" exact component={ListUserComponent}></Route>
        </Switch>
        <FooterComponent />
      </Router>
    </div>
  )
}

export default App;
