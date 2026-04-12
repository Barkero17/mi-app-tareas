// --- 1. GESTIÓN DE PANTALLAS (UI) ---
function showScreen(screenId) {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('register-screen').style.display = 'none';
    document.getElementById('dashboard').style.display = 'none';

    const target = document.getElementById(screenId);
    if (screenId === 'dashboard') {
        target.style.display = 'block';
    } else {
        target.style.display = 'flex';
    }
}

function openModal() {
    document.getElementById('task-modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('task-modal').style.display = 'none';
    document.getElementById('task-form').reset();
}

function logout() {
    localStorage.removeItem('id_usuario'); // [cite: 22, 51]
    showScreen('login-screen');
}

// --- 2. AUTENTICACIÓN (LOGIN) ---
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('id_usuario', data.id_usuario); // Guardamos la FK [cite: 9, 10]
            showScreen('dashboard');
            cargarTareas();
        } else {
            alert("Error de acceso: " + data.error);
        }
    } catch (error) {
        console.error('Error en login:', error);
    }
});

// --- 3. GESTIÓN DE TAREAS (API REST) ---

// CARGAR TAREAS (GET)
async function cargarTareas(filtro = 'todas') {
    const id_usuario = localStorage.getItem('id_usuario'); // [cite: 10]
    if (!id_usuario) return;

    try {
        const response = await fetch(`/api/tareas?id_usuario=${id_usuario}`); // [cite: 248]
        let tareas = await response.json();
        
        if (filtro !== 'todas') {
            tareas = tareas.filter(t => t.estado === filtro);
        }

        const list = document.getElementById('task-list');
        list.innerHTML = ''; 

        tareas.forEach(tarea => {
            const item = document.createElement('div');
            // Identidad visual: Colores por prioridad y estado [cite: 237, 238]
            item.className = `task-item priority-${tarea.prioridad} ${tarea.estado}`;
            
            item.innerHTML = `
                <div class="task-info">
                    <strong>${tarea.titulo}</strong>
                    <p>${tarea.descripcion}</p>
                    <small>Prioridad: ${tarea.prioridad} | Fin: ${tarea.fecha_fin}</small>
                </div>
                <div class="actions">
                    <button onclick="eliminarTarea(${tarea.id_tarea})">🗑️</button>
                </div>
            `;
            list.appendChild(item);
        });
    } catch (error) {
        console.error('Error al cargar lista:', error);
    }
}

// GUARDAR TAREA (POST) - SOLUCIONADO
document.getElementById('task-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id_usuario = localStorage.getItem('id_usuario');
    
    // Capturamos los campos exactos de tu modelo [cite: 9, 27]
    const nuevaTarea = {
        titulo: document.getElementById('task-title').value,
        descripcion: document.getElementById('task-desc').value,
        fecha_fin: document.getElementById('task-date').value,
        prioridad: document.getElementById('task-priority').value,
        id_usuario: id_usuario // Relación 1:N [cite: 10]
    };

    try {
        const response = await fetch('/api/tareas', { // [cite: 249]
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevaTarea)
        });

        if (response.ok) {
            closeModal(); // [cite: 68]
            cargarTareas(); // Actualización dinámica [cite: 233]
        } else {
            const errorData = await response.json();
            alert("Error al guardar: " + errorData.error);
        }
    } catch (error) {
        console.error('Error en el envío:', error);
        alert("No se pudo conectar con el servidor.");
    }
});

// ELIMINAR TAREA (DELETE)
async function eliminarTarea(id) {
    if (!confirm('¿Deseas eliminar esta tarea?')) return;
    try {
        const response = await fetch(`/api/tareas/${id}`, { method: 'DELETE' }); // [cite: 251]
        if (response.ok) cargarTareas();
    } catch (error) {
        console.error('Error al eliminar:', error);
    }
}