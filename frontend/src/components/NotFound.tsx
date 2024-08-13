import React from 'react';
import { Container, Typography, Button, Link } from '@mui/material';

const NotFound: React.FC = () => {
  return (
    <Container maxWidth="sm" style={{ textAlign: 'center', marginTop: '50px' }}>
      <Typography variant="h4" gutterBottom>
        404 - Not Found
      </Typography>
      <Typography variant="body1" gutterBottom>
        The page you're looking for doesn't exist.
      </Typography>
      <Link href="https://github.com/aramxc" target="_blank" rel="noopener noreferrer">
        Back to Aaron's Github
      </Link>
    </Container>
  );
};

export default NotFound;