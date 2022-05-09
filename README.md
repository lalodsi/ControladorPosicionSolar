# Interfaz para el control de un seguidor solar

Se trata de una interfaz web con nodejs y express en el servidor que establece una conexión serial con arduino

<p>
  <img src="https://raw.githubusercontent.com/devicons/devicon/c7d326b6009e60442abc35fa45706d6f30ee4c8e/icons/nodejs/nodejs-original.svg" alt="NodeJS" height=30/>
  <img src="https://raw.githubusercontent.com/devicons/devicon/c7d326b6009e60442abc35fa45706d6f30ee4c8e/icons/npm/npm-original-wordmark.svg" alt="npm" height=30/>
  <img src="https://raw.githubusercontent.com/devicons/devicon/c7d326b6009e60442abc35fa45706d6f30ee4c8e/icons/css3/css3-original.svg" alt="CSS3" height=30/>
  <img src="https://raw.githubusercontent.com/devicons/devicon/c7d326b6009e60442abc35fa45706d6f30ee4c8e/icons/git/git-original.svg" alt="Git" height=30/>
  <img src="https://raw.githubusercontent.com/devicons/devicon/c7d326b6009e60442abc35fa45706d6f30ee4c8e/icons/html5/html5-original.svg" alt="HTML5" height=30/>
  <img src="https://raw.githubusercontent.com/devicons/devicon/c7d326b6009e60442abc35fa45706d6f30ee4c8e/icons/javascript/javascript-plain.svg" alt="JavaScript" height=30/>
</p>

## Menú de conexión con arduino

Sirve para establecer una conexión con arduino a través del puerto serial. Su interacción con el servidor sirve para que este realice la conexión y comunique el estado con la interfaz.
En caso de errores o fallo de interconexión se mostrará un mensaje en terminal.

![Imagen1](https://github.com/lalodsi/tesis/blob/master/description/estado1.PNG)

Mientras se establezca la conexión se mostrará el siguiente mensaje

![Imagen2](https://github.com/lalodsi/tesis/blob/master/description/estado2.PNG)

Si la conexión ha sido exitosa se mostrará el siguiente estado

![Imagen3](https://github.com/lalodsi/tesis/blob/master/description/estado3.PNG)

## Menú de interacción con la interfaz

Sirve para navegar entre las diferentes secciones de la interfaz.
Los botones de color gris navegarán en las diferentes secciones para poder interactuar con los diferentes botones de la interfaz.
El boton "comenzar monitoreo" se activará sólo cuando se haya establecido una conexión con el arduino de manera exitosa y sirve para activar el envío contínuo de información.

![Imagen4](https://github.com/lalodsi/tesis/blob/master/description/menu.PNG)

## Interfaz

### Sección de Información Principal

Sirve para mostrar la información de monitoreo por parte del arduino, esta sección servirá sólo cuando se haya establecido la conexión con el arduino y se haya activado el modo de monitoreo

![Imagen5](https://github.com/lalodsi/tesis/blob/master/description/principal1.PNG)

### Sección de Gráficas

Utilizando la librería [Plotly](https://plotly.com/javascript/3d-charts/) se muestra una gráfica utilizando la información proveniente del arduino en tiempo real.
Esta sección sólo funciona cuanco esta activado el monitoreo y tendrá la siguiente apariencia:

![Imagen6](https://github.com/lalodsi/tesis/blob/master/description/principal2.PNG)

### Sección de Control y calibrar sistema

Estas secciones servirán para actualizar la información interna del arduino como fecha, hora, posición y orientación.
A través de web sockets se enviará la información al servidor, el cual será quien haga la interacción con arduino.

![Imagen7](https://github.com/lalodsi/tesis/blob/master/description/principal3.PNG)
