import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Label
} from 'recharts';
import {
  Box, Container, Grid, Typography, Button, Switch
} from '@mui/material';
import { containerStyle, titleStyle, buttonTertiaryStyle, buttonSecondaryStyle } from '../styles/globalStyles';
import { useNavigate } from 'react-router-dom';

interface DataPoint {
  tempo: number;
  ax: number;
  ay: number;
  az: number;
  acao: string;
}

const MAX_DATA_POINTS = 20;

const Grafico: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<DataPoint[]>([]);
  const [realTime, setRealTime] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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
        setData((prevData) => {
          const updatedData = [...prevData, newData];
          return updatedData.length > MAX_DATA_POINTS 
            ? updatedData.slice(-MAX_DATA_POINTS) 
            : updatedData;
        });
      };
      ws.onclose = () => console.log('Conexão WebSocket fechada.');
    }

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [realTime]);

  const handleToggle = () => {
    setRealTime(!realTime);
    setData([]);
  };

  const handleDownloadCSV = async () => {
    try {
      // Solicita o conteúdo do CSV do backend do Electron
      const csvData = await window.electron.ipcRenderer.invoke('get-csv-data');
      
      // Cria um Blob com os dados CSV e gera um link para download
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);

      // Configura o link para baixar o arquivo
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'dados_sensores.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Erro ao baixar o arquivo CSV:', error);
      setError('Erro ao baixar o arquivo CSV.');
    }
  };

  const handleBack = () => navigate("/inicio"); 
  const backText = "Voltar"; 

  return (
    <Container maxWidth="md">
      <Grid container direction="column" alignItems="center" justifyContent="center">
        <Box style={{ ...containerStyle, width: '100%', textAlign: 'center' }}>
          <Typography variant="h4" style={titleStyle}>
            Gráfico em Tempo Real
          </Typography>

          <Box mt={2} mb={3}>
            <Typography variant="subtitle1">Dados em Tempo Real</Typography>
            <Switch checked={realTime} onChange={handleToggle} />
          </Box>

          {loading ? (
            <Typography variant="h6" color="textSecondary">
              Carregando dados...
            </Typography>
          ) : error ? (
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
      <Box display="flex" justifyContent="space-between" mt={4}>
        <Button
          variant="contained"
          sx={buttonTertiaryStyle}
          onClick={handleBack}
        >
          {`< ${backText}`}
        </Button>
        <Button 
          variant="contained" 
          sx={buttonSecondaryStyle}
          onClick={handleDownloadCSV}
        >
          Baixar CSV
        </Button>
      </Box>

        </Box>
        
      </Grid>
    </Container>
  );
};

export default Grafico;
