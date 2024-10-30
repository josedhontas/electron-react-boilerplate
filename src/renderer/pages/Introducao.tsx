// src/pages/Introducao.jsx
import React from 'react';
import { Container, Typography, Box, Grid } from '@mui/material';
import { ButtonPlay } from '../components/ButtonPlay'; 
import { containerStyle, titleStyle, textStyle } from '../styles/globalStyles'; 
import erbserhLogo from '../assets/logo/erbserh.png'; 
import ufsLogo from '../assets/logo/ufs.png'; 
import lpmLogo from '../assets/logo/lpm.png'; 

const Introducao = () => {
  return (
    <Container maxWidth="md" sx={containerStyle}>
      {/* Título da página */}
      <Box mb={4}>
        <Typography variant="h4" component="h1" sx={titleStyle}>
          Apresentação do Programa
        </Typography>
      </Box>
      
      {/* Descrição do Projeto */}
      <Box mb={4}>
        <Typography variant="h6" component="p" sx={textStyle}>
          Este programa visa a coleta e análise de dados biomecânicos, desenvolvido com a colaboração de várias instituições de renome.
        </Typography>
      </Box>
      
      {/* Seção de Logos */}
      <Box mb={4}>
        <Typography variant="h5" component="h2" sx={titleStyle} mb={3}>
          Instituições Envolvidas
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          {/* Logo da Erbserh */}
          <Grid item xs={12} sm={4} display="flex" justifyContent="center">
          <img
              src={ufsLogo}
              alt="Logo da UFS"
              style={{ width: 150, height: 'auto', borderRadius: '10px' }}
            />
          </Grid>

          <Grid item xs={12} sm={4} display="flex" justifyContent="center">

          <img
              src={erbserhLogo}
              alt="Logo da Erbserh"
              style={{ width: 300, height: 'auto', borderRadius: '10px' }}
            />

          </Grid>

          {/* Logo do LPM */}
          <Grid item xs={12} sm={4} display="flex" justifyContent="center">
            <img
              src={lpmLogo}
              alt="Logo do LPM"
              style={{ width: 150, height: 'auto', borderRadius: '10px' }}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Equipe Envolvida */}
      <Box mb={4}>
        <Typography variant="h5" component="h2" sx={titleStyle} mb={2}>
          Equipe Envolvida
        </Typography>
        <Typography variant="body1" component="p" sx={textStyle}>
          - Discente José Dhonatas Alves Sales (UFS)<br />
          - Fonoaudióloga Dra. Isabel Cristina Sabatini Perez Ramos (EBSERH)<br />
          - Dr. Alexandre Carlos Rodrigues Ramos (UFS)<br />
        </Typography>
      </Box>

      <Box mt={4} display="flex" justifyContent="center">
        <ButtonPlay nextRoute="/paciente"/>
      </Box>
    </Container>
  );
};

export default Introducao;
