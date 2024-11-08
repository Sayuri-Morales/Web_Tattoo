// Librerías
const fs = require('fs');
const path = require('path');
const http = require('http');
const mysql = require('mysql2');
const express = require('express');
const querystring = require('querystring');

// Inicializa la aplicación de express
const app = express();

// Conexión a la base de datos
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '#Mysql.',
    database: 'sitio_tatuajes'
});

connection.connect(error => {
    if (error) {
        console.error('Error conectando a la base de datos:', error);
        return;
    }
    console.log('Conexión a la base de datos establecida...');
});

// Configurar express para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'Public')));

// Diccionario de tipos MIME
const mime = {
    'html': 'text/html',
    'css': 'text/css',
    'jpg': 'image/jpg',
    'jpeg': 'image/jpeg',
    'ico': 'image/x-icon',
    'mp3': 'audio/mpeg3',
    'mp4': 'video/mp4'
};
// Configurar Express para manejar datos JSON
app.use(express.json());

// Ruta para el login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    // Consultar el usuario en la base de datos
    connection.query('SELECT * FROM Usuarios WHERE email = ?', [email], (error, results) => {
        if (error) {
            console.error('Error al consultar la base de datos:', error);
            return res.status(500).json({ success: false, message: 'Error en el servidor' });
        }

        if (results.length === 0) {
            return res.json({ success: false, message: 'Correo no encontrado' });
        }

        const user = results[0];

        // Validar la contraseña
        if (user.contraseña !== password) {
            return res.json({ success: false, message: 'Contraseña incorrecta' });
        }

        // Validar si el usuario está activo
        if (user.estado !== 'activo') {
            return res.json({ success: false, message: 'Cuenta desactivada' });
        }

        // Devolver la información del usuario
        res.json({
            success: true,
            nombre: user.nombre,
            rol: user.rol
        });
    });
});
// ----------------------------------------------------------------------------------
// Ruta para obtener los datos de los artistas
app.get('/api/artistas', (req, res) => {
    connection.query('SELECT * FROM Artistas', (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.json(results);
    });
});
// ----------------------------------------------------------------------------------
// Ruta para obtener los tatuajes de un artista específico
app.get('/api/tatuajes/:cedula', (req, res) => {
    const cedula = req.params.cedula;
    
    // Obtener el artista por cédula
    connection.query('SELECT * FROM Artistas WHERE cedula = ?', [cedula], (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ error: 'Artista no encontrado' });
        }
        
        const artista_id = results[0].artista_id;
        const nombre_artista = results[0].nombre; // Obtén el nombre del artista
        
        // Obtener los tatuajes del artista
        connection.query('SELECT * FROM Tatuajes WHERE artista_id = ?', [artista_id], (error, tatuajes) => {
            if (error) {
                return res.status(500).json({ error: error.message });
            }
            // Envía el nombre del artista junto con los tatuajes
            res.json({ nombre_artista, tatuajes });
        });
    });
});
// ----------------------------------------------------------------------------------
// Crear el servidor y usar la app de express como manejador de peticiones
const servidor = http.createServer(app);

// Escuchar en el puerto 8888
servidor.listen(8888, () => {
    console.log('Servidor escuchando en http://localhost:8888');
});