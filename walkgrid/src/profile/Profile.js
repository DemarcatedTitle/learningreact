/* eslint-disable no-console */
/* eslint-disable no-useless-constructor */
import React from 'react';
// import Rooms from "./Rooms.js";
// import Users from "./Users.js";
import moment from 'moment';
class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: '',
      bio: '',
      favorite_game: '',
      redirectToReferrer: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {
    console.log('didmount');
    fetch(`/api/profile/${this.props.match.params.user}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('idtoken'),
      },
      credentials: 'same-origin',
    }).then(response => {
      response.json().then(data => {
        if (data.error) {
          console.log(data);
          return this.setState({ error: data.message });
        }
        if (data) {
          this.setState(data);
        } else {
          console.log('fetch else');
          this.setState({
            location: '',
            bio: '',
            favorite_game: '',
            redirectToReferrer: false,
          });
        }
      });
    });
  }
  handleSubmit(event) {
    event.preventDefault();
    // Must change
    const creds = {
      username: this.state.username,
      password: this.state.password,
    };
    this.props.login(event, creds);
  }
  handleChange(event) {
    const fieldName = event.target.type;
    console.log(this.state);
    this.setState({ [event.target.name]: event.target.value });
  }
  // Must change click
  handleClick(event) {
    console.log(this.state);
    event.preventDefault();
    fetch('/api/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('idtoken'),
      },
      body: JSON.stringify({
        location: this.state.location,
        bio: this.state.bio,
        favorite_game: this.state.favorite_game,
      }),
      credentials: 'same-origin',
    }).then(response => {
      response.json().then(data => {
        if (data.text === 'success') {
          console.log('Profile success');
          console.log(data);
        } else {
          this.setState({ error: data.message });
        }
      });
    });
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.match.params.user !== this.props.match.params.user) {
      fetch(`/api/profile/${this.props.match.params.user}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('idtoken'),
        },
        credentials: 'same-origin',
      }).then(response => {
        response.json().then(data => {
          if (data.error) {
            console.log(data);
            return this.setState({ error: data.message });
          }
          if (data) {
            this.setState(data);
            this.setState({ error: '' });
          } else {
            console.log('fetch else');
            this.setState({
              location: '',
              bio: '',
              favorite_game: '',
              redirectToReferrer: false,
            });
          }
        });
      });
    }
  }
  componentWillUnmount() {}
  render() {
    const canEdit =
      this.props.match.params.user === localStorage.getItem('username')
        ? ''
        : { disabled: true };
    return (
      <div className="componentContainer">
        <div className="spacer" />
        <div className="loginContainer">
          <form className="login">
            <div>
              {this.state.error ? (
                <div className="validationErr">{this.state.error}</div>
              ) : (
                ''
              )}
              <label htmlFor="location">Location</label>
              <div className="spacer" />
              <input
                {...canEdit}
                value={this.state.location}
                onChange={this.handleChange}
                name="location"
              />
              <label htmlFor="favorite_game">Favorite Game</label>
              <div className="spacer" />
              <input
                {...canEdit}
                value={this.state.favorite_game}
                onChange={this.handleChange}
                name="favorite_game"
              />
              <label htmlFor="bio">Bio</label>
              <div className="spacer" />
              <textarea
                {...canEdit}
                onChange={this.handleChange}
                value={this.state.bio}
                rows="10"
                cols="40"
                name="bio"
              />
              <button onClick={this.handleClick}>Save</button>
            </div>
          </form>
        </div>
        <div className="spacer" />
      </div>
    );
  }
}
export default Profile;
