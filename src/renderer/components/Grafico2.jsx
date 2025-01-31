import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Label
} from 'recharts';
import {
  Box, Container, Grid, Typography, Button, Switch
} from '@mui/material';
import { containerStyle, titleStyle, buttonPrimaryStyle, buttonSecondaryStyle } from '../styles/globalStyles';
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
  const [ws, setWs] = useState<WebSocket | undefined>(undefined);

  useEffect(() => {
    // Sempre que o realTime mudar, podemos reiniciar a conexão WebSocket se necessário.
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [ws]);

  const handleToggle = () => {
    setRealTime(!realTime);
    setData([]);
  };

  const handleDownloadCSV = async () => {
    try {
      const csvData = await window.electron.ipcRenderer.invoke('get-csv-data');
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
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

  const handleBack = () => navigate("/"); 
  const backText = "Voltar"; 

  const handleSendMessage = () => {
    if (!ws) {
      // Cria o WebSocket se não estiver aberto
      const newWs = new WebSocket('ws://localhost:8080');
      setWs(newWs);

      newWs.onopen = () => {
        console.log('WebSocket aberto');
        // Envia a mensagem "enviar-dados" após o WebSocket ser aberto
        newWs.send(JSON.stringify({ action: 'enviar-dados' }));
        console.log('Mensagem "enviar-dados" enviada');
        
        // Fecha a conexão WebSocket após o envio
        newWs.close();
        console.log('Conexão WebSocket fechada após envio');
      };

      newWs.onmessage = (event) => {
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

      newWs.onerror = () => {
        console.error('Erro na conexão WebSocket.');
        setError('Erro ao conectar com o WebSocket.');
      };

      newWs.onclose = () => {
        console.log('Conexão WebSocket fechada.');
      };
    } else {
      // Se já houver um WebSocket aberto, envia a mensagem diretamente
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ action: 'enviar-dados' }));
        console.log('Mensagem "enviar-dados" enviada');
        
        // Fecha a conexão WebSocket após o envio
        ws.close();
        console.log('Conexão WebSocket fechada após envio');
      } else {
        console.error('WebSocket não está aberto');
        setError('Erro: WebSocket não está aberto.');
      }
    }
  };

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
              sx={buttonPrimaryStyle}
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
            <Button
              variant="contained"
              sx={buttonSecondaryStyle}
              onClick={handleSendMessage}
            >
              Enviar Dados
            </Button>
          </Box>
        </Box>
      </Grid>
    </Container>
  );
};

export default Grafico;
