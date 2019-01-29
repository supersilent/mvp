import React from "react";
import {
  Container,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button
} from "reactstrap";
import Axios from "axios";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      password: ""
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    Axios.get(`info?id=${this.state.id}`);
    this.props.signIn(this.state.id);
    event.preventDefault();
  }

  render() {
    return (
      <Container className="App">
        <h2>Sign in</h2>

        <Form onSubmit={this.handleSubmit} className="form">
          <Col>
            <FormGroup>
              <Label>
                User ID:
                <Input
                  name="id"
                  type="string"
                  checked={this.state.id}
                  onChange={this.handleInputChange}
                />
              </Label>
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label>
                Password:
                <Input
                  type="password"
                  name="password"
                  value={this.state.password}
                  onChange={this.handleInputChange}
                />
              </Label>
            </FormGroup>
          </Col>
          <Button type="submit" value="Login">
            Sing in
          </Button>
        </Form>
      </Container>
    );
  }
}
export default Login;
