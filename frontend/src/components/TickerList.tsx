import React from 'react';
import { Autocomplete, TextField, Chip } from '@mui/material';

interface TickerInfo {
  id: string;
  symbol: string;
}

interface TickerListProps {
  tickers: TickerInfo[];
  selectedTickers: string[];
  onSelectionChange: (newSelection: string[]) => void;
  getOptionLabel: (option: TickerInfo) => string;
}

const TickerList: React.FC<TickerListProps> = ({ tickers, selectedTickers, onSelectionChange, getOptionLabel }) => {
  return (
    <Autocomplete
      multiple
      id="ticker-select"
      options={tickers}
      getOptionLabel={getOptionLabel}
      value={tickers.filter(ticker => selectedTickers.includes(ticker.id))}
      onChange={(event, newValue) => {
        onSelectionChange(newValue.map(v => v.id));
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          label="Select Tickers"
          placeholder="Tickers"
        />
      )}
      renderTags={(value: TickerInfo[], getTagProps) =>
        value.map((option: TickerInfo, index: number) => (
          <Chip
            variant="outlined"
            label={option.symbol}
            {...getTagProps({ index })}
            key={option.id}
          />
        ))
      }
      sx={{ width: 300 }}
    />
  );
};

export default TickerList;