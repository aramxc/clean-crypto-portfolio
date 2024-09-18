import React, { useEffect, useState } from 'react';

function App() {
  const [tickerList, setTickerList] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/ticker-list')
      .then(response => response.json())
      .then(data => setTickerList(data.tickers));
  }, []);

  return (
    <div>
      <h1>Crypto Portfolio</h1>
      <ul>
        {tickerList.map(ticker => (
          <li key={ticker}>{ticker}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;