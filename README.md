# Controlador de Posicion Solar

En la Ciudad de México, los días duran aproximadamente 13 horas, además de que es allí donde la luz solar es bastante aprovechable, es debido a ello que este repositorio contiene un proyecto que controla un sistema de posicionamiento solar, es decir, un **sistema mecatrónico** que controla el movimiento de un panel fotovoltaico de modo que este siempre se encuentre mirando hacia el sol y así aprovechar mejor cada segundo de la luz solar del día.

## Contenido del repositorio

Este repositorio se divide en dos aplicaciones, las cuales son [monorepos](https://medium.com/tauon/trabajando-con-monorepos-cf941c7d57dc) compatibles uno con el otro de modo que se pueda enviar información de una aplicación a otra. Las aplicaciones son las siguientes:

- **UI**: Se trata de la interfaz de computadora que se estará conectando al hardware.
- [**Arduino**](https://github.com/lalodsi/ControladorPosicionSolar/tree/master/apps/Arduino): Es el proyecto que se encargará de controlar la parte de hardware del proyecto.