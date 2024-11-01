const containerStyle = {
  textAlign: 'center',
  marginTop: '5%',
  backgroundColor: '#F0F4F8',
  padding: '25px',
  borderRadius: '30px',
  boxShadow: '0px 12px 30px rgba(0, 0, 0, 0.15)',
  border: '3px solid #E0E0E0',
};

const titleStyle = {
  fontFamily: "'Arial', sans-serif",
  color: '#2E3B4E',
  fontWeight: 'bold',
  textShadow: '1px 1px rgba(0, 0, 0, 0.1)',
};

const buttonPrimaryStyle = {
  backgroundColor: '#FF6B6B',
  color: '#FFF',
  fontSize: '1.3rem',
  fontFamily: "'Arial', sans-serif",
  borderRadius: '30px',
  boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.15)',
  padding: '12px 24px',
  transition: 'transform 0.3s ease-in-out, background-color 0.2s',
  '&:hover': {
    backgroundColor: '#FF7F7F',
    transform: 'scale(1.05)',
  },
  '&:active': {
    transform: 'scale(0.97)',
  },
};

const buttonSecondaryStyle = {
  backgroundColor: '#28A745',
  color: '#FFF',
  fontSize: '1.2rem',
  fontFamily: "'Arial', sans-serif",
  borderRadius: '30px',
  boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.15)',
  padding: '10px 20px',
  transition: 'transform 0.3s ease-in-out, background-color 0.2s',
  '&:hover': {
    backgroundColor: '#4CAF50',
    transform: 'scale(1.05)',
  },
  '&:active': {
    transform: 'scale(0.97)',
  },
};

const buttonTertiaryStyle = {
  backgroundColor: '#6C757D',
  color: '#FFF',
  fontSize: '1.1rem',
  fontFamily: "'Arial', sans-serif",
  borderRadius: '30px',
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  padding: '8px 16px',
  transition: 'transform 0.3s ease-in-out, background-color 0.2s',
  '&:hover': {
    backgroundColor: '#868E96',
    transform: 'scale(1.05)',
  },
  '&:active': {
    transform: 'scale(0.97)',
  },
};

const textStyle = {
  fontFamily: "'Arial', sans-serif",
  color: '#4F5D75',
};

const alertTextStyle = {
  fontFamily: "'Arial', sans-serif",
  color: '#F44336',
  fontWeight: 'bold',
  textShadow: '1px 1px rgba(0, 0, 0, 0.1)',
};

export {
  containerStyle,
  titleStyle,
  buttonPrimaryStyle,
  buttonSecondaryStyle,
  buttonTertiaryStyle,
  textStyle,
  alertTextStyle,
};
