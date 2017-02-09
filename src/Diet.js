import React, { Component } from 'react';
import './Diet.css';

export default class Diet extends Component {
  render() {
    return (
      <div style={{width: '100%'}}>
        <table>
          <thead>
            <tr>
              <th>продукт</th>
              <th>кількість</th>
              <th>білки, г</th>
              <th>вуглеводи, г</th>
              <th>жири, г</th>
              <th>ккал</th>
            </tr>
          </thead>
          <tr>
            <td>вівсянка, г</td>
            <td>60</td>
            <td>-</td>
            <td>40</td>
            <td>-</td>
            <td>213</td>
          </tr>
          <tr>
            <td>фініки, г</td>
            <td>35</td>
            <td>-</td>
            <td>22</td>
            <td>-</td>
            <td>100</td>
          </tr>
          <tr>
            <td>молоко пряжене, мл</td>
            <td>250</td>
            <td>7.5</td>
            <td>12</td>
            <td>6</td>
            <td>133</td>
          </tr>
          <tr className="divider"></tr>
          <tr>
            <td>йогурт грецький, г</td>
            <td>150</td>
            <td>7.2</td>
            <td>5.25</td>
            <td>15</td>
            <td>184.5</td>
          </tr>
          <tr>
            <td>горіхи грецькі, г</td>
            <td>20</td>
            <td>4.24</td>
            <td>2</td>
            <td>11.3</td>
            <td>127.2</td>
          </tr>
          <tr>
            <td>варення чорна смородина, г</td>
            <td>20</td>
            <td>-</td>
            <td>20</td>
            <td>-</td>
            <td>44</td>
          </tr>
        </table>
      </div>
    );
  }
}
