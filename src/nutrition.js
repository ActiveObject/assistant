import React, { Component } from "react";
import { Motion, spring } from "react-motion";
import "./nutrition.css";
import Card from "./Card";
import EditableNumber from "./EditableNumber";
import { arc, pie } from "d3-shape";

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

  return <DailyNutritionPlan foods={[...totalFoods.values()]} db={db} />;
}

export function DishNutritions({ db, foods }) {
  return (
    <NutritionContainer db={db} foods={foods}>
      {({ foods, disabled, toggleIngredient, onChangeAmount }) =>
        <Card>
          <div className="DailyNutritionPlan">
            <NutritionTable
                db={db}
                foods={foods}
                disabled={disabled}
                toggleIngredient={toggleIngredient}
                onChangeAmount={onChangeAmount}
              />
            </div>
        </Card>
      }
    </NutritionContainer>
  );
}

export function DailyNutritionPlan({ db, foods }) {
  return (
    <NutritionContainer db={db} foods={foods}>
      {({ foods, disabled, toggleIngredient, onChangeAmount }) => (
        <Card>
          <div className="DailyNutritionPlan">
            <header>
              <NutritionRatioChart
                radius={120}
                foods={foods.filter(([name]) => !disabled.includes(name))}
                db={db}
                weight={78}
              />

              <Legend />
            </header>

            <NutritionTable
              db={db}
              foods={foods}
              disabled={disabled}
              toggleIngredient={toggleIngredient}
              onChangeAmount={onChangeAmount}
            />
          </div>
        </Card>
      )}
    </NutritionContainer>
  );
}

function Legend() {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '50px 30% 30px 30%' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <svg width="10" height="10">
          <circle cx="50%" cy="50%" r="50%" fill="#59BBA2" />
        </svg>
        <span style={{ fontSize: '0.8em', marginLeft: '0.5em', color: '#999' }}>б</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <svg width="10" height="10">
          <circle cx="50%" cy="50%" r="50%" fill="#F3748B" />
        </svg>
        <span style={{ fontSize: '0.8em', marginLeft: '0.5em', color: '#999' }}>ж</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <svg width="10" height="10">
          <circle cx="50%" cy="50%" r="50%" fill="#FFAB79" />
        </svg>
        <span style={{ fontSize: '0.8em', marginLeft: '0.5em', color: '#999' }}>в</span>
      </div>
    </div>
  );
}

function NutritionTable({ db, foods, disabled, toggleIngredient, onChangeAmount }) {
  return (
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
        {foods.map((d, i) => (
          <ProductRow
            food={d}
            db={db}
            key={i}
            onClick={toggleIngredient}
            onChangeAmount={onChangeAmount}
            disabled={disabled.includes(d[0])}
          />
        ))}
      </tbody>
    </table>
  );
}

class NutritionContainer extends Component {
  state = {
    disabled: [],
    amountChanges: {}
  };

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
  };

  onChangeAmount = ([name], val) => {
    this.setState(state => ({
      amountChanges: Object.assign({}, state.amountChanges, {
        [name]: val > 0 ? val : 0
      })
    }));
  };

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

    return this.props.children({
      disabled,
      foods,
      toggleIngredient: this.toggleIngredient,
      onChangeAmount: this.onChangeAmount
    });
  }
}

function ProductRow({ food, db, disabled, onClick, onChangeAmount }) {
  var [name, amount] = food;

  return (
    <tr className={disabled && "disabled"}>
      <td onClick={() => onClick(food)}>{name}</td>
      <td className="td-right">
        <EditableNumber
          value={amount}
          scaleFactor={0.3}
          onChange={val => onChangeAmount(food, val)}
        />
      </td>
      <td className="td-right">{toFixed(amount * protein(db, name))}</td>
      <td className="td-right">{toFixed(amount * fat(db, name))}</td>
      <td className="td-right">{toFixed(amount * carbs(db, name))}</td>
      <td className="td-right">{toFixed(amount * kcal(db, name))}</td>
    </tr>
  );
}

