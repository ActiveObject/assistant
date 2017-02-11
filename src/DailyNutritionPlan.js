import React, { Component } from 'react';
import './DailyNutritionPlan.css';

export default class DailyNutritionPlan extends Component {
  state = {
    foods: [
      ['вівсянка', 60, 13.1, 6.2, 65.7, 355],
      ['фініки', 35, 1.61, 0.54, 63.8, 285],
      ['молоко пряжене', 250, 3, 4.7, 2.5, 53],
      ['грейпфрутовий сік', 250, 0, 0, 8, 39],

      ['яйця (3 цілих)', 200, 12, 10, 0.8, 140],
      ['гречка (Бест Альтернатива)', 80, 12.6, 3.3, 63, 335],

      // ['індичка', 200, 19, 0, 0, 80],

      ['лосось', 200, 20.5, 15.5, 0, 218],
      ['рис (Wild&Brown Rice)', 80, 13.7, 1, 74.2, 367],

      ['шоколад (Noir 72%)', 20, 7.86, 39.72, 35.47, 555],

      ['йогурт грецький', 150, 4.8, 10, 3.5, 123],
      ['горіхи грецькі', 20, 21.2, 56.6, 10.6, 636.6],
      ['варення чорна смородина', 20, 0, 0, 55, 220],
    ],

    disabled: []
  }

  toggleIngredient = ingredient => {
    this.setState(state => {
      if (state.disabled.includes(ingredient[0])) {
        return {
          disabled: state.disabled.filter(name => name != ingredient[0])
        };
      } else {
        return {
          disabled: state.disabled.concat(ingredient[0])
        };
      }
    });
  }

  render() {
    var { foods, disabled } = this.state;

    var totalCalories = foods
      .filter(ingredient => !disabled.includes(ingredient[0]))
      .map(ingredient => amount(ingredient) * kcal(ingredient))
      .reduce((a, b) => a + b, 0)

    var totalProtein = foods
      .filter(ingredient => !disabled.includes(ingredient[0]))
      .map(ingredient => amount(ingredient) * protein(ingredient))
      .reduce((a, b) => a + b, 0);

    var totalFat = foods
      .filter(ingredient => !disabled.includes(ingredient[0]))
      .map(ingredient => amount(ingredient) * fat(ingredient))
      .reduce((a, b) => a + b, 0);

    var totalCarbs = foods
      .filter(ingredient => !disabled.includes(ingredient[0]))
      .map(ingredient => amount(ingredient) * carbs(ingredient))
      .reduce((a, b) => a + b, 0);

    return (
      <div className="daily-plan">
        <header>
          <svg width="400" height="400" viewBox="0 0 400 400" style={{ display: 'block', margin: 'auto' }}>
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
            {foods.map((d, i) => <ProductRow value={d} key={i} onClick={this.toggleIngredient} disabled={disabled.includes(d[0])} />)}
          </tbody>
        </table>
      </div>
    )
  }
}

function TDEETable({ bmr }) {
  return (
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
  )
}

function BMR({ weight, height, age }) {
  return 10 * weight + 6.25 * height - 5 * age + 5;
}

function ProductRow({ value, disabled, onClick }) {
  return (
    <tr className={disabled && 'disabled'}>
      <td onClick={() => onClick(value)}>{value[0]}</td>
      <td className="td-right">{value[1]}</td>
      <td className="td-right">{toFixed(amount(value) * protein(value))}</td>
      <td className="td-right">{toFixed(amount(value) * fat(value))}</td>
      <td className="td-right">{toFixed(amount(value) * carbs(value))}</td>
      <td className="td-right">{toFixed(amount(value) * kcal(value))}</td>
    </tr>
  )
}

function toFixed(number, digits = 1) {
  return Math.round(number * Math.pow(10, digits)) / Math.pow(10, digits);
}

function amount(food) {
  return food[1];
}

function protein(food) {
  return food[2] / 100;
}

function fat(food) {
  return food[3] / 100;
}

function carbs(food) {
  return food[4] / 100;
}

function kcal(food) {
  return food[5] / 100;
}
