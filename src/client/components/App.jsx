import React from "react";
import Login from "./Login.jsx";
import Trade from "./Trade.jsx";
import Home from "./Home.jsx";
import "./App.css";
import AppRouter from "./AppRouter.jsx";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import {
  Container,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Row
} from "reactstrap";

class Portpholio extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      signIn: true,
      id: ""
    };
    this.signIn = this.signIn.bind(this);
  }

  componentDidMount() {}

  signIn(id) {
    console.log(id);
    this.setState({ signIn: true, id });
  }

  render() {
    if (this.state.signIn) {
      return (
        <Router>
          <div>
            <nav>
              <Row>
                <Col xs="1">
                  <Link to="/">Home</Link>
                </Col>
                <Col xs="1">
                  <Link to="/trade/">Trade</Link>
                </Col>
              </Row>
            </nav>
            <Route
              path="/"
              exact
              component={() => <Home id={this.state.id} />}
            />
            <Route path="/trade/" component={Trade} />
          </div>
        </Router>
      );
    } else {
      return <Login signIn={this.signIn} />;
    }
  }
}

export default Portpholio;
