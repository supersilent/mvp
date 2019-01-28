import React from "react";
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
import Axios from "axios";
import "./App.css";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class Trade extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Router>
        <Container>
          <Row>
            <Col xs="2">
              <Link to="/trade/buy">
                <Button type="submit" value="Login">
                  Buy
                </Button>
              </Link>
            </Col>
            <Col xs="2">
              <Link to="/trade/sell">
                <Button type="submit" value="Login">
                  Sell
                </Button>
              </Link>
            </Col>
          </Row>
          <Route path="/trade/buy" component={Buy} />
          <Route path="/trade/sell" component={Sell} />
        </Container>
      </Router>
    );
  }
}

class Buy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      symbols: null,
      selectedSymbol: "",
      number: 1,
      price: null
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {
    console.log("mount");
    Axios.get("https://api.iextrading.com/1.0/ref-data/symbols").then(res => {
      this.setState({ symbols: res.data.filter(company => company.isEnabled) });
    });
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    if (name === "selectedSymbol") {
      Axios.get(`https://api.iextrading.com/1.0/stock/${value}/price`).then(
        res => {
          this.setState({
            selectedSymbol: value,
            price: res.data
          });
        }
      );
    } else {
      this.setState({
        [name]: value
      });
    }
  }

  handleSubmit(event) {
    console.log(this.state);

    event.preventDefault();
  }

  render() {
    let symbols = [];
    if (this.state.symbols) {
      symbols = this.state.symbols.map(symbol => (
        <option value={symbol.symbol}>
          {symbol.symbol} {symbol.name}
        </option>
      ));
      console.log(this.state.selectedSymbol);
    }

    return (
      <Container className="App">
        <h2>Buy</h2>
        <Form onSubmit={this.handleSubmit} className="form">
          <Col>
            <FormGroup>
              <Label>
                Stock Symbol:
                {/* <select
                  value={this.state.selectedSymbol}
                  onChange={this.handleInputChange}
                > */}
                <Input
                  type="select"
                  name="selectedSymbol"
                  id="selectedSymbol"
                  value={this.state.selectedSymbol}
                  onChange={this.handleInputChange}
                >
                  {symbols}
                </Input>
              </Label>
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label>
                Current price:
                <br />
                {this.state.price}
              </Label>
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label>
                Number of Shares:
                <Input
                  name="number"
                  type="number"
                  value={this.state.number}
                  onChange={this.handleInputChange}
                />
              </Label>
            </FormGroup>
          </Col>

          <Button type="submit" value="Buy">
            Order
          </Button>
        </Form>
      </Container>
    );
  }
}

function Sell() {
  return <div>Sell</div>;
}

export default Trade;
