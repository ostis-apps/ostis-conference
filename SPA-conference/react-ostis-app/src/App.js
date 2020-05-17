import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AddParticipant from "./components/add-participant.component";
import Participant from "./components/participant.component";
import ParticipantsList from "./components/participants-list.component";

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <nav className="navbar navbar-expand navbar-dark bg-dark">
            <a href="/participants" className="navbar-brand">
              OSTIS
            </a>
            <div className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link to={"/participants"} className="nav-link">
                  Participant
                </Link>
              </li>
              <li className="nav-item">
                <Link to={"/add"} className="nav-link">
                  Add participant
                </Link>
              </li>
            </div>
          </nav>

          <div className="container mt-3">
            <Switch>
              <Route exact path={["/", "/participants"]} component={ParticipantsList} />
              <Route exact path="/add" component={AddParticipant} />
              <Route path="/participants/:id" component={Participant} />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;