// Seleccionamos los elementos del DOM
const formulario = document.getElementById('task-form');
const contenedor = document.getElementById('task-list-container');
const btnDeleteAll = document.getElementById('btn-delete-all');

// 1. FUNCIÓN PARA CARGAR Y MOSTRAR TAREAS
async function cargarTareas() {
    try {
        // Pedimos las tareas al servidor (vienen ordenadas por fecha desde app.js)
        const respuesta = await fetch('/api/tareas');
        const tareas = await respuesta.json(); 

        contenedor.innerHTML = ''; // Limpiamos la lista visual

        if (tareas.length === 0) {
            contenedor.innerHTML = '<p style="text-align:center; color:#7f8c8d; margin-top: 20px;">No hay tareas en tu agenda.</p>';
            return;
        }

        tareas.forEach(tarea => {
            // Formatear la fecha para que sea legible (DD/MM/YYYY)
            let fechaBonita = "Sin fecha";
            if (tarea.fecha) {
                const date = new Date(tarea.fecha);
                fechaBonita = date.toLocaleDateString('es-ES');
            }

            // Construimos la tarjeta con la clase de prioridad y el botón de borrar
            const tarjetaHTML = `
                <div class="task-card ${tarea.prioridad}">
                    <div class="task-info">
                        <h3>${tarea.titulo}</h3>
                    </div>
                    <div class="task-meta">
                        <span class="date-time">📅 ${fechaBonita} ⏰ ${tarea.hora.substring(0, 5)}</span>
                        <div class="task-actions">
                            <label class="checkbox-label">
                                <input type="checkbox" class="task-checkbox"> Completada
                            </label>
                            <button class="btn-delete-task" onclick="eliminarTarea(${tarea.id_tarea})" title="Eliminar tarea">🗑️</button>
                        </div>
                    </div>
                </div>
            `;
            contenedor.innerHTML += tarjetaHTML;
        });

    } catch (error) {
        console.error('Error al cargar las tareas:', error);
    }
}

// 2. FUNCIÓN PARA ELIMINAR UNA TAREA POR ID
async function eliminarTarea(id) {
    if (confirm("¿Estás seguro de que quieres eliminar esta tarea?")) {
        try {
            const respuesta = await fetch(`/api/tareas/${id}`, {
                method: 'DELETE'
            });

            if (respuesta.ok) {
                cargarTareas(); // Refrescamos la lista
            } else {
                alert("No se pudo eliminar la tarea.");
            }
        } catch (error) {
            console.error('Error al eliminar:', error);
        }
    }
}

// 3. FUNCIÓN PARA ELIMINAR TODAS LAS TAREAS
btnDeleteAll.addEventListener('click', async () => {
    if (confirm("⚠️ ¿BORRAR TODO? Esta acción no se puede deshacer.")) {
        try {
            const respuesta = await fetch('/api/tareas_todas', {
                method: 'DELETE'
            });

            if (respuesta.ok) {
                cargarTareas(); // Lista vacía
            }
        } catch (error) {
            console.error('Error al vaciar la lista:', error);
        }
    }
});

// 4. EVENTO PARA GUARDAR NUEVA TAREA
formulario.addEventListener('submit', async (evento) => {
    evento.preventDefault(); 

    const datosTarea = {
        titulo: document.getElementById('task-title').value,
        fecha: document.getElementById('task-date').value,
        hora: document.getElementById('task-time').value,
        prioridad: document.getElementById('task-priority').value
    };

    try {
        const respuesta = await fetch('/api/tareas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosTarea) 
        });

        if (respuesta.ok) {
            formulario.reset(); 
            cargarTareas(); // Se añade a la lista en su posición correcta por fecha
        } else {
            alert('Error al guardar la tarea.');
        }

    } catch (error) {
        console.error('Error de conexión:', error);
    }
});

// Ejecución inicial
cargarTareas();