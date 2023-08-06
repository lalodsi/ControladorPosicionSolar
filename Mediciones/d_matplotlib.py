import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
import datetime

# Carga los datos desde el archivo txt
data = pd.read_csv('datos.txt')

# Obtén las columnas de datos
x = data['ColumnaY'].to_numpy()
y = data['ColumnaX'].to_numpy()

# Crea la gráfica
plt.plot(x, y)
plt.xlabel('Escala de 1 cada 5 segundos')
plt.ylabel('Amperes')
plt.title('Recolección de energía a lo largo del día')

fecha_hora_actual = datetime.datetime.now()
fecha_hora_texto = fecha_hora_actual.strftime("%d-%m-%Y-%H.%M")
print(fecha_hora_texto)

# Guarda la gráfica como una imagen en formato JPG
plt.savefig(f'grafica{fecha_hora_texto}.jpg', format='jpg')

# Muestra la gráfica
plt.show()