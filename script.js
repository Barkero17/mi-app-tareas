// Navegación entre pantallas
function showScreen(screenId) {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('register-screen').style.display = 'none';
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById(screenId).style.display = (screenId === 'dashboard') ? 'block' : 'flex';
}

// Lógica de Login (Simulada)
document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    showScreen('dashboard'); // En producción llamaría a POST /api/auth/login [cite: 247]
});

// Gestión de Modal
function openModal() {
    document.getElementById('task-modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('task-modal').style.display = 'none';
}

// Mock de tareas basado en el modelo lógico [cite: 9]
const tasks = [
    { id: 1, titulo: "Limpiar cocina", descripcion: "Fregadero, platos, suelo", prioridad: "Media", estado: "pendiente" },
    { id: 2, titulo: "Preparar comida", descripcion: "En la cocina", prioridad: "Alta", estado: "pendiente" }
];

function renderTasks() {
    const list = document.getElementById('task-list');
    list.innerHTML = tasks.map(task => `
        <div class="task-item priority-${task.prioridad} ${task.estado === 'completada' ? 'completed' : ''}">
            <div>
                <h4>${task.titulo}</h4>
                <p>${task.descripcion}</p>
                <small>Prioridad: ${task.prioridad}</small>
            </div>
            <div class="actions">
                <button onclick="toggleTask(${task.id})">✔️</button>
                <button onclick="deleteTask(${task.id})">🗑️</button>
            </div>
        </div>
    `).join('');
}

// Inicialización
renderTasks();