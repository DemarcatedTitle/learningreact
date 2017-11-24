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
      locatedAt: '',
      bio: '',
      favorite_game: '',
      redirectToReferrer: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
    this.setState({ [event.target.name]: event.target.value });
  }
  // Must change click
  handleClick(event) {
    event.preventDefault();
    fetch('/api/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('idtoken'),
      },
      body: JSON.stringify({
        locatedAt: this.state.locatedat,
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
  componentDidUpdate() {}
  componentDidMount() {}
  componentWillUnmount() {}
  render() {
    return (
      <div className="componentContainer">
        <div className="spacer" />
        <div className="loginContainer">
          <form className="login">
            <div>
              <label htmlFor="location">Location</label>
              <div className="spacer" />
              <input name="location" />
              <label htmlFor="favoriteGame">Favorite Game</label>
              <div className="spacer" />
              <input name="favoriteGame" />
              <label htmlFor="bio">Bio</label>
              <div className="spacer" />
              <textarea rows="10" cols="40" name="bio" />
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
