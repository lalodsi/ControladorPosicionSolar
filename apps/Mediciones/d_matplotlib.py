import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
import datetime

# Carga los datos desde el archivo txt
data = pd.read_csv('datos18Julio.txt')

# Obtén las columnas de datos
x = data['ColumnaY'].to_numpy()
y = data['ColumnaX'].to_numpy()


# for number in y:
#     date_now = datetime.datetime(2023, 8, 18, 15, 0, 0);

#     timeNow = np.datetime64(date_now.strftime("%Y-%m-%d"))
#     x_time.append(timeNow)

# print(x_time)

fecha_hora_actual = datetime.datetime.now()
print(fecha_hora_actual.microsecond)
fecha_hora_texto = fecha_hora_actual.strftime("%B %dth, %Y %H:%M")
print(fecha_hora_texto)

# Crea la gráfica
plt.plot(x, y)
# plt.plot_date(x,y)
plt.xlabel('Escala de 1 cada 5 segundos')
plt.ylabel('Amperes')
plt.title(f"data from {fecha_hora_texto}")


# Guarda la gráfica como una imagen en formato JPG
# plt.savefig(f'grafica{fecha_hora_texto}.jpg', format='jpg')

# Muestra la gráfica
plt.show()