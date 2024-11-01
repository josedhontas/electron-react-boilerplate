export const containerStyle = {
  textAlign: 'center',
  marginTop: '5%',
  backgroundColor: '#F0F4F8', // Fundo mais suave
  padding: '25px',
  borderRadius: '30px', // Bordas arredondadas para um toque mais moderno
  boxShadow: '0px 12px 30px rgba(0, 0, 0, 0.15)', // Sombra mais suave e natural
  border: '3px solid #E0E0E0', // Borda cinza clara e discreta
};

export const titleStyle = {
  fontFamily: "'Arial', sans-serif", // Fonte mais profissional e legível
  color: '#2E3B4E', // Azul escuro para o título
  fontWeight: 'bold',
  textShadow: '1px 1px rgba(0, 0, 0, 0.1)', // Sombra leve para dar profundidade
};

export const buttonPrimaryStyle = {
  backgroundColor: '#FF6B6B', // Vermelho suave para o botão primário (Gravar)
  color: '#FFF',
  fontSize: '1.3rem', // Fonte grande e chamativa
  fontFamily: "'Arial', sans-serif", // Fonte mais profissional
  borderRadius: '30px', // Bordas arredondadas para um visual amigável
  boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.15)', // Sombra suave no botão
  padding: '12px 24px',
  transition: 'transform 0.3s ease-in-out, background-color 0.2s',
  '&:hover': {
    backgroundColor: '#FF7F7F', // Vermelho um pouco mais claro no hover
    transform: 'scale(1.05)', // Crescimento suave ao passar o mouse
  },
  '&:active': {
    transform: 'scale(0.97)', // Leve compressão ao clicar
  },
};

export const buttonSecondaryStyle = {
  backgroundColor: '#28A745', // Verde para o botão de "Prosseguir"
  color: '#FFF',
  fontSize: '1.2rem', // Fonte chamativa, mas menor que o primário
  fontFamily: "'Arial', sans-serif",
  borderRadius: '30px', // Bordas arredondadas para manter o estilo consistente
  boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.15)', // Sombra suave
  padding: '10px 20px',
  transition: 'transform 0.3s ease-in-out, background-color 0.2s',
  '&:hover': {
    backgroundColor: '#4CAF50', // Verde um pouco mais suave no hover
    transform: 'scale(1.05)', // Crescimento suave
  },
  '&:active': {
    transform: 'scale(0.97)', // Leve compressão
  },
};

export const buttonTertiaryStyle = {
  backgroundColor: '#6C757D', // Cinza para um botão terciário (Voltar ou Cancelar)
  color: '#FFF',
  fontSize: '1.1rem', // Fonte um pouco menor para menor destaque
  fontFamily: "'Arial', sans-serif",
  borderRadius: '30px', // Bordas arredondadas para manter o estilo consistente
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // Sombra suave
  padding: '8px 16px',
  transition: 'transform 0.3s ease-in-out, background-color 0.2s',
  '&:hover': {
    backgroundColor: '#868E96', // Cinza um pouco mais claro no hover
    transform: 'scale(1.05)', // Crescimento suave
  },
  '&:active': {
    transform: 'scale(0.97)', // Leve compressão
  },
};

export const textStyle = {
  fontFamily: "'Arial', sans-serif", // Fonte mais simples e profissional para o texto normal
  color: '#4F5D75', // Azul acinzentado suave para legibilidade
};

export const alertTextStyle = {
  fontFamily: "'Arial', sans-serif", // Fonte mais simples e legível
  color: '#F44336', // Vermelho chamativo para alertas
  fontWeight: 'bold',
  textShadow: '1px 1px rgba(0, 0, 0, 0.1)', // Sombra leve para dar profundidade
};
