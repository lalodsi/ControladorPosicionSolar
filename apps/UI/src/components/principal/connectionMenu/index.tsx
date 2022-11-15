import * as React from 'react';
import Button, { buttonTypes } from '../../core/button';
import "./styles.css"

interface IConnectionMenuProps {
  conectado?: boolean,
  esperando?: boolean
}

const ConnectionMenu: React.FunctionComponent<IConnectionMenuProps> = (props) => {
  // Just for testing
  const {
    conectado = false,
    esperando = false
  } = props;

  const handleConnect = () => {
    console.log("Conectar al arduino");
  }

  const handleUpdate = () => {

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
