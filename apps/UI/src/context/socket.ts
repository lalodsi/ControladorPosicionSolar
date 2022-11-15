import React from "react";
import { io, Socket } from "socket.io-client";

interface ServerToClientEvents {
    ports: () => void;
    MenuArduino: () => void;
    monitorSerial: () => void;
    data: (data: unknown) => void;
    arduinoConnectionState: () => void;
    arduinoSoftwareTest: () => void;
}

interface ClientToServerEvents {
    data: (data: unknown) => void;
}

export const socket: Socket<ServerToClientEvents,ClientToServerEvents> = io();
export const socketContext = React.createContext<Socket<ServerToClientEvents,ClientToServerEvents>>(socket);