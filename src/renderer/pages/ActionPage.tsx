import React, { useState, useEffect, useRef, FC } from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { 
  containerStyle, titleStyle, buttonPrimaryStyle, buttonSecondaryStyle, buttonTertiaryStyle 
} from '../styles/globalStyles';
import '../styles/style.css';

// Definição dos tipos das props
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

    if (!isRunning && wsRef.current) {
      wsRef.current.send(
        JSON.stringify({ action: 'start-recording', dataType: acao })
      );
    } else if (wsRef.current) {
      wsRef.current.send(JSON.stringify({ action: 'stop-recording' }));
    }
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
    if (nextRoute === '/grafico') {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ action: 'enviar-dados' }));
      } else {
        wsRef.current = new WebSocket('ws://localhost:8080');
        wsRef.current.onopen = () => {
          console.log('Conexão WebSocket aberta para /grafico');
          wsRef.current?.send(JSON.stringify({ action: 'enviar-dados' }));
        };
        wsRef.current.onclose = () => {
          console.log('Conexão WebSocket fechada após enviar dados para /grafico');
        };
        wsRef.current.onerror = (error) => {
          console.error('Erro ao conectar ao WebSocket:', error);
        };
      }
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

      <Box mb={4}>
        <Button
          variant="contained"
          sx={buttonPrimaryStyle}
          startIcon={isRunning ? <PauseIcon /> : <PlayArrowIcon />}
          onClick={handleToggle}
          disabled={timer === 0}
        >
          {isRunning ? 'Pausar' : 'Gravar'}
        </Button>
      </Box>

      <Box display="flex" justifyContent="space-between" mt={4}>
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
