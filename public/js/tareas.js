/**
 * Lógica Avanzada del Dashboard de Tareas
 * Archivo: public/js/tareas.js
 */

// ==========================================
// 1. BARRERA DE SEGURIDAD
// ==========================================
const userId = sessionStorage.getItem('userId');
const isLogged = sessionStorage.getItem('user_logged');

if (!isLogged || !userId) {
    window.location.href = 'index.html'; // Expulsar si no hay login
}

// ==========================================
// 2. EVENTOS PRINCIPALES
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Cargar las tareas de la base de datos nada más entrar
    cargarTareas();

    // Evento para añadir una nueva tarea
    const formTarea = document.getElementById('form-tarea');
    formTarea.addEventListener('submit', async (e) => {
        e.preventDefault(); 
        
        // Recogemos todos los valores de las nuevas cajas de texto
        const texto = document.getElementById('nueva-tarea').value;
        const fecha = document.getElementById('fecha-tarea').value;
        const hora = document.getElementById('hora-tarea').value;
        const prioridad = document.getElementById('prioridad-tarea').value;

        try {
            const res = await fetch('/api/tareas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ texto, usuario_id: userId, fecha, hora, prioridad })
            });

            const data = await res.json();

            if (data.success) {
                formTarea.reset(); // Vaciamos todo el formulario
                cargarTareas();    // Refrescamos la lista para que aparezca
            } else {
                alert("Error al guardar: " + data.error);
            }
        } catch (error) {
            console.error("Error conectando con el servidor:", error);
        }
    });
});

// ==========================================
// 3. FUNCIÓN PARA PINTAR LAS TAREAS
// ==========================================
async function cargarTareas() {
    const contenedor = document.getElementById('lista-tareas');
    
    try {
        const res = await fetch(`/api/tareas/${userId}`);
        const data = await res.json();

        contenedor.innerHTML = ''; // Limpiamos el contenedor

        if (data.tareas.length === 0) {
            contenedor.innerHTML = '<p style="text-align:center; color:#777; font-style:italic;">No hay tareas pendientes. ¡Añade una!</p>';
            return;
        }

        data.tareas.forEach(tarea => {
            // Lógica de colores según prioridad (Baja=Rojo, Media=Verde, Alta=Azul)
            let colorBorde = '';
            if (tarea.prioridad === 'Baja') colorBorde = '#dc3545'; // Rojo
            else if (tarea.prioridad === 'Media') colorBorde = '#28a745'; // Verde
            else if (tarea.prioridad === 'Alta') colorBorde = '#007bff'; // Azul

            // Formatear la fecha para España (DD/MM/YYYY) y recortar los segundos de la hora
            const fechaFormat = new Date(tarea.fecha).toLocaleDateString('es-ES');
            const horaFormat = tarea.hora ? tarea.hora.substring(0, 5) : '';

            // Crear el bloque HTML de la tarea
            const div = document.createElement('div');
            
            // Si en MySQL dice que está completada, le ponemos la clase "completada" (para que se tache)
            div.className = `tarea-item ${tarea.completada ? 'completada' : ''}`;
            
            // Pintamos la barra lateral de color
            div.style.borderLeft = `6px solid ${colorBorde}`;
            
            // Comprobamos si el cuadradito debe aparecer marcado
            const isChecked = tarea.completada ? 'checked' : '';

            div.innerHTML = `
                <div class="tarea-info">
                    <input type="checkbox" ${isChecked} onchange="marcarCompletada(${tarea.id}, this.checked)" style="transform: scale(1.5); cursor: pointer; margin-right: 15px;">
                    
                    <div>
                        <div class="tarea-texto">${tarea.texto}</div>
                        <div class="tarea-detalles">
                            📅 ${fechaFormat} &nbsp;|&nbsp; ⏰ ${horaFormat} &nbsp;|&nbsp; Prioridad: <strong>${tarea.prioridad}</strong>
                        </div>
                    </div>
                </div>
                <button class="btn-borrar" onclick="borrarTarea(${tarea.id})">Borrar</button>
            `;
            contenedor.appendChild(div);
        });
    } catch (error) {
        contenedor.innerHTML = '<p style="color:red; text-align:center;">Error al cargar las tareas.</p>';
        console.error("Error cargando tareas:", error);
    }
}

// ==========================================
// 4. FUNCIONES GLOBALES (Llamadas desde los botones del HTML)
// ==========================================

// Marcar o desmarcar el cuadradito de completada
window.marcarCompletada = async (id, completada) => {
    try {
        await fetch(`/api/tareas/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completada })
        });
        cargarTareas(); // Recargamos para aplicar el efecto tachado
    } catch (error) {
        console.error("Error al actualizar estado:", error);
    }
};

// Borrar UNA tarea
window.borrarTarea = async (id) => {
    if(confirm("¿Seguro que quieres borrar esta tarea?")) {
        try {
            await fetch(`/api/tareas/${id}`, { method: 'DELETE' });
            cargarTareas(); // Recargamos para que desaparezca
        } catch (error) {
            console.error("Error al borrar:", error);
        }
    }
};

// Botón rojo gigante de Borrar Todas
window.borrarTodas = async () => {
    if(confirm("⚠️ ¿Estás totalmente seguro de borrar TODAS tus tareas? Esta acción no se puede deshacer.")) {
        try {
            await fetch(`/api/tareas/todas/${userId}`, { method: 'DELETE' });
            cargarTareas(); // Recargamos para ver la lista vacía
        } catch (error) {
            console.error("Error al borrar todas:", error);
        }
    }
};

// Cerrar sesión
window.cerrarSesion = () => {
    sessionStorage.clear();
    window.location.href = 'index.html';
};