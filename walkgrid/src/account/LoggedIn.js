/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import React from "react";
import PropTypes from "prop-types";
import {
    BrowserRouter as Router,
    Route,
    Link,
    Redirect
} from "react-router-dom";
import { withRouter } from "react-router";
class LoggedIn extends React.PureComponent {
    /* eslint-disable-next-line */
    static PropTypes = {
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    };
    // constructor(props) {
    //     super(props);
    //     // this.state = { loggedIn: this.props.loggedIn };
    // }
    logout() {
        let history = this.props.history;
        // this.setState({ loggedIn: null });
        window.localStorage.clear();
        return history.push("/");
    }
    render() {
        if (this.props.loggedIn === false) {
            return (
                <li>
                    <Link to="/login">Log in</Link>
                </li>
            );
        } else {
            return (
                <li>
                    <button onClick={this.props.logout}>
                        <span className="button_inner">Sign Out</span>
                    </button>
                </li>
            );
        }
    }
}
export default withRouter(LoggedIn);
