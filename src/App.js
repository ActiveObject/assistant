import React, { Component } from 'react';
import './App.css';
import Importer from './Importer';
import { DailyNutritionPlan, WeeklyNutritionPlan, TDEETable, bmr } from './nutrition';
import { AccountExpedinture, MonthExpenditureChart } from './accountant';

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
  'шоколад (Libeert Luxury 85%)': [10.1, 48.4, 16.2, 577].map(x => x / 10),
  'горіхи грецькі': [21.2, 56.6, 10.6, 636.6].map(x => x / 100),
  'маслини Iberica': [0, 16, 0, 151].map(x => x / 100),
  'малина заморожена': [0, 0, 10, 40].map(x => x / 100),
  'полуниця заморожена': [0, 0, 15, 60].map(x => x / 100),
  'протеїн': [24, 1, 4, 120],
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
  ['рис (Wild&Brown Rice)', 80],
  ['маслини Iberica', 30],

  ['шоколад (Noir 72%)', 2],

  ['йогурт грецький премія "0%"', 150],
  ['горіхи грецькі', 20],
  ['варення чорна смородина', 20],
];

var tue = [
  ['вівсянка', 80],
  ['фініки', 35],
  ['молоко пряжене', 250],
  ['грейпфрутовий сік', 250],
  ['малина заморожена', 150],
  ['полуниця заморожена', 150],
  ['протеїн', 2],

  ['яйця (білок)', 5],
  ['яйця (жовток)', 3],
  ['гречка (Бест Альтернатива)', 80],

  ['рис (Wild&Brown Rice)', 80],
  ['індичка', 250],
  ['маслини Iberica', 30],

  ['шоколад (Noir 72%)', 2],

  ['сир нежирний "President"', 250],
  ['горіхи грецькі', 20],
  ['варення чорна смородина', 20],
];

var wed = [
  ['вівсянка', 80],
  ['фініки', 35],
  ['молоко пряжене', 250],
  ['грейпфрутовий сік', 250],

  ['яйця (білок)', 5],
  ['яйця (жовток)', 3],
  ['рис (Wild&Brown Rice)', 80],

  ['лосось', 200],
  ['рис (Wild&Brown Rice)', 80],
  ['маслини Iberica', 30],

  ['шоколад (Noir 72%)', 2],

  ['йогурт грецький "extra 2%"', 150],
  ['горіхи грецькі', 20],
  ['варення чорна смородина', 20],
];

var thu = [
  ['вівсянка', 80],
  ['фініки', 35],
  ['молоко пряжене', 250],
  ['грейпфрутовий сік', 250],

  ['яйця (білок)', 5],
  ['яйця (жовток)', 3],
  ['гречка (Бест Альтернатива)', 80],

  ['індичка', 200],
  ['рис (Wild&Brown Rice)', 80],
  ['маслини Iberica', 30],

  ['шоколад (Noir 72%)', 2],

  ['йогурт грецький "extra 2%"', 300],
  ['горіхи грецькі', 20],
  ['варення чорна смородина', 20],
];

var fri = thu;
var sat = fri;
var sun = sat;

var cocktail = [
  ['грейпфрутовий сік', 250],
  ['малина заморожена', 150],
  ['полуниця заморожена', 150],
  ['протеїн', 2],
];

export default function App() {
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
          <DailyNutritionPlan foods={cocktail} db={db} />
          <WeeklyNutritionPlan foods={[mon, tue, wed, thu, fri, sat, sun]} db={db} />
          <TDEETable bmr={bmr({ weight: 78, height: 182, age: 25})} />

          <AccountExpedinture transactions={transactions} />
          <MonthExpenditureChart transactions={transactions} width={800} height={400} />
        </div>
      }
    </Importer>
  );
}
