# Task Planner IA

## Descripción general

Task Planner IA es una aplicación web para la gestión de tareas con vista de lista y calendario, priorización visual tipo semáforo y edición rápida. El proyecto está dividido en dos partes: un backend simple en Node.js/Express y un frontend en HTML, CSS y JavaScript puro.

---

## Instalación y ejecución

### Requisitos

- Node.js (v14 o superior)
- Navegador web moderno

### Pasos para correr la aplicación

1. **Clona el repositorio**
   ```bash
   git clone <url-del-repo>
   cd tp_ia
   ```

2. **Inicia el backend**
   ```bash
   cd backend
   node server.js
   ```

3. **Abre el frontend**
   En otra terminal:
   ```bash
   cd frontend
   ```
   Abre `index.html` en tu navegador (puedes hacer doble clic o usar una extensión de servidor local si prefieres).

---

## Uso de la aplicación

- **Agregar tareas:** Completa el formulario y presiona "Add Task".
- **Editar tareas:** Mantén presionado una tarea por 2 segundos para editarla. Aparecen los botones "Accept Changes" (rojo) y "Revert".
- **Vista calendario:** Haz clic en el ícono 📅 para ver las tareas distribuidas por fecha y prioridad.
- **Prioridad visual:** Cada tarea y cada día en el calendario muestran círculos de color según la prioridad (rojo: High, amarillo: Medium, verde: Low).
- **Tooltips:** Al pasar el mouse sobre los círculos del calendario, se muestran los títulos de las tareas pendientes de esa prioridad.

---

## Proceso de creación con GitHub Copilot

Este proyecto fue desarrollado aprovechando las sugerencias y autocompletados de GitHub Copilot.
A continuación, se detallan ejemplos concretos de cómo Copilot asistió durante el desarrollo:

### Ejemplo 1: Generación de código repetitivo

Al crear la función para renderizar las tareas en el frontend, Copilot sugirió automáticamente la estructura del bucle para recorrer las tareas y generar los elementos HTML correspondientes, ahorrando tiempo y evitando errores de sintaxis.

```javascript
tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = 'task-item';
    // ...
});
```

### Ejemplo 2: Implementación de la lógica de edición

Para la funcionalidad de "mantener presionado para editar", Copilot propuso el uso de eventos `mousedown` y `setTimeout`, facilitando la implementación del "long press" sin necesidad de buscar ejemplos externos.

```javascript
li.addEventListener('mousedown', (e) => {
    pressTimer = setTimeout(() => {
        fillFormForEdit(task);
    }, 2000);
});
```

### Ejemplo 3: Diseño responsivo y tooltips

Copilot sugirió reglas CSS para mantener la cuadrícula del calendario responsiva y para los tooltips de prioridad, permitiendo que los tooltips no se solapen y mantengan el estilo visual del proyecto.

```css
.calendar-tooltip.traffic-high {
    top: 4px;
    right: 32px;
}
.calendar-tooltip.traffic-medium {
    top: 44px;
    right: 32px;
}
.calendar-tooltip.traffic-low {
    top: 84px;
    right: 32px;
}
```

---

## Ejemplos de interacción con Copilot en este chat

Durante el desarrollo, se utilizaron instrucciones directas a Copilot para resolver problemas y mejorar la experiencia de usuario. Algunos ejemplos:

- **"Al pararse sobre una calendar cell, debe verse una ventana emergente con los títulos de las tareas para esas fechas."**
  Copilot generó el código para tooltips dinámicos y el CSS correspondiente.

- **"Sólo se visualiza un círculo por cada celda. Deben visualizarse hasta tres y no tapar el número de la fecha."**
  Copilot propuso una estructura de grilla y el uso de flexbox para alinear los círculos de prioridad.

- **"Al mantener presionado un task-item por dos segundos, debe rellenarse el formulario con los datos de la task."**
  Copilot sugirió el uso de eventos y lógica para distinguir entre click y long press, además de la gestión de botones de edición.

- **"Agregar la prioridad en cada task-item. Debe ser un círculo de color a la derecha del título."**
  Copilot generó el código JS y CSS para mostrar el círculo de prioridad correctamente alineado.

---

## Créditos

Desarrollado con la asistencia de [GitHub Copilot](https://github.com/features/copilot).
