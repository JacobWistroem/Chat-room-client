import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';
import SocketContext from './app/socketContext';
import { io, Socket } from 'socket.io-client';
import './index.css';
import { ThemeProvider } from '@mui/material/styles';
import theme from './style/theme';

const socket: Socket = io('localhost:3000');

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <SocketContext.Provider value={socket}>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </Provider>
    </SocketContext.Provider>
  </React.StrictMode>
);