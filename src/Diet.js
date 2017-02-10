import React, { Component } from 'react';
import './Diet.css';

export default class Diet extends Component {
  state = {
    dayDiet: [
      ['вівсянка', 60, 13.1, 6.2, 65.7, 355],
      ['фініки', 35, 1.61, 0.54, 63.8, 285],
      ['молоко пряжене', 250, 3, 4.7, 2.5, 53],
      ['йогурт грецький', 150, 4.8, 10, 3.5, 123],
      ['горіхи грецькі', 20, 21.2, 56.6, 10.6, 636.6],
      ['варення чорна смородина', 20, 0, 0, 55, 220]
    ]
  }

  render() {
    var { dayDiet } = this.state;

    return (
      <div className="diet">
        <table>
          <thead>
            <tr>
              <th>продукт</th>
              <th>кількість</th>
              <th>білки, г</th>
              <th>жири, г</th>
              <th>вуглеводи, г</th>
              <th>ккал</th>
            </tr>
          </thead>
          <tbody>
            {dayDiet.map((d, i) => <ProductRow value={d} key={i} />)}
            <SummaryRow value={dayDiet} />
          </tbody>
        </table>
      </div>
    );
  }
}

function ProductRow({ value }) {
  return (
    <tr>
      <td>{value[0]}</td>
      <td>{value[1]}</td>
      <td>{toFixed(amount(value) * protein(value))}</td>
      <td>{toFixed(amount(value) * fat(value))}</td>
      <td>{toFixed(amount(value) * carbohydrates(value))}</td>
      <td>{toFixed(amount(value) * kcal(value))}</td>
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
      <td>{toFixed(p)}</td>
      <td>{toFixed(f)}</td>
      <td>{toFixed(c)}</td>
      <td>{toFixed(k)}</td>
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
