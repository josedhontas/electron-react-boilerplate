import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(<App />);

// Verifica se 'window.electron' e 'window.electron.ipcRenderer' estão disponíveis antes de chamar
if (window.electron && window.electron.ipcRenderer) {
  // calling IPC exposed from preload script
  window.electron.ipcRenderer.once('ipc-example', (arg) => {
    console.log(arg);
  });

  window.electron.ipcRenderer.sendMessage('ipc-example', ['ping']);
} else {
  console.warn("ipcRenderer não está disponível. Certifique-se de estar no ambiente do Electron.");
}
