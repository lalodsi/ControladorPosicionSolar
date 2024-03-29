import * as React from 'react';
import Button, { buttonTypes } from '../../core/button';
import "./styles.css"
import electron, { ipcRenderer } from "electron";
import { SerialPort } from 'serialport';
import { connect } from "react-redux";
import { mapArgsToTypes } from '@storybook/store';
import clsx from 'clsx';

interface IConnectionMenuProps {
  conectado?: boolean,
  esperando?: boolean,
  testing?: boolean
}

interface portType{
  friendlyName: string,
  locationId: string | undefined,
  manufacturer: string,
  path: string,
  pnpId: string,
  productId: number | undefined,
  serialNumber: number | undefined,
  vendorId: number | undefined
}

const getSerialPortList = () => {
  // @ts-ignore
  return electronAPI.getPorts()
}

const ConnectionMenu: React.FunctionComponent<IConnectionMenuProps> = (props) => {
  // Just for testing
  const {
    conectado = false,
    esperando = false,
    testing = false,
  } = props;

  const [connected, setConnected] = React.useState(conectado || false);
  const [error, setError] = React.useState(conectado || false);
  const [conectionMessage, setConectionMessage] = React.useState(conectado || false);
  const [waiting, setWaiting] = React.useState(esperando || false);
  const [ports, setPorts] = React.useState<portType[]>([]);
  const [selectedPort, setSelectedPort] = React.useState<string>("");

  const setConnection = (willConnect: boolean) => {
    const out = {
      connect: willConnect,
      port: selectedPort
    }
    setWaiting(true)
    if (!testing) {
      // @ts-ignore
      electronAPI.setConnection(out, (event) => {
        console.log(event);
      });
    }
    else{
      setWaiting(true);
      setTimeout(() => {
        setWaiting(false);
        setConnected(true);
      }, 2000)
    }
  }
  const handleConnect = () => {
    setConnection(true)
  }

  const handleDisconnect = () => {
    if (!testing) {
      setConnection(false);
    }
    else{
      setConnected(false);
    }
  }

  React.useEffect(() => {
    if (!testing) {
      setPorts(getSerialPortList());
      // @ts-ignore
      electronAPI.setConnectionListener((event, args) => {
        setWaiting(false);
        setConnected(args.isConnected);
        setError(args.error);
        setConectionMessage(args.message);
      })
    }
  }, [])

  React.useEffect(() => {
    setTimeout(() => setError(false), 1000);
  }, [error])

  const handleUpdatePorts = () => {
    if (!testing) {
      setPorts(getSerialPortList());
    }
  }

  const changeSelected = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPort(event.target.value);
  }

  const connectionMenuClasses = clsx({
    connectionMenuContainer: true,
    temblor: error
  })

  return (
    <section className={connectionMenuClasses} id="estadoConexion">
      <div>
          <div>Estado</div>
          {
            (!connected && !waiting) &&
            <div className="Contenido_Estado">
              <div id="state" className="desconectado">Desconectado</div>
              <div className="menuConectar">
                <p className="info">Establecer una conexión con arduino</p>
                <div className="contenedorPuertos">
                  <select onChange={changeSelected} name="puerto" id="puertos" className="listaPuertos" aria-placeholder="">
                      <option value="1">Elige un puerto</option>
                      {
                        ports.map( (map, i) => (
                          <option
                            key={i}
                            value={map.path}
                          >
                            {map.friendlyName}
                          </option>
                        ))
                      }
                  </select>
                  <button onClick={handleUpdatePorts} className="botonActualizar" id="botonActualizar"></button>
                </div>
                {/* <button id="botonConectar" className="botonArduino conectar">Conectar</button> */}
                <Button text='Conectar' className={buttonTypes.connectButton} handleClick={handleConnect} />
              </div>
            </div>
          }
          {
            (!connected && waiting) &&
            <div className="Contenido_Estado">
                <div id="state" className="conectando">Conectando...</div>
            </div>
          }
          {
            connected &&
            <div className="Contenido_Estado">
                <div id="state" className="conectado">Conectado</div>
                <button
                  id="botonDesconectar"
                  className="botonArduino desconectar"
                  onClick={handleDisconnect}
                  >Desconectar</button>
            </div>
          }
      </div>
    </section>
  );
};

export default ConnectionMenu;