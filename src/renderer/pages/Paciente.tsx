import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { 
  Container, TextField, Box, Typography, Button, MenuItem, InputAdornment 
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import { useNavigate } from 'react-router-dom';
import { 
  containerStyle, titleStyle, textStyle, buttonTertiaryStyle, buttonSecondaryStyle 
} from '../styles/globalStyles';

// Lista de doenças
const diseasesList: string[] = [
  'Cardiopatia',
  'Doença de Parkinson',
  'Esclerose Múltipla',
  'AVC (Acidente Vascular Cerebral)',
  'Doença de Alzheimer',
  'Miastenia Grave',
  'Esofagite',
  'Refluxo Gastroesofágico (DRGE)',
  'Câncer de Cabeça e Pescoço',
  'Esclerose Lateral Amiotrófica (ELA)',
  'Nenhum',
  'Outros',
];

// Lista de gêneros simplificada
const genderList: string[] = ['Masculino', 'Feminino'];

// Função para remover acentuação
const removeAccents = (text: string): string => {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

interface PatientData {
  nome: string;
  dataNascimento: string;
  doenca: string;
  doencaEspecifica?: string;
  comentarios: string;
}

const Paciente: React.FC = () => {
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState<PatientData>({
    nome: '',
    dataNascimento: '',
    doenca: '',
    comentarios: '',
  });

  const [genero, setGenero] = useState<string>('Masculino'); // Armazena o gênero, mas não o envia

  const socket = new WebSocket('ws://localhost:8080');

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPatientData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleGeneroChange = (e: ChangeEvent<HTMLInputElement>) => {
    setGenero(e.target.value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const dataToSend = {
      ...patientData,
      nome: removeAccents(patientData.nome),
      doenca: removeAccents(
        patientData.doenca === 'Outros' && patientData.doencaEspecifica 
          ? patientData.doencaEspecifica 
          : patientData.doenca
      ),
      comentarios: removeAccents(patientData.comentarios),
    };

    console.log(dataToSend);
    socket.send(JSON.stringify({ action: 'set-paciente-data', ...dataToSend }));
    navigate('/engolir_seco');
  };

  useEffect(() => {
    socket.onopen = () => console.log('Conectado ao servidor WebSocket');
    socket.onmessage = (event) => console.log('Mensagem recebida do servidor:', event.data);
    socket.onclose = () => console.log('Conexão WebSocket fechada');

    return () => socket.close();
  }, []);

  const handleBack = () => navigate(-1);

  return (
    <Container maxWidth="sm" sx={containerStyle}>
      <Box mb={4} display="flex" alignItems="center" justifyContent="center">
        <LocalHospitalIcon sx={{ fontSize: 40, color: '#FF6B6B', marginRight: '10px' }} />
        <Typography variant="h4" component="h1" sx={titleStyle}>
          Informações do Paciente
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit} mb={4}>
        <TextField
          fullWidth
          label="Nome"
          name="nome"
          value={patientData.nome}
          onChange={handleChange}
          margin="normal"
          sx={textStyle}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonIcon />
              </InputAdornment>
            ),
          }}
          required
        />

        <TextField
          fullWidth
          name="dataNascimento"
          value={patientData.dataNascimento}
          onChange={handleChange}
          margin="normal"
          sx={textStyle}
          type="date"
          required
        />

        <TextField
          fullWidth
          select
          label="Gênero"
          value={genero}
          onChange={handleGeneroChange}
          margin="normal"
          sx={textStyle}
        >
          {genderList.map((generoOption) => (
            <MenuItem key={generoOption} value={generoOption}>
              {generoOption}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          select
          label="Doenças"
          name="doenca"
          value={patientData.doenca}
          onChange={handleChange}
          margin="normal"
          sx={textStyle}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LocalHospitalIcon />
              </InputAdornment>
            ),
          }}
          required
        >
          {diseasesList.map((doenca) => (
            <MenuItem key={doenca} value={removeAccents(doenca)}>
              {doenca}
            </MenuItem>
          ))}
        </TextField>

        {patientData.doenca === 'Outros' && (
          <TextField
            fullWidth
            label="Especifique a doença"
            name="doencaEspecifica"
            value={patientData.doencaEspecifica || ''}
            onChange={handleChange}
            margin="normal"
            sx={textStyle}
            required
          />
        )}

        <TextField
          fullWidth
          label="Comentários"
          name="comentarios"
          value={patientData.comentarios}
          onChange={handleChange}
          margin="normal"
          multiline
          rows={4}
          sx={textStyle}
        />

        <Box display="flex" justifyContent="space-between" mt={3}>
          <Button
            variant="contained"
            sx={buttonTertiaryStyle}
            onClick={handleBack}
          >
            Voltar
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={buttonSecondaryStyle}
          >
            Prosseguir
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Paciente;
