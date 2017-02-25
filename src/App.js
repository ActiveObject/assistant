import React, { Component } from 'react';
import { TransitionMotion, spring } from 'react-motion';
import './App.css';
import { scaleTime, scaleLinear, scaleBand } from 'd3-scale';
import { area, line, curveMonotoneX } from 'd3-shape';
import { format } from 'd3-format';
import { timeFormat } from 'd3-time-format';
import MotionPath from './MotionPath';
import Importer from './Importer';
import { DailyNutritionPlan, WeeklyNutritionPlan, toFixed } from './DailyNutritionPlan';
import Card from './Card';

var db = {
  'вівсянка': [0, 0, 65.7, 355].map(x => x / 100),
  'гречка (Бест Альтернатива)': [0, 0, 63, 335].map(x => x / 100),
  'рис (Wild&Brown Rice)': [0, 0, 74.2, 367].map(x => x / 100),

  'яйця (білок)': [4, 0, 0, 16],
  'яйця (жовток)': [4, 4.5, 0, 52],
  'лосось': [20.5, 15.5, 0, 218].map(x => x / 100),
  'молоко пряжене': [3, 4.7, 2.5, 53].map(x => x / 100),
  'тунець шматочками "Премія"': [25.57, 0.56, 0, 140].map(x => x / 100),
  'індичка': [19, 0, 0, 80].map(x => x / 100),
  'сир нежирний "President"': [15, 0.2, 1.8, 69].map(x => x / 100),

  'фініки': [0, 0, 63.8, 285].map(x => x / 100),
  'грейпфрутовий сік': [0, 0, 8, 39].map(x => x / 100),
  'йогурт грецький "extra 2%"': [6.7, 2, 4.9, 64].map(x => x / 100),
  'йогурт грецький премія "0%"': [8, 0, 5, 52].map(x => x / 100),
  'варення чорна смородина': [0, 0, 55, 220].map(x => x / 100),
  'шоколад (Noir 72%)': [7.86, 39.72, 35.47, 555].map(x => x / 10),
  'шоколад (Libeert Luxury 85%)': [10.1, 48.4, 16.2, 555].map(x => x / 10),
  'горіхи грецькі': [21.2, 56.6, 10.6, 636.6].map(x => x / 100),
  'маслини Iberica': [0, 16, 0, 151].map(x => x / 100),
};

var mon = [
  ['вівсянка', 80],
  ['фініки', 35],
  ['молоко пряжене', 250],
  ['грейпфрутовий сік', 250],

  ['яйця (білок)', 5],
  ['яйця (жовток)', 3],
  ['гречка (Бест Альтернатива)', 80],

  ['індичка', 250],
  ['маслини Iberica', 30],

  ['шоколад (Noir 72%)', 2],

  ['йогурт грецький премія "0%"', 150],
  ['горіхи грецькі', 20],
  ['варення чорна смородина', 20],
];

var tue = [
  ['вівсянка', 60],
  ['фініки', 35],
  ['молоко пряжене', 250],
  ['грейпфрутовий сік', 250],

  ['яйця (білок)', 4],
  ['яйця (жовток)', 2],
  ['гречка (Бест Альтернатива)', 80],

  ['лосось', 200],
  ['рис (Wild&Brown Rice)', 80],
  ['маслини Iberica', 30],

  ['шоколад (Libeert Luxury 85%)', 2],

  ['йогурт грецький "extra 2%"', 150],
  ['горіхи грецькі', 20],
  ['варення чорна смородина', 20],
];

var wed = [
  ['вівсянка', 60],
  ['фініки', 35],
  ['молоко пряжене', 250],
  ['грейпфрутовий сік', 250],

  ['тунець шматочками "Премія"', 130],
  ['рис (Wild&Brown Rice)', 80],

  ['індичка', 200],
  ['рис (Wild&Brown Rice)', 80],
  ['маслини Iberica', 30],

  ['шоколад (Libeert Luxury 85%)', 2],

  ['йогурт грецький "extra 2%"', 150],
  ['горіхи грецькі', 20],
  ['варення чорна смородина', 20],
];

var thu = [
  ['вівсянка', 60],
  ['фініки', 35],
  ['молоко пряжене', 250],
  ['грейпфрутовий сік', 250],

  ['яйця (білок)', 4],
  ['яйця (жовток)', 2],
  ['гречка (Бест Альтернатива)', 80],

  ['індичка', 200],
  ['рис (Wild&Brown Rice)', 80],
  ['маслини Iberica', 30],

  ['шоколад (Libeert Luxury 85%)', 2],

  ['йогурт грецький "extra 2%"', 150],
  ['горіхи грецькі', 20],
  ['варення чорна смородина', 20],
];

var fri = thu;
var sat = fri;
var sun = sat;

class App extends Component {
  render() {
    return (
      <Importer>
        {transactions =>
          <div className="App">
            <DailyNutritionPlan foods={mon} db={db} />
            <DailyNutritionPlan foods={tue} db={db} />
            <DailyNutritionPlan foods={wed} db={db} />
            <DailyNutritionPlan foods={thu} db={db} />
            <DailyNutritionPlan foods={fri} db={db} />
            <DailyNutritionPlan foods={sat} db={db} />
            <DailyNutritionPlan foods={sun} db={db} />
            <WeeklyNutritionPlan foods={[mon, tue, wed, thu, fri, sat, sun]} db={db} />
            <TDEETable bmr={BMR({ weight: 78, height: 182, age: 25})} />

            <AccountExpedinture transactions={transactions} />
            <MonthExpenditureChart transactions={transactions} width={800} height={400} />
          </div>
        }
      </Importer>
    );
  }
}

function TDEETable({ bmr }) {
  return (
    <Card style={{ padding: 10}}>
      <table style={{ backgroundColor: "white" }}>
        <thead>
          <tr>
            <th>Amount of exercise</th>
            <th>Description</th>
            <th className="td-right">TDEE, kcal</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>BMR</td>
            <td></td>
            <td className="td-right">{toFixed(bmr)}</td>
          </tr>
          <tr>
            <td>Sedentary</td>
            <td>Little or no Exercise</td>
            <td className="td-right">{toFixed(bmr * 1.2)}</td>
          </tr>
          <tr>
            <td>Lightly active</td>
            <td>Light exercise/sports 1-3 days/week</td>
            <td className="td-right">{toFixed(bmr * 1.375)}</td>
          </tr>
          <tr>
            <td>Moderately active</td>
            <td>Moderate exercise/sports 3-5 days/week</td>
            <td className="td-right">{toFixed(bmr * 1.55)}</td>
          </tr>
          <tr>
            <td>Very active</td>
            <td>Heavy exercise/sports 6-7 days/week</td>
            <td className="td-right">{toFixed(bmr * 1.725)}</td>
          </tr>
          <tr>
            <td>Extremely active</td>
            <td>Very heavy exercise/physical job/training twice a day</td>
            <td className="td-right">{toFixed(bmr * 1.9)}</td>
          </tr>
        </tbody>
      </table>
    </Card>
  )
}

function BMR({ weight, height, age }) {
  return 10 * weight + 6.25 * height - 5 * age + 5;
}

function AccountExpedinture({ transactions }) {
  if (transactions.length === 0) {
    return null;
  }

  return (
    <Card>
      <Summary transactions={transactions} />
      <TransactionRange transactions={transactions}>
        {range => <AccountBalanceChart transactions={transactions} width={800} height={400} range={range} />}
      </TransactionRange>
    </Card>
  );
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

function MonthExpenditureChart({ transactions, width, height }) {
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
