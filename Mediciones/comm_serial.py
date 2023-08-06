import serial

# Configura el puerto serial y la velocidad de comunicación
puerto_serial = serial.Serial('COM14', baudrate=9600)  # Reemplaza 'puerto' con el nombre de tu puerto serial

# Abre el archivo de texto en modo escritura
archivo = open('datos.txt', 'w')

# Bucle infinito para leer y guardar los datos
archivo.write('ColumnaX,ColumnaZ,ColumnaY' + '\n')
while True:
    # Lee la línea de datos desde el puerto serial
    linea = puerto_serial.readline().decode().strip()
    
    # Escribe la línea en el archivo de texto
    archivo.write(linea + '\n')
    
    # Imprime la línea en la consola
    print(linea)

# Cierra el archivo y el puerto serial
archivo.close()
puerto_serial.close()