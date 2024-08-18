import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Autocomplete, TextField, Link } from '@mui/material';

const Portfolio: React.FC = () => {
  const [tickerList, setTickerList] = useState<{ label: string; id: number }[]>([]);

  useEffect(() => {
    // Fetch ticker list from the API
    const fetchTickerList = async () => {
      try {
        const response = await fetch('/ticker-list');
        const data = await response.json();
        setTickerList(data);
      } catch (error) {
        console.error('Error fetching ticker list:', error);
      }
    };

    fetchTickerList();
  }, []);

  return (
    <Container
      maxWidth="xs"
      style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2
        }}
      >
        <Typography variant="h4">Clean Crypto Portfolio</Typography>
        <Autocomplete
          disablePortal
          id="suggested-input"
          options={tickerList}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="Enter a ticker symbol" />}
        />
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