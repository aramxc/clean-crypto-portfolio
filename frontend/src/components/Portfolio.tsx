import React from 'react';
import { Container, TextField, Typography, Box } from '@mui/material';

const Portfolio: React.FC = () => {
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
        <TextField 
          label="Enter ticker" 
          variant="outlined" 
          fullWidth 
        />
        
      </Box>
    </Container>
  );
};

export default Portfolio;