# 📝 Aplicación Full-Stack de Gestión de Tareas

Este es un proyecto completo de arquitectura Cliente-Servidor desarrollado como proyecto final para el ciclo de **Desarrollo de Aplicaciones Web (DAW)**. 

La aplicación permite a los usuarios registrarse de forma segura y gestionar sus tareas diarias con opciones avanzadas como asignación de fechas, horas, y niveles de prioridad.

## ✨ Características Principales

* **Sistema de Autenticación:** Registro e inicio de sesión seguro. Las contraseñas se almacenan encriptadas en la base de datos utilizando `bcrypt`.
* **Protección de Rutas:** El panel de tareas está protegido mediante `sessionStorage`. Si un usuario no está logueado, es redirigido automáticamente al inicio.
* **CRUD Completo de Tareas:** Los usuarios pueden crear, leer, actualizar (marcar como completadas) y borrar sus propias tareas.
* **Gestión Avanzada:**
  * Asignación de fecha y hora límite.
  * Selector de prioridad (Baja, Media, Alta) con indicadores visuales de colores (Rojo, Verde, Azul).
  * Ordenación automática: Las tareas más antiguas o urgentes aparecen primero.
  * Opción de "Borrar todas" las tareas con un solo clic.

## 🛠️ Tecnologías Utilizadas

**Frontend (Cliente):**
* HTML5 y CSS3
* JavaScript (Fetch API)

**Backend (Servidor):**
* **Node.js** con el framework **Express**.
* `mysql2/promise` para la conexión asíncrona a la base de datos.
* `bcrypt` para el hashing de contraseñas.
* `dotenv` para la gestión de variables de entorno de forma segura.

**Base de Datos:**
* **MySQL** (Relacional)

## 🚀 Instalación y Despliegue Local

Sigue estos pasos para ejecutar el proyecto en tu propia máquina:

### 1. Requisitos previos
Necesitas tener instalado en tu ordenador:
* [Node.js](https://nodejs.org/es/)
* Un servidor de bases de datos MySQL (como XAMPP, Laragon o MySQL Workbench).

### 2. Clonar el repositorio
```bash
git clone [https://github.com/TU_USUARIO/mi-app-tareas.git](https://github.com/TU_USUARIO/mi-app-tareas.git)
cd mi-app-tareas

**Barkero17**
* LinkedIn: [Tu Perfil de LinkedIn](https://www.linkedin.com/in/daniel-hern%C3%A1ndez-pe%C3%B1a-565570246/)
* GitHub: [@Barkero17](https://github.com/Barkero17)

---
Desarrollado por Daniel Hernández Peña (Barkero17)
