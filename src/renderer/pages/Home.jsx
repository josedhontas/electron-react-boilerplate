import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { ButtonPlay } from '../components/ButtonPlay'; 
import { containerStyle, titleStyle } from '../styles/globalStyles'; 
import monitoramento from '../assets/monitoramento.gif'; 

const Home = () => {
  return (
    <Container maxWidth="sm" sx={containerStyle}>
      <Box mb={4}>
        <Typography variant="h4" component="h1" sx={titleStyle}>
          Coleta e análise de dados biomecânicos
        </Typography>
      </Box>
      <Box mb={4}>
        <img
          src={monitoramento}
          alt={"Monitoramento"}
          style={{
            width: 150,
            height: 150,
            borderRadius: '50%',
            boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.2)',
          }}
        />
      </Box>
      <Box mb={4}>
        <Typography variant="h5" component="p" sx={titleStyle}>
          Aperte iniciar para começar
        </Typography>
      </Box>
      <ButtonPlay nextRoute="/paciente" />
    </Container>
  );
};

export default Home;
