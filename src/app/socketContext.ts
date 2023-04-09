import { createContext } from 'react';
import { io, Socket } from 'socket.io-client';
export default createContext<Socket>({} as Socket);