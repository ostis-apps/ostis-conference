import React, { Component } from "react";
import ParticipantDataService from "../services/participant.service";

export default class Participant extends Component {
  constructor(props) {
    super(props);
    this.onChangeFIO = this.onChangeFIO.bind(this);
    this.onChangeRank = this.onChangeRank.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangeCity = this.onChangeCity.bind(this);
    this.onChangeCountry = this.onChangeCountry.bind(this);
    this.onChangePhone = this.onChangePhone.bind(this);
    this.getParticipant = this.getParticipant.bind(this);
    this.updateParticipation = this.updateParticipation.bind(this);
    this.updateParticipant = this.updateParticipant.bind(this);
    this.deleteParticipant = this.deleteParticipant.bind(this);

    this.state = {
      currentParticipant: {
        id: null,
        fio: "",
        rank: "",
        email: "",
        city: "",
        country: "",
        phone: "",
        participation: false
      },
      message: ""
    };
  }

  componentDidMount() {
    this.getParticipant(this.props.match.params.id);
  }

  onChangeFIO(e) {
    const fio = e.target.value;

    this.setState(function(prevState) {
      return {
        currentParticipant: {
          ...prevState.currentParticipant,
          fio: fio
        }
      };
    });
  }

  onChangeRank(e) {
    const rank = e.target.value;

    this.setState(prevState => ({
      currentParticipant: {
        ...prevState.currentParticipant,
        rank: rank
      }
    }));
  }

  onChangeEmail(e) {
    const email = e.target.value;

    this.setState(prevState => ({
      currentParticipant: {
        ...prevState.currentParticipant,
        email: email
      }
    }));
  }

  onChangeCity(e) {
    const city = e.target.value;

    this.setState(prevState => ({
      currentParticipant: {
        ...prevState.currentParticipant,
        city: city
      }
    }));
  }

  onChangePhone(e) {
    const phone = e.target.value;

    this.setState(prevState => ({
      currentParticipant: {
        ...prevState.currentParticipant,
        phone: phone
      }
    }));
  }

  onChangeCountry(e) {
    const country = e.target.value;

    this.setState(prevState => ({
      currentParticipant: {
        ...prevState.currentParticipant,
        country: country
      }
    }));
  }

  getParticipant(id) {
    ParticipantDataService.get(id)
      .then(response => {
        this.setState({
          currentParticipant: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  updateParticipation(status) {
    let data = {
      id: this.state.currentParticipant.id,
      fio: this.state.currentParticipant.fio,
      rank: this.state.currentParticipant.rank,
      email: this.state.currentParticipant.email,
      city: this.state.currentParticipant.city,
      phone: this.state.currentParticipant.phone,
      country: this.state.currentParticipant.country,
      participation: status
    };

    ParticipantDataService.update(this.state.currentParticipant.id, data)
      .then(response => {
        this.setState(prevState => ({
          currentParticipant: {
            ...prevState.currentParticipant,
            participation: status
          }
        }));
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  updateParticipant() {
    ParticipantDataService.update(
      this.state.currentParticipant.id,
      this.state.currentParticipant
    )
      .then(response => {
        console.log(response.data);
        this.setState({
          message: "The participant was updated successfully!"
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  deleteParticipant() {
    ParticipantDataService.delete(this.state.currentParticipant.id)
      .then(response => {
        console.log(response.data);
        this.props.history.push('/participants')
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    const { currentParticipant } = this.state;

    return (
      <div>
        {currentParticipant ? (
          <div className="edit-form">
            <h4>Data</h4>
            <form>
              <div className="form-group">
                <label htmlFor="fio">FIO</label>
                <input
                  type="text"
                  className="form-control"
                  id="fio"
                  value={currentParticipant.fio}
                  onChange={this.onChangeFIO}
                />
              </div>
              <div className="form-group">
              <label htmlFor="rank">Rank</label>
              <input
                type="text"
                className="form-control"
                id="rank"
                value={currentParticipant.rank}
                onChange={this.onChangeRank}
              />
            </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="text"
                  className="form-control"
                  id="email"
                  value={currentParticipant.email}
                  onChange={this.onChangeEmail}
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                  type="text"
                  className="form-control"
                  id="phone"
                  value={currentParticipant.phone}
                  onChange={this.onChangePhone}
                />
              </div>

              <div className="form-group">
                <label htmlFor="country">Country</label>
                <input
                  type="text"
                  className="form-control"
                  id="country"
                  value={currentParticipant.country}
                  onChange={this.onChangeCountry}
                />
              </div>

              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  className="form-control"
                  id="city"
                  value={currentParticipant.city}
                  onChange={this.onChangeCity}
                />
              </div>

              <div className="form-group">
                <label>
                  <strong>Conference participant:</strong>
                </label>
                {currentParticipant.participation ? "Yes" : "No"}
              </div>
            </form>

            {currentParticipant.participation ? (
              <button
                className="badge badge-primary mr-2"
                onClick={() => this.updateParticipation(false)}
              >
                Delete from participants
              </button>
            ) : (
              <button
                className="badge badge-primary mr-2"
                onClick={() => this.updateParticipation(true)}
              >
                Add to participants
              </button>
            )}

            <button
              className="badge badge-danger mr-2"
              onClick={this.deleteParticipant}
            >
              Delete
            </button>

            <button
              type="submit"
              className="badge badge-success"
              onClick={this.updateParticipant}
            >
              Update
            </button>
            <p>{this.state.message}</p>
          </div>
        ) : (
          <div>
            <br />
            <p>Please click on a Participant...</p>
          </div>
        )}
      </div>
    );
  }
}