import React, { Component } from 'react';
import { TransitionMotion, spring } from 'react-motion';
import './App.css';
import { scaleTime, scaleLinear } from 'd3-scale';
import { area, line, curveMonotoneX } from 'd3-shape';
import { extent } from 'd3-array';
import { format } from 'd3-format';
import MotionPath from './MotionPath';
import Importer from './Importer';

class App extends Component {
  state = {
    width: window.innerWidth,
    height: 400,
    range: [0, 0]
  }

  componentDidMount() {
    window.onresize = () => this.setState({ width: window.innerWidth })
  }

  setRangeStart = (event) => {
    var { value } = event.target;
    this.setState(state => ({
      range: [value, state.range[1]]
    }));
  }

  setRangeEnd = (event) => {
    var { value } = event.target;
    this.setState(state => ({
      range: [state.range[0], value]
    }));
  }

  render() {
    var { width, height, range } = this.state;

    return (
      <div className="App">
        <Importer>
          {transactions =>
            <header>
              <AccountBalanceChart transactions={transactions} width={width} height={height} range={range} />
              <input type="range" min={0} max={transactions.length - 1} step="1" value={range[0]} onChange={this.setRangeStart} />
              <input type="range" min={0} max={transactions.length - 1} step="1" value={range[1]} onChange={this.setRangeEnd} />
            </header>
          }
        </Importer>
      </div>
    );
  }
}

function AccountBalanceChart({ transactions, width, height, range }) {
  var x = scaleTime()
    .domain([transactions[range[0]].date, transactions[range[1]].date])
    .rangeRound([0, width]);

  var y = scaleLinear()
    .domain([0, Math.max(...transactions.map(d => d.balance))])
    .rangeRound([height, height * 0.1]);

  var createArea = area()
    .curve(curveMonotoneX)
    .x(d => x(d.date))
    .y0(y(0))
    .y1(d => y(d.balance))

  var createLine = line()
    .curve(curveMonotoneX)
    .x(d => x(d.date))
    .y(d => y(d.balance))

  return (
    <svg width={width} height={height}>
      <MotionPath path={createArea(transactions)}>
        {d => <path d={d} fill="#9FE9E4" />}
			</MotionPath>

      <MotionPath path={createLine(transactions)}>
        {d => <path d={d} fill="none" stroke="#71D1CA" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />}
      </MotionPath>

      <YAxis ticks={10} scale={y} width={width} />
    </svg>
  )
}

function YAxis({ ticks, scale, width }) {
  const styles = scale.ticks(ticks).slice(1).map((t) => ({
		key: String(t),
		data: t,
		style: {
			x: spring(scale(t)),
			opacity: spring(1),
		},
	}));

  const fixedPoint = format('.3f');

	return (
		<TransitionMotion styles={styles} willLeave={willLeave} willEnter={willEnter}>
			{(styles) => (
				<g className="axis">
					{styles.map(({key, data, style}) => (
						<g key={key}
							transform={`translate(0, ${fixedPoint(style.x)})`}
							opacity={fixedPoint(style.opacity)}>

							<text x={20} y={2} children={data} />
						</g>
					))}
				</g>
			)}
		</TransitionMotion>
	);
}

function willLeave({style}) {
	return {x: style.x, opacity: spring(0)};
}

function willEnter({style}) {
	return {x: style.x.val, opacity: 0};
}

export default App;
