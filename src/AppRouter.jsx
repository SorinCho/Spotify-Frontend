import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Header from './components/Header';

export default function AppRouter() {
  const [authenticated, setAuthenticated] = useState(false);
  return (
    <Router>
      <div className="page">
        <Switch>
          <Route path="/home">
            <Home
              handleNotAuthenticated={() => setAuthenticated(false)}
              handleAuthenticated={() => setAuthenticated(true)}
            />
          </Route>
          <Route path="/">
            <Login />
          </Route>
        </Switch>
        <Header
          authenticated={authenticated}
          handleNotAuthenticated={() => setAuthenticated(false)}
        />
      </div>
    </Router>
  );
}
