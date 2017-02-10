import React, { Component } from 'react';
import './Diet.css';

export default class Diet extends Component {
  state = {
    dayDiet: [
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
    ]
  }

  render() {
    var { dayDiet } = this.state;
    var bmr = BMR({
      weight: 79,
      height: 181,
      age: 25
    });

    return (
      <div className="diet">
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
            {dayDiet.map((d, i) => <ProductRow value={d} key={i} />)}
            <SummaryRow value={dayDiet} />
          </tbody>
        </table>

        <div>BMR: {bmr}</div>
        <TDEETable bmr={bmr} />
      </div>
    );
  }
}

function TDEETable({ bmr }) {
  return (
    <table>
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

function ProductRow({ value }) {
  return (
    <tr>
      <td>{value[0]}</td>
      <td className="td-right">{value[1]}</td>
      <td className="td-right">{toFixed(amount(value) * protein(value))}</td>
      <td className="td-right">{toFixed(amount(value) * fat(value))}</td>
      <td className="td-right">{toFixed(amount(value) * carbohydrates(value))}</td>
      <td className="td-right">{toFixed(amount(value) * kcal(value))}</td>
    </tr>
  )
}

function SummaryRow({ value }) {
  var p = value
    .map(food => amount(food) * protein(food))
    .reduce((a, b) => a + b);

  var f = value
    .map(food => amount(food) * fat(food))
    .reduce((a, b) => a + b);

  var c = value
    .map(food => amount(food) * carbohydrates(food))
    .reduce((a, b) => a + b);

  var k = value
    .map(food => amount(food) * kcal(food))
    .reduce((a, b) => a + b);

  return (
    <tr className="summary">
      <td></td>
      <td></td>
      <td className="td-right">{toFixed(p)}</td>
      <td className="td-right">{toFixed(f)}</td>
      <td className="td-right">{toFixed(c)}</td>
      <td className="td-right">{toFixed(k)}</td>
    </tr>
  )
}

function toFixed(number) {
  return Math.round(number * 10) / 10;
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

function carbohydrates(food) {
  return food[4] / 100;
}

function kcal(food) {
  return food[5] / 100;
}
