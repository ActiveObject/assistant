import React, { Component } from 'react';
import './DailyNutritionPlan.css';
import Card from './Card';
import EditableNumber from './EditableNumber';

export function WeeklyNutritionPlan({ foods, db }) {
  var totalFoods = new Map();

  foods.forEach(dailyPlan => {
    dailyPlan.forEach(food => {
      var [name, amount] = food;

      if (!totalFoods.has(name)) {
        return totalFoods.set(name, [name, amount]);
      }

      totalFoods.get(name)[1] += amount;
    });
  });

  return <DailyNutritionPlan foods={[...totalFoods.values()]} db={db} />
}

export class DailyNutritionPlan extends Component {
  state = {
    disabled: [],
    amountChanges: {}
  }

  toggleIngredient = ingredient => {
    this.setState(state => {
      if (state.disabled.includes(ingredient[0])) {
        return {
          disabled: state.disabled.filter(name => name !== ingredient[0])
        };
      } else {
        return {
          disabled: state.disabled.concat(ingredient[0])
        };
      }
    });
  }

  onChangeAmount = ([name], val) => {
    this.setState(state => ({
      amountChanges: Object.assign({}, state.amountChanges, {
        [name]: val > 0 ? val : 0
      })
    }));
  }

  render() {
    var { foods, db } = this.props;
    var { disabled, amountChanges } = this.state;

    foods = foods.map(food => {
      var [name] = food;

      if (!db.hasOwnProperty(name)) {
        throw new Error(`Can find nutrients for ${name}`);
      }

      if (amountChanges.hasOwnProperty(name)) {
        return [name, amountChanges[name]];
      }

      return food;
    });

    var totalCalories = foods
      .filter(([name]) => !disabled.includes(name))
      .map(([name, amount]) => amount * kcal(db[name]))
      .reduce((a, b) => a + b, 0)

    var totalProtein = foods
      .filter(([name]) => !disabled.includes(name))
      .map(([name, amount]) => amount * protein(db[name]))
      .reduce((a, b) => a + b, 0);

    var totalFat = foods
      .filter(([name]) => !disabled.includes(name))
      .map(([name, amount]) => amount * fat(db[name]))
      .reduce((a, b) => a + b, 0);

    var totalCarbs = foods
      .filter(([name]) => !disabled.includes(name))
      .map(([name, amount]) => amount * carbs(db[name]))
      .reduce((a, b) => a + b, 0);

    return (
      <Card>
        <div className='DailyNutritionPlan'>
          <header>
            <svg width="350" height="350" viewBox="0 0 350 350" style={{ display: 'block', margin: 'auto' }}>
              <g textAnchor="middle" fontFamily="Roboto, sans-serif" fontWeight="100">
                <circle r="100" cx="50%" cy="50%" fill="none" stroke="#5A5D9C" strokeWidth="10" strokeDasharray="2, 1" />
                <text x="50%" y="50%" alignmentBaseline="central" fontSize="2rem" fill="#FDF6E3">{toFixed(totalCalories, 0)}</text>
                <text x="50%" y="225" alignmentBaseline="central" fontSize="0.8rem" fill="#C5C7F1">cal</text>
              </g>
            </svg>

            <div className="nutrients">
              <span>{toFixed(totalProtein)}</span>
              <span>{toFixed(totalFat)}</span>
              <span>{toFixed(totalCarbs)}</span>
            </div>
          </header>

          <div style={{ display: 'flex', width: '100%', height: 5 }}>
            <div style={{ backgroundColor: 'green', height: '100%', width: totalProtein / (totalProtein + totalFat + totalCarbs) * 100 + '%' }} />
            <div style={{ backgroundColor: 'red', height: '100%', width: totalFat / (totalProtein + totalFat + totalCarbs) * 100 + '%' }} />
            <div style={{ backgroundColor: 'yellow', height: '100%', width: totalCarbs / (totalProtein + totalFat + totalCarbs) * 100 + '%' }} />
          </div>

          <table>
            <thead>
              <tr>
                <th>продукт</th>
                <th className="td-right">кількість</th>
                <th className="td-right">білки, г</th>
                <th className="td-right">жири, г</th>
                <th className="td-right">вуглеводи, г</th>
                <th className="td-right">ккал</th>
              </tr>
            </thead>
            <tbody>
              {foods.map((d, i) => <ProductRow food={d} db={db} key={i} onClick={this.toggleIngredient} onChangeAmount={this.onChangeAmount} disabled={disabled.includes(d[0])} />)}
            </tbody>
          </table>
        </div>
      </Card>
    )
  }
}

function ProductRow({ food, db, disabled, onClick, onChangeAmount }) {
  var [name, amount] = food;

  return (
    <tr className={disabled && 'disabled'}>
      <td onClick={() => onClick(food)}>{name}</td>
      <td className="td-right">
        <EditableNumber value={amount} scaleFactor={0.3} onChange={val => onChangeAmount(food, val)} />
      </td>
      <td className="td-right">{toFixed(amount * protein(db[name]))}</td>
      <td className="td-right">{toFixed(amount * fat(db[name]))}</td>
      <td className="td-right">{toFixed(amount * carbs(db[name]))}</td>
      <td className="td-right">{toFixed(amount * kcal(db[name]))}</td>
    </tr>
  )
}

export function toFixed(number, digits = 1) {
  return Math.round(number * Math.pow(10, digits)) / Math.pow(10, digits);
}

function protein(food) {
  return food[0];
}

function fat(food) {
  return food[1];
}

function carbs(food) {
  return food[2];
}

function kcal(food) {
  return food[3];
}
