import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

interface Coin {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  total_volume: number;
  price_change_percentage_24h: number;
}

interface PortfolioProps {
  coins: Coin[];
}

const Portfolio: React.FC<PortfolioProps> = ({ coins }) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="crypto portfolio">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Symbol</TableCell>
            <TableCell align="right">Price (USD)</TableCell>
            <TableCell align="right">24h Change</TableCell>
            <TableCell align="right">Market Cap</TableCell>
            <TableCell align="right">Volume</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {coins.map((coin) => (
            <TableRow key={coin.id}>
              <TableCell component="th" scope="row">{coin.name}</TableCell>
              <TableCell align="right">{coin.symbol.toUpperCase()}</TableCell>
              <TableCell align="right">${coin.current_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
              <TableCell align="right" sx={{ color: coin.price_change_percentage_24h >= 0 ? 'green' : 'red' }}>
                {coin.price_change_percentage_24h.toFixed(2)}%
              </TableCell>
              <TableCell align="right">${coin.market_cap.toLocaleString()}</TableCell>
              <TableCell align="right">${coin.total_volume.toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Portfolio;