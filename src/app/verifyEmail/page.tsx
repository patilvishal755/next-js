'use client';

import React, { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';

// TODO remove, this demo shouldn't need to reset the theme.
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function ProfilePage({ params }: any) {
  const route = useRouter();
  const [token, setToken] = useState('');
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);

  const getEmailVerified = async () => {
    try {
      const response = await axios.post('/api/users/verifyEmail', { token });
      setVerified(true);
    } catch (error: any) {
      setError(true);
      console.log({ error });
    }
  };

  useEffect(() => {
    const urlToken = window.location.search?.split('=')?.[1];
    setToken(urlToken);
  }, []);

  useEffect(() => {
    if (token.length > 0) {
      getEmailVerified();
    }
  }, [token]);

  return (
    <ThemeProvider theme={darkTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5"></Typography>
          <Typography component="h1" variant="h5">
            {verified && !error
              ? 'Email Verified'
              : error
              ? 'Error in Email verification'
              : 'Email Verification in progress'}
          </Typography>
          {/* <Button onClick={logoutClicked}> log out</Button> */}
        </Box>
      </Container>
    </ThemeProvider>
  );
}
