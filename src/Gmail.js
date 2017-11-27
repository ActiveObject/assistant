import React, { Component } from 'react';

// <GmailAPI clientId={}>
//   {({ isSignedIn, gmail }) =>
//     <FetchMessages gmail={gmail}>
//       {messages => console.log(messages)}
//     </FetchMessages>
//   }
// </GmailAPI>

export default class Gmail extends Component {
  state = {
    messages: [],
    isSignedIn: false
  }

  onload = () => {
    const { clientId } = this.props;

    window.gapi.load('client:auth2', () => {
      window.gapi.client.init({
        discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"],
        clientId: clientId,
        scope: 'https://www.googleapis.com/auth/gmail.readonly'
      }).then(() => {
        this.setState({
          isSignedIn: window.gapi.auth2.getAuthInstance().isSignedIn.get()
        });

        window.gapi.auth2.getAuthInstance().isSignedIn.listen(isSignedIn => {
          this.setState({ isSignedIn });
        });
      });
    });
  }

  signin = () => {
    window.gapi.auth2.getAuthInstance().signIn();
  }

  componentDidMount() {
    if (localStorage.hasOwnProperty('messages')) {
      return this.setState({
        messages: JSON.parse(localStorage.getItem('messages'))
          .filter(isTransaction)
          .map(parseTransaction)
      });
    }

    let s = document.createElement('script');
    s.type = 'text/javascript';
    s.src = 'https://apis.google.com/js/api.js';
    s.async = true;
    s.defer = true;
    s.onload = this.onload;
    document.body.appendChild(s);
  }

  async componentDidUpdate() {
    const { isSignedIn } = this.state;

    if (isSignedIn) {
      const gmail = window.gapi.client.gmail;
      const messagesRes = await gmail.users.messages.list({
        userId: 'me',
        q: '729'
      });
      const messages = [];

      for (const message of messagesRes.result.messages) {
        const msg = await gmail.users.messages.get({
          userId: 'me',
          id: message.id,
          format: 'full'
        });

        messages.push(msg.result.snippet);
      }

      localStorage.setItem('messages', JSON.stringify(messages));
    }
  }

  render() {
    const { isSignedIn, messages } = this.state;

    console.table(messages);

    return (
      <div>
        {isSignedIn || <button onClick={this.signin}>Sign In</button>}
      </div>
    );
  }
}

function isTransaction(msg) {
  msg = msg.match(/(.+)\s?From\s729/)[1];
  var [type] = msg.split(': ');

  return [
    'Oplata tovariv',
    'Otrymannia gotivky',
    'Popovnennya rakhunku',
    'Perekaz koshtiv'
  ].includes(type);
}

function parseTransaction(msg) {
  msg = msg.match(/(.+)\s?From\s729/)[1];
  var _ = '';
  var [type, text] = msg.split(': ');

  switch (type) {
    case 'Oplata tovariv':
    case 'Otrymannia gotivky':
      var [_, description, date, account, amount, balance] = text.match(/(.+)\s(\d{2}\.\d{2}\.\d{4}\s\d{2}:\d{2})\skartka\s(.+)\sna\ssumu\s(.+)\.\sDostupnyi\szalyshok\s(.+)\.\s/);
      return { type, date, account, amount, balance, description };

    case 'Popovnennya rakhunku':
      var [_, date, account, amount, balance] = text.match(/(\d{2}\.\d{2}\.\d{4}\s\d{2}\:\d{2}:\d{2}),\srakhunok\s(.+)\sna\ssumu\s(.+)\.\sDostupniy\szalyshok\s(.+)\.\s/);
      return { type, date, account, amount, balance };

    case 'Perekaz koshtiv':
      var [_, date, account, description, amount, balance] = text.match(/(\d{2}\.\d{2}\.\d{4}\s\d{2}\:\d{2}:\d{2}),\sz\srakhunku\s(.+)\sna\srakhunok\s(.+)\ssuma\s(.+)\.\sDostupniy\szalyshok\s(.+)\.\s/);
      return { type, date, account, amount, balance, description };

    default:
      var amount = text.match(/(na)?\ssum[u|a]\s(.+)\.\sDostupn/)[2];
      var balance = text.match(/Dostupn[yi][iy] zalyshok\s(.+)\.\s/)[1];

      return { type, amount, balance };
  }
}
