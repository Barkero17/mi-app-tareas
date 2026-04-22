/**
 * Lógica del Frontend para el Login
 * Proyecto: Mi-App-Tareas (DAW)
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Capturamos el formulario de login por su ID
    // Asegúrate de que en tu HTML el <form> tenga id="login-form"
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Evitamos que la página se recargue automáticamente

            // 2. Recogemos los valores de los inputs
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // 3. Validación básica en el cliente (UX)
            if (!email || !password) {
                alert('Por favor, rellena todos los campos');
                return;
            }

            try {
                // 4. Enviamos los datos al backend mediante FETCH
                // La ruta '/api/login' es la que configuramos en server.js
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json' // Indicamos que enviamos JSON
                    },
                    body: JSON.stringify({ email, password }) // Convertimos el objeto a texto JSON
                });

                // 5. Procesamos la respuesta del servidor
                const data = await response.json();

                if (response.ok && data.success) {
                    // Si el login es correcto (status 200)
                    console.log('Login exitoso:', data.message);
                    
                    // Guardamos algo en sessionStorage si fuera necesario (opcional)
                    sessionStorage.setItem('user_logged', 'true');

                    // Redirigimos a la página principal de tareas
                    window.location.href = 'index.html'; 
                } else {
                    // Si el servidor devuelve un error (401, 500, etc.)
                    alert('Error de acceso: ' + (data.error || 'Credenciales incorrectas'));
                }

            } catch (error) {
                // Error de red o si el servidor está caído
                console.error('Error en la petición:', error);
                alert('No se pudo conectar con el servidor. Inténtalo más tarde.');
            }
        });
    }
});