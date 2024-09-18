import React, { useEffect, useState } from 'react';
import { Button, Box, Typography } from '@mui/material';
import TickerList from './components/TickerList';

interface Coin {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
}

interface TickerInfo {
  symbol: string;
  id: string;
}

function App() {
  const [tickers, setTickers] = useState<TickerInfo[]>([]);
  const [selectedTickers, setSelectedTickers] = useState<string[]>([]);
  const [tickerData, setTickerData] = useState<Coin[]>([]);

  useEffect(() => {
    fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false')
      .then(response => response.json())
      .then(data => {
        const tickerInfo: TickerInfo[] = data.map((coin: Coin) => ({
          id: coin.id,
          symbol: coin.symbol.toUpperCase(),
        }));
        // Sort the tickerInfo array alphabetically by symbol
        tickerInfo.sort((a, b) => a.symbol.localeCompare(b.symbol));
        setTickers(tickerInfo);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  function handleSubmit(event: React.MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();
    if (selectedTickers.length === 0) {
      alert('Please select at least one ticker');
      return;
    }
    const ids = tickers
      .filter(ticker => selectedTickers.includes(ticker.symbol))
      .map(ticker => ticker.id)
      .join(',');
    fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&per_page=100&page=1&sparkline=false`)
      .then(response => response.json())
      .then(data => setTickerData(data))
      .catch(error => console.error('Error fetching data:', error));
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Clean Crypto Portfolio
      </Typography>
      <TickerList
        tickers={tickers}
        selectedTickers={selectedTickers}
        onSelectionChange={setSelectedTickers}
        getOptionLabel={(option: TickerInfo) => option.symbol}
      />
      <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>
        Submit
      </Button>
      {tickerData.map(coin => (
        <Typography key={coin.id} sx={{ mt: 1 }}>
          {coin.name}: ${coin.current_price}
        </Typography>
      ))}
    </Box>
  );
}

export default App;