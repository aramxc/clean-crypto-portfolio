import React from 'react';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
// import MenuIcon from '@mui/icons-material/Menu';

const Header: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Clean Crypto Portfolio
        </Typography>
        <IconButton
          size="large"
          edge="end"
          color="inherit"
          aria-label="menu"
        >
          {/* TODO: Fix MenuIcon import */}
          {/* <MenuIcon /> */}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;