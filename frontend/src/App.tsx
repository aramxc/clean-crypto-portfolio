import React, { useEffect, useState, useCallback } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Button, Box, Typography, Container, CssBaseline } from '@mui/material';
import TickerList from './components/TickerList';
import Portfolio from './components/Portfolio';
import Header from './components/Header';

const CACHE_KEY = 'tickerListCache';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

interface TickerInfo {
  id: string;
  symbol: string;
}

interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number | null;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: null | {
    times: number;
    currency: string;
    percentage: number;
  };
  last_updated: string;
}

function App() {
  const [tickers, setTickers] = useState<TickerInfo[]>([]);
  const [selectedTickers, setSelectedTickers] = useState<string[]>([]);
  const [portfolioData, setPortfolioData] = useState<Coin[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (route: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8080/api${route}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred');
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getCachedData = () => {
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (cachedData) {
      const { data, timestamp } = JSON.parse(cachedData);
      if (Date.now() - timestamp < CACHE_EXPIRY) {
        return data;
      }
    }
    return null;
  };

  const setCachedData = (data: TickerInfo[]) => {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  };

  useEffect(() => {
    const fetchTickers = async () => {
      const cachedTickers = getCachedData();
      if (cachedTickers) {
        setTickers(cachedTickers);
        return;
      }

      const data = await fetchData('/tickers');
      if (data) {
        const tickerInfo: TickerInfo[] = data.map((coin: Coin) => ({
          id: coin.id,
          symbol: coin.symbol.toUpperCase(),
        }));
        tickerInfo.sort((a, b) => a.symbol.localeCompare(b.symbol));
        setTickers(tickerInfo);
        setCachedData(tickerInfo);
      }
    };
    fetchTickers();
  }, [fetchData]);

  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (selectedTickers.length === 0) {
      alert('Please select at least one ticker');
      return;
    }
    
    const relevantTickers = tickers.filter(ticker => selectedTickers.includes(ticker.symbol));
    const ids = relevantTickers.map(ticker => ticker.id).join(',');
    
    const data = await fetchData(`/portfolio?ids=${ids}`);
    
    if (data && Array.isArray(data)) {
      const filteredData = data.filter((coin: Coin) => 
        selectedTickers.includes(coin.symbol.toUpperCase())
      );
      setPortfolioData(filteredData);
    } else {
      setError('Failed to fetch portfolio data');
    }
  }, [fetchData, selectedTickers, tickers]);

  const handleReset = useCallback(() => {
    setSelectedTickers([]);
    setPortfolioData([]);
    setError(null);
  }, []);

  const theme = createTheme();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <Container component="main" sx={{ mt: 4, mb: 4, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <TickerList
              tickers={tickers}
              selectedTickers={selectedTickers}
              onSelectionChange={setSelectedTickers}
              getOptionLabel={(option: TickerInfo) => option.symbol}
            />
            <Box sx={{ mt: 2, mb: 2, display: 'flex', gap: 2 }}>
              <Button 
                type="submit"
                variant="contained" 
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Submit'}
              </Button>
              <Button 
                type="button"
                variant="outlined" 
                onClick={handleReset}
                disabled={isLoading}
              >
                Reset
              </Button>
            </Box>
          </form>
          {error && <Typography color="error">{error}</Typography>}
          {portfolioData.length > 0 && <Portfolio coins={portfolioData} />}
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;