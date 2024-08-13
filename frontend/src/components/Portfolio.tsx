import React from 'react';
import { Container, TextField, Typography, Box, Link } from '@mui/material';

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