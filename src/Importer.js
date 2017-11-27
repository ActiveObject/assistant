import React, { Component } from 'react';

export default class Importer extends Component {
  state = {
    waitingForData: true,
    draggingOver: false,
    transactions: []
  }

  onDragOver = (event) => {
    event.preventDefault();
    this.setState({ draggingOver: true });
  }

  onDrop = (event) => {
    event.preventDefault();
    var file = event.dataTransfer.files[0];
    var reader = new FileReader();

    reader.onload = (event) => {
      this.setState({
        draggingOver: false,
        waitingForData: false,
        transactions: parseStar24Statement(event.target.result)
      });
    };

    reader.readAsText(file);
  }

  render() {
    var { waitingForData, draggingOver, transactions } = this.state;

    if (waitingForData) {
      return (
        <div className={`drop-area ${draggingOver && 'dragging-over'}`} onDragOver={this.onDragOver} onDrop={this.onDrop}>
          {this.props.children(transactions)}
        </div>
      )
    }

    return (
      <div className={`drop-area ${draggingOver && 'dragging-over'}`} onDragOver={this.onDragOver} onDrop={this.onDrop}>
        {this.props.children(transactions)}
      </div>
    );
  }
}

function parseStar24Statement(htmlContent) {
  var doc = document.createElement('div');
  doc.innerHTML = htmlContent;
  var rows = Array.from(doc.querySelectorAll('.opersTable tbody tr'));
  var transactions = rows.map(row => {
    var cells = row.querySelectorAll('td');
    var date = parseStar24Date(cells[0].textContent);

    if (isNaN(date.valueOf())) {
      date = parseStar24Date(cells[1].textContent);
    }

    var description = cells[cells.length === 6 ? 2 : 3].textContent;
    var currency = cells[cells.length === 6 ? 3 : 4].textContent;
    var amount = parseStar24Number(cells[cells.length === 6 ? 4 : 5].textContent);

    return { date, description, currency, amount };
  });

  transactions.sort((a, b) => a.date.valueOf() - b.date.valueOf());

  var balance = parseInitialBalance(doc);
  return transactions.map(t => {
    balance += t.amount;

    return Object.assign(t, {
      balance
    });
  });
}

function parseStar24Date(rawDate) {
  var [day, month, year] = rawDate.split('.');
  return new Date(year, Number(month) - 1, day);
}

function parseStar24Number(rawNumber) {
  return Number(rawNumber.trim().replace(/\s/, ''));
}

function parseInitialBalance(doc) {
  var cell = doc.querySelectorAll('table')[7].querySelector("tr:nth-child(3) td");
  var [_, rawNumber] = cell.textContent.split(':');

  return Number(rawNumber.trim().replace(/\s/, ''));
}
