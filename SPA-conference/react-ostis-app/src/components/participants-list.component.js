import React, { Component } from "react";
import ParticipantDataService from "../services/participant.service";
import { Link } from "react-router-dom";
import {CopyToClipboard} from 'react-copy-to-clipboard';

export default class ParticipantsList extends Component {
  constructor(props) {
    super(props);
    this.onChangeSearchFIO = this.onChangeSearchFIO.bind(this);
    this.retrieveParticipants = this.retrieveParticipants.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.setActiveParticipant = this.setActiveParticipant.bind(this);
    this.removeAllParticipants = this.removeAllParticipants.bind(this);
    this.searchFIO = this.searchFIO.bind(this);

    this.state = {
      participants: [],
      currentParticipant: null,
      currentIndex: -1,
      searchFIO: "",
      value: '',
      copied: false
    };
  }

  componentDidMount() {
    this.retrieveParticipants();
  }

  onChangeSearchFIO(e) {
    const searchFIO = e.target.value;

    this.setState({
      searchFIO: searchFIO
    });
  }

  retrieveParticipants() {
    ParticipantDataService.getAll()
      .then(response => {
        this.setState({
          participants: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  refreshList() {
    this.retrieveParticipants();
    this.setState({
      currentParticipant: null,
      currentIndex: -1
    });
  }

  setActiveParticipant(participant, index) {
    this.setState({
      currentParticipant: participant,
      currentIndex: index
    });
  }

  removeAllParticipants() {
    ParticipantDataService.deleteAll()
      .then(response => {
        console.log(response.data);
        this.refreshList();
      })
      .catch(e => {
        console.log(e);
      });
  }

  searchFIO() {
    ParticipantDataService.findByFIO(this.state.searchFIO)
      .then(response => {
        this.setState({
          participants: response.data
        });
        //console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    const { searchFIO, currentParticipant, currentIndex } = this.state;
    const participants = this.state.participants.sort((a, b) => a.fio > b.fio ? 1 : -1);
    const email = [];
    participants.filter((value) => {
      if (value.email !== null) {
        email.push(value.email)
      }
    });
    this.state.value = email.join(' ');
    return (
      <div className="list row">
        <div className="col-md-8">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by FIO"
              value={searchFIO}
              onChange={this.onChangeSearchFIO}
            />
            <div className="input-group-append">
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={this.searchFIO}
              >
                Search
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <h4>Participant</h4>

          <ul className="list-group">
            {participants &&
            participants.map((participant, index) => (
              <li
                className={
                  "list-group-item " +
                  (index === currentIndex ? "active" : "")
                }
                onClick={() => this.setActiveParticipant(participant, index)}
                key={index}
              >
                {participant.fio}
              </li>
            ))}
          </ul>

          <CopyToClipboard text={this.state.value}
                           onCopy={() => this.setState({copied: true})}>
            <button
              className="m-3 btn btn-sm btn-success">
              Copy All E-mails
            </button>
          </CopyToClipboard>
          {this.state.value === '' && this.state.copied ? <span style={{color: 'red'}}>Not copied.</span> : null}
          {this.state.value !== '' && this.state.copied ? <span style={{color: 'green'}}>Copied.</span> : null}


        </div>
        <div className="col-md-6">
          {currentParticipant ? (
            <div>
              <h4>Info</h4>
              <div>
                <label>
                  <strong>FIO:</strong>
                </label>{" "}
                {currentParticipant.fio}
              </div>
              <div>
                <label>
                  <strong>Rank:</strong>
                </label>{" "}
                {currentParticipant.rank}
              </div>
              <div>
                <label>
                  <strong>Email:</strong>
                </label>{" "}
                {currentParticipant.email}
              </div>
              <div>
                <label>
                  <strong>Phone:</strong>
                </label>{" "}
                {currentParticipant.phone}
              </div>
              <div>
                <label>
                  <strong>Country:</strong>
                </label>{" "}
                {currentParticipant.country}
              </div>
              <div>
                <label>
                  <strong>City:</strong>
                </label>{" "}
                {currentParticipant.city}
              </div>
              <div>
                <label>
                  <strong>Conference participant:</strong>
                </label>{" "}
                {currentParticipant.participation ? "Yes" : "No"}
              </div>

              <Link
                to={"/participants/" + currentParticipant.id}
                className="badge badge-warning"
              >
                Edit
              </Link>
            </div>
          ) : (
            <div>
              <br />
              <p>Please click on a Participant...</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}