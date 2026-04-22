document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registroForm = document.getElementById('registro-form');

    // Manejar LOGIN
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const res = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await res.json();
                
                if (data.success) {
                    alert("✅ " + data.message);
                    
                    // --- SOLUCIÓN AL EFECTO REBOTE ---
                    // Guardamos la sesión y el ID del usuario
                    sessionStorage.setItem('user_logged', 'true');
                    sessionStorage.setItem('userId', data.userId);
                    
                    // Redirigimos al dashboard
                    window.location.href = 'tareas.html';
                } else {
                    alert("❌ " + data.error);
                }
            } catch (error) {
                console.error("Error en login:", error);
            }
        });
    }

    // Manejar REGISTRO
    if (registroForm) {
        registroForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;

            try {
                const res = await fetch('/api/registro', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await res.json();
                
                if (data.success) {
                    alert("👤 Usuario registrado. Ahora puedes loguearte.");
                } else {
                    alert("❌ " + data.error);
                }
            } catch (error) {
                console.error("Error en registro:", error);
            }
        });
    }
});