import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Label 
} from 'recharts';
import { 
  Box, Container, Grid, Typography, Switch, Button 
} from '@mui/material';
import { 
  containerStyle, titleStyle 
} from '../styles/globalStyles';
import { useNavigate } from 'react-router-dom';

const MAX_DATA_POINTS = 20;

// Estrutura dos dados esperados
interface DataPoint {
  tempo: number;
  ax: number;
  ay: number;
  az: number;
  acao: string;
}

const Grafico: React.FC = () => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [realTime, setRealTime] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let ws: WebSocket | undefined;
    if (realTime) {
      ws = new WebSocket('ws://localhost:8080');
      ws.onmessage = (event) => {
        const messageData = JSON.parse(event.data);
        const newData: DataPoint = {
          tempo: messageData.tempo,
          ax: messageData.ax,
          ay: messageData.ay,
          az: messageData.az,
          acao: messageData.acao,
        };

        console.log("Dados recebidos:", newData);

        setData((prevData) => {
          const updatedData = [...prevData, newData];
          return updatedData.length > MAX_DATA_POINTS 
            ? updatedData.slice(-MAX_DATA_POINTS) 
            : updatedData;
        });

        setLoading(false); // Define loading como false ao receber os dados
      };
      
      ws.onclose = () => console.log('Conexão WebSocket fechada.');
    }
    
    return () => ws && ws.close();
  }, [realTime]);

  const handleToggle = () => {
    setRealTime(!realTime);
    setData([]); // Limpa os dados ao alternar para tempo real
  };

  const goToHome = () => {
    navigate('/');
  };

  return (
    <Container maxWidth="md">
      <Grid container direction="column" alignItems="center" justifyContent="center">
        <Box style={{ ...containerStyle, width: '100%', textAlign: 'center' }}>
          <Typography variant="h4" style={titleStyle}>
            Gráfico em Tempo Real
          </Typography>

          <Button 
            variant="contained" 
            onClick={goToHome} 
            style={{ marginTop: '20px', marginBottom: '20px' }}
          >
            Voltar para o Início
          </Button>

          <Box mt={2} mb={3}>
            <Typography variant="subtitle1">Dados em Tempo Real</Typography>
            <Switch checked={realTime} onChange={handleToggle} />
          </Box>

          {error ? (
            <Typography variant="h6" color="error">
              {error}
            </Typography>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="tempo" interval={5} style={{ fontSize: '16px', fill: '#333' }}>
                  <Label value="Tempo (ms)" offset={-5} position="insideBottom" style={{ fontSize: '16px', fill: '#333' }} />
                </XAxis>
                <YAxis style={{ fontSize: '16px', fill: '#333' }}>
                  <Label value="Aceleração (m/s²)" angle={-90} position="insideLeft" style={{ fontSize: '18px', fill: '#333' }} />
                </YAxis>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '18px', fill: '#333' }} />
                <Line type="monotone" dataKey="ax" stroke="#FF6B6B" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="ay" stroke="#28A745" />
                <Line type="monotone" dataKey="az" stroke="#008B8B" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Box>
      </Grid>
    </Container>
  );
};

export default Grafico;
