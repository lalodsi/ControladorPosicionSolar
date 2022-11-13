import * as React from 'react';

interface IControladorConexionProps {
}

const ControladorConexion: React.FunctionComponent<IControladorConexionProps> = (props) => {
  return (
    <></>
    // <section className="subsection estado" id="estadoConexion">
    //     <div>
    //         <div>Estado</div>
    //         <div className="Contenido_Estado">
    //             <div id="state" className="desconectado">Desconectado
    //             </div>
    //             <div className="menuConectar">
    //                     <p className="info">Establecer una conexión con arduino</p>
    //                     <!-- <div className="dosColumnas">
    //                         <label for="port">Puerto:</label>
    //                         <input className="port" type="text" value="COM3">
    //                     </div> -->
    //                     <div className="contenedorPuertos">
    //                         <select name="puerto" id="puertos" className="listaPuertos" aria-placeholder="">
    //                             <option value="1">Elige un puerto</option>
    //                         </select>
    //                         <button className="botonActualizar" id="botonActualizar"></button>
    //                     </div>
    //                     <button id="botonConectar" className="botonArduino conectar">Conectar</button>
    //                 </div>
    //         </div>
    //         <div className="Contenido_Estado">
    //             <div id="state" className="conectando">Conectando...</div>
    //         </div>
    //         <div className="Contenido_Estado">
    //             <div id="state" className="conectado">Conectado</div>
    //             <button id="botonDesconectar" className="botonArduino desconectar">Desconectar</button>
    //         </div>
    //     </div>
    // </section>
  );
};

export default ControladorConexion;
