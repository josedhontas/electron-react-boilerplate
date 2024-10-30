// src/components/ButtonPlay.tsx
import React from 'react';
import { Button } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useNavigate } from 'react-router-dom';
import { buttonSecondaryStyle } from '../styles/globalStyles';

// Define a interface para as props do componente
interface ButtonPlayProps {
  nextRoute: string;
}

export const ButtonPlay: React.FC<ButtonPlayProps> = ({ nextRoute }) => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate(nextRoute); // Navega para a rota recebida
  };

  return (
    <Button
      variant="contained"
      startIcon={<PlayArrowIcon />}
      onClick={handleStart}
      sx={buttonSecondaryStyle}
    >
      Iniciar
    </Button>
  );
};
