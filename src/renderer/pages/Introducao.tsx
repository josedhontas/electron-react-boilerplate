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
    <Container 
      maxWidth="md" 
      sx={{
        ...containerStyle,
        backgroundColor: '#f4f6f8',
        borderRadius: '15px',
        padding: '2rem',
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)'
      }}
    >
      {/* Título da página */}
      <Box mb={4} textAlign="center">
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            ...titleStyle, 
            fontWeight: 'bold', 
            color: '#333' 
          }}
        >
          Apresentação do Programa
        </Typography>
      </Box>
      
      {/* Descrição do Projeto */}
      <Box mb={4} textAlign="center">
        <Typography 
          variant="h6" 
          component="p" 
          sx={{ 
            ...textStyle, 
            color: '#555'
          }}
        >
          Este programa visa a coleta e análise de dados biomecânicos, desenvolvido com a colaboração de várias instituições de renome.
        </Typography>
      </Box>
      
      {/* Seção de Logos */}
      <Box mb={4}>
        <Typography 
          variant="h5" 
          component="h2" 
          sx={{ 
            ...titleStyle, 
            color: '#333', 
            textAlign: 'center',
            marginBottom: '1.5rem'
          }}
        >
          Instituições Envolvidas
        </Typography>
        <Grid container spacing={3} justifyContent="center" alignItems="center">
          {/* Logo da UFS */}
          <Grid item xs={12} sm={4} display="flex" justifyContent="center">
            <img
              src={ufsLogo}
              alt="Logo da UFS"
              style={{ width: 120, height: 'auto', borderRadius: '10px' }}
            />
          </Grid>

          {/* Logo da Erbserh */}
          <Grid item xs={12} sm={4} display="flex" justifyContent="center">
            <img
              src={erbserhLogo}
              alt="Logo da Erbserh"
              style={{ width: 200, height: 'auto', borderRadius: '10px' }}
            />
          </Grid>

          {/* Logo do LPM */}
          <Grid item xs={12} sm={4} display="flex" justifyContent="center">
            <img
              src={lpmLogo}
              alt="Logo do LPM"
              style={{ width: 120, height: 'auto', borderRadius: '10px' }}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Equipe Envolvida */}
      <Box mb={4}>
        <Typography 
          variant="h5" 
          component="h2" 
          sx={{ 
            ...titleStyle, 
            color: '#333', 
            textAlign: 'center', 
            marginBottom: '1rem' 
          }}
        >
          Equipe Envolvida
        </Typography>
        <Typography 
          variant="body1" 
          component="p" 
          sx={{ 
            ...textStyle, 
            color: '#555', 
            textAlign: 'center'
          }}
        >
          - Discente José Dhonatas Alves Sales (UFS)<br />
          - Fonoaudióloga Dra. Isabel Cristina Sabatini Perez Ramos (EBSERH)<br />
          - Dr. Alexandre Carlos Rodrigues Ramos (UFS)
        </Typography>
      </Box>

      {/* Botão Iniciar */}
      <Box mt={4} display="flex" justifyContent="center">
        <ButtonPlay nextRoute="/inicio"/>
      </Box>
    </Container>
  );
};

export default Introducao;
