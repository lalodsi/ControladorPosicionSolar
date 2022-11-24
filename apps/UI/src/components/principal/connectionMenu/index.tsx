import * as React from 'react';
import Button, { buttonTypes } from '../../core/button';
import "./styles.css"
import electron from "electron"
import { SerialPort } from 'serialport';
import { SerialPortMockOpenOptions } from 'serialport/dist/serialport-mock';

interface IConnectionMenuProps {
  conectado?: boolean,
  esperando?: boolean
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
    esperando = false
  } = props;

  const [ports, setPorts] = React.useState<portType[]>(
    []
  );

  const handleConnect = () => {
    console.log("Conectar al arduino");
  }

  const handleUpdate = () => {
    setPorts(getSerialPortList());
    console.log(ports);
  }

  return (
    <section className="subsection estado" id="estadoConexion">
      <div>
          <div>Estado</div>
          {
            (!conectado && !esperando) &&
            <div className="Contenido_Estado">
              <div id="state" className="desconectado">Desconectado</div>
              <div className="menuConectar">
                <p className="info">Establecer una conexión con arduino</p>
                <div className="contenedorPuertos">
                  <select name="puerto" id="puertos" className="listaPuertos" aria-placeholder="">
                      <option value="1">Elige un puerto</option>
                      {
                        ports.map( (map, i) => (
                          <option key={i} value={map.path}>{map.friendlyName}</option>
                        ))
                      }
                  </select>
                  <button onClick={handleUpdate} className="botonActualizar" id="botonActualizar"></button>
                </div>
                {/* <button id="botonConectar" className="botonArduino conectar">Conectar</button> */}
                <Button text='Conectar' className={buttonTypes.connectButton} handleClick={handleConnect} />
              </div>
            </div>
          }
          {
            (!conectado && esperando) &&
            <div className="Contenido_Estado">
                <div id="state" className="conectando">Conectando...</div>
            </div>
          }
          {
            conectado &&
            <div className="Contenido_Estado">
                <div id="state" className="conectado">Conectado</div>
                <button id="botonDesconectar" className="botonArduino desconectar">Desconectar</button>
            </div>
          }
      </div>
    </section>
  );
};



export default ConnectionMenu;