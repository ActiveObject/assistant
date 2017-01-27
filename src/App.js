import React, { Component } from 'react';
import './App.css';
import { scaleTime, scaleLinear } from 'd3-scale';
import { area, line, curveNatural } from 'd3-shape';
import { extent } from 'd3-array';
import MotionPath from './MotionPath';

class App extends Component {
  state = {
    balance: generateData(),
    width: window.innerWidth,
    height: 400
  }

  random = () => this.setState({ balance: generateData() })

  componentDidMount() {
    setInterval(() => this.random(), 2000);
  }

  render() {
    var { balance, width, height } = this.state;

    return (
      <div className="App">
        <header>
          <Chart balance={balance} width={width} height={height} />
        </header>

        <button onClick={this.random}>Random</button>
      </div>
    );
  }
}

function Chart({ balance, width, height }) {
  var x = scaleTime()
    .domain(extent(balance, d => d[0]))
    .rangeRound([0, width]);

  var y = scaleLinear()
    .domain([0, Math.max(...balance.map(d => d[1]))])
    .rangeRound([height, height * 0.1]);

  var createArea = area()
    .curve(curveNatural)
    .x(d => x(d[0]))
    .y0(y(0))
    .y1(d => y(d[1]))

  var createLine = line()
    .curve(curveNatural)
    .x(d => x(d[0]))
    .y(d => y(d[1]))

  return (
    <svg width={width} height={height}>
      <MotionPath path={createArea(balance)}>
        {d => <path d={d} fill="#9FE9E4" />}
			</MotionPath>

      <MotionPath path={createLine(balance)}>
        {d => <path d={d} fill="none" stroke="#71D1CA" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />}
      </MotionPath>
    </svg>
  )
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

export default App;
