import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Autocomplete, TextField, Link, Button } from '@mui/material';

interface Ticker {
  label: string;
  id: string;
}

const Portfolio: React.FC = () => {
  const [tickerList, setTickerList] = useState<Ticker[]>([]);
  const [selectedTickers, setSelectedTickers] = useState<Ticker[]>([]);
  const [portfolioData, setPortfolioData] = useState<any>(null);

  useEffect(() => {
    fetchTickerList();
  }, []);

  const fetchTickerList = async () => {
    try {
      const response = await fetch('http://localhost:8080/ticker-list');
      const data = await response.json();
      setTickerList(data);
    } catch (error) {
      console.error('Error fetching ticker list:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:8080/portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tickers: selectedTickers.map(ticker => ticker.id) }),
      });
      const data = await response.json();
      setPortfolioData(data);
    } catch (error) {
      console.error('Error fetching portfolio data:', error);
    }
  };

  return (
    <Container maxWidth="sm" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, width: '100%' }}>
        <Typography variant="h4">Clean Crypto Portfolio</Typography>
        <Autocomplete
          multiple
          id="ticker-select"
          options={tickerList}
          sx={{ width: '100%' }}
          renderInput={(params) => <TextField {...params} label="Select ticker symbols" />}
          onChange={(_, newValue) => setSelectedTickers(newValue)}
        />
        <Button variant="contained" onClick={handleSubmit}>Submit</Button>
        {portfolioData && (
          <Box sx={{ width: '100%', mt: 2 }}>
            <Typography variant="h6">Portfolio Data:</Typography>
            <pre>{JSON.stringify(portfolioData, null, 2)}</pre>
          </Box>
        )}
        <Typography variant="body1">
          <Link href="https://github.com/aramxc" rel="noopener noreferrer">
            Back to Aaron's Github
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default Portfolio;