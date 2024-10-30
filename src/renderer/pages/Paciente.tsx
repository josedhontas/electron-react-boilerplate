import React, { useState, ChangeEvent, FormEvent } from 'react';
import { 
  Container, TextField, Box, Typography, Button, MenuItem, InputAdornment 
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CommentIcon from '@mui/icons-material/Comment';
import { useNavigate } from 'react-router-dom';
import { 
  containerStyle, titleStyle, textStyle, buttonPrimaryStyle 
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
  'Outros',
];

// Interface para os dados do paciente
interface PatientData {
  name: string;
  age: string;
  disease: string;
  comments: string;
}

const Paciente: React.FC = () => {
  const navigate = useNavigate();

  // Estado para armazenar os dados do paciente
  const [patientData, setPatientData] = useState<PatientData>({
    name: '',
    age: '',
    disease: '',
    comments: '',
  });

  // Manipulador de eventos para alterar os valores dos campos de texto
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPatientData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Manipulador de envio do formulário
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log(patientData); // Lógica para enviar os dados do paciente
  };

  // Navega para a rota /inicio
  const handleStart = () => {
    navigate('/inicio');
  };

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
          name="name"
          value={patientData.name}
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
          label="Idade"
          name="age"
          value={patientData.age}
          onChange={handleChange}
          margin="normal"
          sx={textStyle}
          type="number"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CalendarTodayIcon />
              </InputAdornment>
            ),
          }}
          required
        />

        <TextField
          fullWidth
          select
          label="Doenças"
          name="disease"
          value={patientData.disease}
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
          {diseasesList.map((disease) => (
            <MenuItem key={disease} value={disease}>
              {disease}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          label="Comentários"
          name="comments"
          value={patientData.comments}
          onChange={handleChange}
          margin="normal"
          multiline
          rows={4}
          sx={textStyle}
        />

        <Box mt={3}>
          <Button
            type="submit"
            fullWidth
            sx={buttonPrimaryStyle}
            onClick={handleStart}
          >
            Enviar
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Paciente;
