import React, { Component } from 'react';

export default class Importer extends Component {
  state = {
    balance: generateData()
  }

  random = () => this.setState({ balance: generateData() })

  componentDidMount() {
    setInterval(() => this.random(), 2000);
  }

  render() {
    return this.props.children(this.state.balance);
  }
}

function generateData() {
  return [
    [new Date('2016-01-01'), randomNum(30000, 100000)],
    [new Date('2016-02-01'), randomNum(30000, 100000)],
    [new Date('2016-03-01'), randomNum(30000, 100000)],
    [new Date('2016-04-01'), randomNum(30000, 100000)],
    [new Date('2016-05-01'), randomNum(30000, 100000)],
    [new Date('2016-06-01'), randomNum(30000, 100000)]
  ];
}

function randomNum(from, to) {
  return Math.random() * (to - from) + from;
}