function NutritionRatioChart({ radius, foods, db, weight }) {
  var totalCalories = foods
    .map(([name, amount]) => amount * kcal(db, name))
    .reduce((a, b) => a + b, 0);

  var totalProtein = foods
    .map(([name, amount]) => amount * protein(db, name))
    .reduce((a, b) => a + b, 0);

  var totalFat = foods
    .map(([name, amount]) => amount * fat(db, name))
    .reduce((a, b) => a + b, 0);

  var totalCarbs = foods
    .map(([name, amount]) => amount * carbs(db, name))
    .reduce((a, b) => a + b, 0);

  var total = totalProtein * 4 + totalCarbs * 4 + totalFat * 9;

  var size = radius * 2;

  var a = arc()
    .outerRadius(radius)
    .innerRadius(radius - 4)
    .padAngle(Math.PI / 135);

  var outerArc = arc()
    .innerRadius(radius * 1.5)
    .outerRadius(radius * 1.5);

  return (
    <NutritionPie
      totalProtein={totalProtein}
      totalFat={totalFat}
      totalCarbs={totalCarbs}
    >
      {p => (
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ display: "block", margin: "auto", overflow: "visible" }}
        >
          <g textAnchor="middle">
            <Motion
              style={{
                value: spring(totalCalories, {
                  stiffness: 210,
                  damping: 20,
                  precision: 0.01
                })
              }}
            >
              {({ value }) => (
                <text x="50%" y="50%" dx="10">
                  <tspan
                    alignmentBaseline="central"
                    fontSize="3rem"
                    fill="#555"
                  >
                    {toFixed(value, 0)}
                  </tspan>
                  <tspan dy="1.15rem" fontSize="0.8rem" fill="#777">
                    ккал
                  </tspan>
                </text>
              )}
            </Motion>

            <g transform={`translate(${radius}, ${radius})`}>
              {p.map((d, i) => (
                <g key={i}>
                  <path d={a(d)} fill={d.data.color} />
                  <text
                    fill={d.data.textColor || d.data.color}
                    value={d.data.value}
                    x={outerArc.centroid(d)[0]}
                    y={outerArc.centroid(d)[1]}
                    dy={annotationOffset(d)}
                    textAnchor="middle"
                    fontSize="0.9rem"
                    alignmentBaseline="central"
                  >
                    {`${toFixed(d.data.value, 0)}г / ${toFixed(
                      (d.data.calories / total) * 100,
                      0
                    )}% / ${toFixed(d.data.value / weight, 1)}`}
                  </text>
                </g>
              ))}
            </g>
          </g>
        </svg>
      )}
    </NutritionPie>
  );
}

function annotationOffset(d) {
  return Math.sin((d.startAngle + d.endAngle) / 2 + Math.PI * 0.5) * 35;
}

function NutritionPie({ totalProtein, totalFat, totalCarbs, children }) {
  return (
    <Motion
      style={{
        p: spring(totalProtein),
        f: spring(totalFat),
        c: spring(totalCarbs)
      }}
    >
      {({ p, f, c }) => {
        var nutritionPie = pie()
          .sort(null)
          .value(d => d.calories)([
          {
            value: p,
            calories: p * 4,
            color: "#59BBA2",
            textColor: "#1F8F73"
          },
          {
            value: f,
            calories: f * 9,
            color: "#F3748B",
            textColor: "#CE2C49"
          },
          {
            value: c,
            calories: c * 4,
            color: "#FFAB79",
            textColor: "#DC6F2F"
          }
        ]);

        return children(nutritionPie);
      }}
    </Motion>
  );
}

export class TDEETable extends Component {
  state = {
    weight: 77,
    height: 180,
    age: 25
  };

  render() {
    const { weight, height, age } = this.state;
    const bmr = 10 * weight + 6.25 * height - 5 * age + 5;

    return (
      <Card style={{ padding: 10 }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <EditableNumber
            value={weight}
            scaleFactor={0.3}
            onChange={weight => this.setState({ weight })}
          />
          kg
          {" - "}
          <EditableNumber
            value={height}
            scaleFactor={0.3}
            onChange={height => this.setState({ height })}
          />
          cm
          {" - "}
          <EditableNumber
            value={age}
            scaleFactor={0.1}
            onChange={age => this.setState({ age })}
          />
          y
        </div>
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
              <td />
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
    );
  }
}

export function bmr({ weight, height, age }) {
  return 10 * weight + 6.25 * height - 5 * age + 5;
}

export function toFixed(number, digits = 1) {
  return Math.round(number * Math.pow(10, digits)) / Math.pow(10, digits);
}

function protein(db, name) {
  return food(db, name)[0];
}

function fat(db, name) {
  return food(db, name)[1];
}

function carbs(db, name) {
  return food(db, name)[2];
}

function kcal(db, name) {
  return food(db, name)[3];
}

function food(db, name) {
  if (Array.isArray(db[name])) {
    return db[name];
  }

  const totalWeight = Object.keys(db[name])
    .map(ingredient => db[name][ingredient])
    .reduce((a, b) => a + b, 0);

  const ingredients = Object.keys(db[name]).map(ingredient =>
    food(db, ingredient).map(nutrition => db[name][ingredient] * nutrition)
  );
  const maxIndex = Math.max(...ingredients.map(ingredient => ingredient.length));
  const composition = [...Array(maxIndex).keys()].map(index =>
    ingredients
      .map(ingredient => ingredient[index])
      .reduce((a, b) => a + b, 0)
  );

  console.log(totalWeight, )

  return composition.map(x => x / totalWeight);
}
