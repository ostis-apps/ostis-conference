import React, { Component } from "react";
import ParticipantDataService from "../services/participant.service";

export default class AddParticipant extends Component {
  constructor(props) {
    super(props);
    this.onChangeFIO = this.onChangeFIO.bind(this);
    this.onChangeRank = this.onChangeRank.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangeCity = this.onChangeCity.bind(this);
    this.onChangeCountry = this.onChangeCountry.bind(this);
    this.onChangePhone = this.onChangePhone.bind(this);
    this.saveParticipant = this.saveParticipant.bind(this);
    this.newParticipant = this.newParticipant.bind(this);

    this.state = {
      id: null,
      fio: "",
      rank: "",
      email: "",
      city: "",
      country: "",
      phone: "",
      participation: false,

      submitted: false
    };
  }

  onChangeFIO(e) {
    this.setState({
      fio: e.target.value
    });
  }

  onChangeRank(e) {
    this.setState({
      rank: e.target.value
    });
  }

  onChangeEmail(e) {
    this.setState({
      email: e.target.value
    });
  }

  onChangeCity(e) {
    this.setState({
      city: e.target.value
    });
  }

  onChangeCountry(e) {
    this.setState({
      country: e.target.value
    });
  }

  onChangePhone(e) {
    this.setState({
      phone: e.target.value
    });
  }

  saveParticipant() {
    let data = {
      fio: this.state.fio,
      rank: this.state.rank,
      email: this.state.email,
      city: this.state.city,
      country: this.state.country,
      phone: this.state.phone
    };

    ParticipantDataService.create(data)
      .then(response => {
        this.setState({
          id: response.data.id,
          fio: response.data.fio,
          rank: response.data.rank,
          email: response.data.email,
          city: response.data.city,
          country: response.data.country,
          phone: response.data.phone,
          participation: response.data.participation,

          submitted: true
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  newParticipant() {
    this.setState({
      id: null,
      fio: "",
      rank: "",
      email: "",
      city: "",
      country: "",
      phone: "",
      participation: false,

      submitted: false
    });
  }

  render() {
    return (
      <div className="submit-form">
        {this.state.submitted ? (
          <div>
            <h4>You submitted successfully!</h4>
            <button className="btn btn-success" onClick={this.newParticipant}>
              Add
            </button>
          </div>
        ) : (
          <div>
            <h4>Create</h4>
            <div className="form-group">
              <label htmlFor="fio">FIO</label>
              <input
                type="text"
                className="form-control"
                id="fio"
                required
                value={this.state.fio}
                onChange={this.onChangeFIO}
                name="fio"
              />
            </div>

            <div className="form-group">
              <label htmlFor="rank">Rank</label>
              <input
                type="text"
                className="form-control"
                id="rank"
                required
                value={this.state.rank}
                onChange={this.onChangeRank}
                name="rank"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="text"
                className="form-control"
                id="email"
                required
                value={this.state.email}
                onChange={this.onChangeEmail}
                name="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                type="text"
                className="form-control"
                id="phone"
                required
                value={this.state.phone}
                onChange={this.onChangePhone}
                name="phone"
              />
            </div>

            <div className="form-group">
              <label htmlFor="coutnry">Country</label>
              <input
                type="text"
                className="form-control"
                id="country"
                required
                value={this.state.country}
                onChange={this.onChangeCountry}
                name="city"
              />
            </div>

            <div className="form-group">
              <label htmlFor="city">City</label>
              <input
                type="text"
                className="form-control"
                id="city"
                required
                value={this.state.city}
                onChange={this.onChangeCity}
                name="city"
              />
            </div>

            <button onClick={this.saveParticipant} className="btn btn-success">
              Submit
            </button>
          </div>
        )}
      </div>
    );
  }
}