import React from "react";
import {
  Alert,
  Container,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Row,
  Table,
  Media
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
                <Button type="submit" value="Login" color="success" size="lg">
                  Buy
                </Button>
              </Link>
            </Col>
            <Col xs="2">
              <Link to="/trade/sell">
                <Button type="submit" value="Login" color="warning" size="lg">
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
      symbol: "",
      number: 1,
      price: null,
      bought: false,
      imageUrl: ""
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {
    Axios.get("https://api.iextrading.com/1.0/ref-data/symbols").then(res => {
      let symbols = res.data.filter(company => company.isEnabled);
      Axios.get(
        `https://api.iextrading.com/1.0/stock/${symbols[0].symbol}/price`
      ).then(res => {
        Axios.get(
          `https://api.iextrading.com/1.0/stock/${symbols[0].symbol}/logo`
        ).then(res2 => {
          this.setState({
            symbols,
            symbol: symbols[0].symbol,
            price: res.data,
            bought: false,
            imageUrl: res2.data.url
          });
        });
      });
    });
    setInterval(() => {
      this.setCurrentPrice();
    }, 2000);
  }

  setCurrentPrice() {
    Axios.get(
      `https://api.iextrading.com/1.0/stock/${this.state.symbol}/price`
    ).then(res => {
      this.setState({ price: res.data });
    });
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    if (name === "symbol") {
      Axios.get(`https://api.iextrading.com/1.0/stock/${value}/price`).then(
        res => {
          Axios.get(`https://api.iextrading.com/1.0/stock/${value}/logo`).then(
            res2 => {
              this.setState({
                symbol: value,
                price: res.data,
                bought: false,
                imageUrl: res2.data.url,
                number: 1
              });
            }
          );
        }
      );
    } else {
      this.setState({
        [name]: value,
        bought: false
      });
    }
  }

  handleSubmit(event) {
    console.log(this.state);
    Axios.post("/buy", {
      id: "shota",
      symbol: this.state.symbol,
      price: this.state.price,
      number: this.state.number
    }).then(res => {
      this.setState({ bought: true });
    });
    event.preventDefault();
  }

  confirmation() {
    if (this.state.bought) {
      return <Alert color="success">Successfully Ordered! </Alert>;
    }
  }

  render() {
    let symbols = [];
    if (this.state.symbols) {
      symbols = this.state.symbols.map(symbol => (
        <option value={symbol.symbol}>
          {symbol.symbol} {symbol.name}
        </option>
      ));
      console.log(this.state.symbol);
    }

    return (
      <Container className="App">
        <h2>Buy</h2>
        <Row />
        <Row>
          <Col sm="30" md={{ size: 6, offset: 5 }}>
            <Media>
              <Media>
                <Media src={this.state.imageUrl} alt="logo image" />
              </Media>
            </Media>
          </Col>
        </Row>
        <Form onSubmit={this.handleSubmit} className="form">
          <Col>
            <FormGroup>
              <Label>
                Stock Symbol:
                {/* <select
                  value={this.state.symbol}
                  onChange={this.handleInputChange}
                > */}
                <Input
                  type="select"
                  name="symbol"
                  id="symbol"
                  value={this.state.symbol}
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
                <h1>${this.state.price}</h1>
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
          <Col>
            <FormGroup>
              <Label>
                Total Amount: $
                {(this.state.price * 1000 * this.state.number) / 1000}
              </Label>
            </FormGroup>
          </Col>

          <Button type="submit" value="Buy" color="success">
            Order
          </Button>
        </Form>
        <br />
        {this.confirmation()}
      </Container>
    );
  }
}

class Sell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stocks: []
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {
    Axios.get(`/info?id=shota`).then(res => {
      let stocks = res.data.stocks.filter(stock => !stock.isSold);
      this.setCurrentPrice();
      this.setState({ stocks });
    });
    setInterval(() => {
      this.setCurrentPrice();
    }, 2000);
  }

  setCurrentPrice() {
    let stocks = this.state.stocks;
    for (let i = 0; i < stocks.length; i++) {
      Axios.get(
        `https://api.iextrading.com/1.0/stock/${stocks[i].symbol}/price`
      ).then(res => {
        console.log(res.data);
        stocks[i].currenPrice = res.data;
        this.setState({ stocks });
      });
    }
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    if (name === "symbol") {
      Axios.get(`https://api.iextrading.com/1.0/stock/${value}/price`).then(
        res => {
          this.setState({
            symbol: value,
            price: res.data,
            bought: false
          });
        }
      );
    } else {
      this.setState({
        [name]: value,
        bought: false
      });
    }
  }

  handleSubmit(event) {
    console.log(this.state);
    Axios.post("/buy", {
      id: "shota",
      symbol: this.state.symbol,
      price: this.state.price,
      number: this.state.number
    }).then(res => {
      this.setState({ bought: true });
    });
    event.preventDefault();
  }
  sell(_id, index) {
    Axios.post("/sell", {
      _id
    }).then(res => {
      this.setState((state, props) => {
        let stocks = state.stocks;
        stocks[index].isSold = true;
        return { stocks };
      });
    });
  }

  confirmation() {
    if (this.state.bought) {
      return <Alert color="success">Successfully Sold! </Alert>;
    }
  }

  diff(curr, bef) {
    let diff = (1000 * curr - 1000 * bef) / 1000;
    if (isNaN(diff)) {
      return;
    } else if (diff > 0) {
      return <span style={{ color: "green" }}>{"+" + diff}</span>;
    } else {
      return <span style={{ color: "red" }}>{diff}</span>;
    }
  }

  render() {
    // console.log(this.state.stocks);
    let stocks = this.state.stocks.map((stock, index) => {
      if (stock.isSold) {
        return (
          <tr>
            <td />
            <td />
            <td>
              <Alert color="success">Successfully Sold! </Alert>
            </td>
            <td />
          </tr>
        );
      } else {
        return (
          <tr>
            <td>{stock.symbol}</td>
            <td>{stock.number}</td>
            <td>{stock.price}</td>
            <td>
              {stock.currenPrice}
              <br />
              {this.diff(stock.currenPrice, stock.price)}
            </td>
            <td>
              <Button
                color="warning"
                onClick={() => {
                  this.sell(stock._id, index);
                }}
              >
                Sell
              </Button>
            </td>
          </tr>
        );
      }
    });
    return (
      <Container className="App">
        <h2>Sell</h2>
        <Table>
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Number</th>
              <th>Price</th>
              <th>Current Price</th>
            </tr>
          </thead>
          <tbody>{stocks}</tbody>
        </Table>
        {this.confirmation()}
      </Container>
    );
  }
}

export default Trade;
