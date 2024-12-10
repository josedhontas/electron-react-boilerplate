import React, { useState, useEffect, useRef, FC } from 'react';
import { Container, Box, Typography, Button, IconButton, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import ReplayIcon from '@mui/icons-material/Replay';
import {
  containerStyle,
  titleStyle,
  buttonPrimaryStyle,
  buttonSecondaryStyle,
  buttonTertiaryStyle,
} from '../styles/globalStyles';
import '../styles/style.css';

interface ActionPageProps {
  title: string;
  acao: string;
  imageUrl: string;
  imageAlt: string;
  initialTimer?: number;
  backRoute?: string;
  nextRoute?: string;
  backText?: string;
  nextText?: string;
}

const ActionPage: FC<ActionPageProps> = ({
  title,
  acao,
  imageUrl,
  imageAlt,
  initialTimer = 60,
  backRoute = '/',
  nextRoute = '/next-page',
  backText = 'Voltar',
  nextText = 'Prosseguir',
}) => {
  const navigate = useNavigate();
  const [timer, setTimer] = useState<number>(initialTimer);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState<boolean>(false);
  const [isAnimatingIn, setIsAnimatingIn] = useState<boolean>(true);
  const wsRef = useRef<WebSocket | null>(null);

  const handleToggle = () => {
    setIsRunning((prev) => !prev);
    wsRef.current?.send(
      JSON.stringify({ action: isRunning ? 'stop-recording' : 'start-recording', dataType: acao })
    );
  };

  const handleReset = () => {
    setTimer(initialTimer);
    setIsRunning(false);
    wsRef.current?.send(JSON.stringify({ action: 'delete-last-record' }));
  };

  useEffect(() => {
    wsRef.current = new WebSocket('ws://localhost:8080');

    wsRef.current.onopen = () => {
      console.log('Conexão WebSocket aberta');
    };

    wsRef.current.onclose = () => {
      console.log('Conexão WebSocket fechada');
    };

    wsRef.current.onerror = (error) => {
      console.error('Erro na conexão WebSocket:', error);
    };

    return () => {
      wsRef.current?.readyState === WebSocket.OPEN && wsRef.current.close();
    };
  }, []);

  useEffect(() => {
    const fadeInTimeout = setTimeout(() => setIsAnimatingIn(false), 300);
    return () => clearTimeout(fadeInTimeout);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (isRunning && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0 && wsRef.current) {
      wsRef.current.send(JSON.stringify({ action: 'stop-recording' }));
      setIsRunning(false);
    }

    return () => clearInterval(interval);
  }, [isRunning, timer]);

  const handleBack = () => navigate(backRoute);

  const handleNext = () => {
    if (nextRoute === '/grafico' && wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ action: 'enviar-dados' }));
    }
    setIsAnimatingOut(true);
    setTimeout(() => navigate(nextRoute), 300);
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        ...containerStyle,
        opacity: isAnimatingIn || isAnimatingOut ? 0 : 1,
        transform: isAnimatingIn ? 'scale(0.8)' : 'scale(1)',
        transition: 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out',
      }}
    >
      <Box mb={4}>
        <Typography variant="h4" component="p" sx={titleStyle}>
          {title}
        </Typography>
      </Box>

      <Box mb={4}>
        <img
          src={imageUrl}
          alt={imageAlt}
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
          {timer > 0 ? `Tempo restante: ${timer} segundos` : 'Gravado com sucesso!'}
        </Typography>
      </Box>

      <Box display="flex" justifyContent="center" mb={4}>
        <Button
          variant="contained"
          sx={buttonPrimaryStyle}
          startIcon={isRunning ? <PauseIcon /> : <PlayArrowIcon />}
          onClick={handleToggle}
        >
          {isRunning ? 'Pausar' : 'Gravar'}
        </Button>
      </Box>

      <Box display="flex" justifyContent="center" mb={4}>
        <Tooltip title="Reiniciar">
          <IconButton color="primary" onClick={handleReset} disabled={isRunning}>
            <ReplayIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Box display="flex" justifyContent="space-between">
        <Button
          variant="contained"
          sx={buttonTertiaryStyle}
          onClick={handleBack}
          disabled={isRunning}
        >
          {`< ${backText}`}
        </Button>
        <Button
          variant="contained"
          sx={buttonSecondaryStyle}
          onClick={handleNext}
          disabled={isRunning}
        >
          {`${nextText} >`}
        </Button>
      </Box>
    </Container>
  );
};

export default ActionPage;
