import React, { Component } from 'react';
import { scaleTime, scaleLinear, scaleBand } from 'd3-scale';
import { area, line, curveMonotoneX } from 'd3-shape';
import { format } from 'd3-format';
import { timeFormat } from 'd3-time-format';
import { TransitionMotion, spring } from 'react-motion';
import Card from './Card';
import MotionPath from './MotionPath';

export function AccountExpedinture({ transactions }) {
  if (transactions.length === 0) {
    return null;
  }

  return (
    <Card>
      <Summary transactions={transactions} />
      <TransactionRange transactions={transactions}>
        {range =>
          [
            <AccountBalanceChart transactions={transactions} width={800} height={400} range={range} />,
            <AccountExpedintureChart transactions={transactions} width={800} height={400} range={range} />,
          ]
        }
      </TransactionRange>
    </Card>
  );
}

export function MonthExpenditureChart({ transactions, width, height }) {
  if (transactions.length === 0) {
    return null;
  }

  var expenditureByMonth = new Map();

  transactions.forEach(transaction => {
    var key = timeFormat('%b %Y')(transaction.date);

    if (!expenditureByMonth.has(key)) {
      expenditureByMonth.set(key, 0);
    }

    if (transaction.amount < 0) {
      expenditureByMonth.set(key, expenditureByMonth.get(key) - transaction.amount);
    }
  });

  var x = scaleBand()
    .domain([...expenditureByMonth.keys()])
    .rangeRound([0, width])
    .padding(0.1)

  var y = scaleLinear()
    .domain([0, Math.max(...expenditureByMonth.values())])
    .rangeRound([height, 0]);

  return (
    <Card>
      <svg width={width} height={height}>
        {[...expenditureByMonth.keys()].map(month =>
          <rect
            key={month}
            fill="#9FE9E4"
            x={x(month)}
            y={y(expenditureByMonth.get(month))}
            width={x.bandwidth()}
            height={height - y(expenditureByMonth.get(month))}
          >
            <title>{`${month} - ${expenditureByMonth.get(month)} UAN`}</title>
          </rect>
        )}

        <YAxis ticks={10} scale={y} width={width} />
      </svg>
    </Card>
  )
}


class TransactionRange extends Component {
  state = {
    range: [0, this.props.transactions.length - 1]
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
    var { range } = this.state;
    var { transactions } = this.props;

    return (
      <div>
        {this.props.children(range)}
        <input type="range" min={0} max={transactions.length - 1} step="1" value={range[0]} onChange={this.setRangeStart} />
        <input type="range" min={0} max={transactions.length - 1} step="1" value={range[1]} onChange={this.setRangeEnd} />
      </div>
    )
  }
}

function Summary({ transactions }) {
  var balance = transactions[0].balance;
  var income = transactions.map(t => t.amount).filter(x => x > 0).reduce((a, b) => a + b);
  var expenditure = transactions.map(t => t.amount).filter(x => x < 0).reduce((a, b) => a + b);

  var places = new Map();

  transactions.forEach(transaction => {
    if (!places.has(transaction.description)) {
      places.set(transaction.description, 0)
    }

    places.set(transaction.description, places.get(transaction.description) + 1);
  });

  return (
    <div>
      <div>{`Balance: ${balance}`}</div>
      <div>{`Income: ${income}`}</div>
      <div>{`Expenditure: ${expenditure}`}</div>
    </div>
  )
}

function AccountExpedintureChart({ transactions, width, height, range }) {
  var values = new Map();

  transactions
    .slice(range[0], range[1])
    .filter(t => t.amount < 0)
    .forEach(t => {
      if (values.has(t.date.toString())) {
        values.get(t.date.toString()).amount += (-t.amount);
      } else {
        values.set(t.date.toString(), {
          amount: -t.amount,
          date: t.date
        });
      }
    });

  values = [...values.values()];

  var x = scaleTime()
    .domain([values[0].date, values[values.length - 1].date])
    .rangeRound([0, width]);

  var y = scaleLinear()
    .domain([0, Math.max(...values.map(d => d.amount))])
    .rangeRound([height, height * 0.1]);

  return (
    <svg width={width} height={height}>
      <g className="bars">
        {values.map(d => <rect x={x(d.date)} y={y(d.amount)} width={6} height={height - y(d.amount)} fill="#71D1CA" />)}
      </g>

      <YAxis ticks={10} scale={y} width={width} />
    </svg>
  )
}

function AccountBalanceChart({ transactions, width, height, range }) {
  debugger
  var values = new Map();

  transactions
    .slice(range[0], range[1])
    .filter(t => t.amount < 0)
    .forEach(t => {
      if (values.has(t.date.toString())) {
        values.get(t.date.toString()).balance += t.balance;
      } else {
        values.set(t.date.toString(), {
          amount: -t.amount,
          date: t.date
        });
      }
    });

  values = [...values.values()];

  var x = scaleTime()
    .domain([transactions[range[0]].date, transactions[range[1]].date])
    .rangeRound([0, width]);

  var y = scaleLinear()
    .domain([0, Math.max(...transactions.map(d => d.balance))])
    .rangeRound([height, height * 0.1]);

  return (
    <svg width={width} height={height}>
      <g className="bars">
        {values.map(d => <rect x={x(d.date)} y={y(d.amount)} width={6} height={height - y(d.amount)} fill="#71D1CA" />)}
      </g>

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
