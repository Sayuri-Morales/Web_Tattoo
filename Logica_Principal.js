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
// ----------------------------------------------------------------------------------
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
app.get('/api/tatuajes/:artista_id', (req, res) => {
    const artista_id = req.params.artista_id;

    // Obtener el artista por artista_id
    connection.query('SELECT * FROM Artistas WHERE artista_id = ?', [artista_id], (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Artista no encontrado' });
        }

        const nombre_artista = results[0].nombre;
        console.log(artista_id)

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
// Ruta para obtener las imágenes de un tatuaje específico
app.get('/api/tatuajes/:tatuaje_id/imagenes', (req, res) => {
    const tatuaje_id = req.params.tatuaje_id;

    // Obtener las imágenes de la galería para el tatuaje especificado
    connection.query('SELECT * FROM galeria_fotos WHERE tatuaje_id = ? AND status = "publicada"', [tatuaje_id], (error, fotos) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.json(fotos);
    });
});
// ----------------------------------------------------------------------------------
// Ruta para obtener las promociones activas
app.get('/api/promociones', (req, res) => {
    connection.query('SELECT * FROM promociones WHERE estado = "activo"', (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.json(results);
    });
});
// ----------------------------------------------------------------------------------
// Ruta para obtener Membresias
app.get('/api/membresias', (req, res) => {
    connection.query('SELECT * FROM Membresias', (error, results) => {
        if (error) {
            console.error("Error en la consulta:", error);
            return res.status(500).json({ error: error.message });
        }
        res.json(results);
    });
});
// ----------------------------------------------------------------------------------
// Ruta para guardar los datos de la membresía comprada en un archivo JSON
app.post('/api/comprar-membresia', (req, res) => {
    const { membresiaId, nombre, descripcion, precio } = req.body;
    const data = {
        membresiaId,
        nombre,
        descripcion,
        precio,
        fechaCompra: new Date().toLocaleString()
    };
    
    // Ruta para guardar el archivo JSON
    const filePath = path.join(__dirname, 'Public', 'ArchivosJson', 'MembresiasSeleccionadas.json');
    
    // Leer el archivo JSON existente
    fs.readFile(filePath, 'utf8', (err, fileData) => {
        if (err && err.code !== 'ENOENT') {
            return res.status(500).json({ error: 'Error al leer el archivo JSON.' });
        }

        let compras = [];
        if (fileData) {
            compras = JSON.parse(fileData);
        }

        // Añadir la nueva compra al archivo
        compras.push(data);

        // Guardar el archivo actualizado
        fs.writeFile(filePath, JSON.stringify(compras, null, 4), 'utf8', (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error al guardar el archivo JSON.' });
            }
            res.json({ success: true, message: 'Membresía comprada y registrada.' });
        });
    });
});
// ----------------------------------------------------------------------------------
// Ruta para obtener los beneficios
app.get('/api/beneficios', (req, res) => {
    connection.query('SELECT * FROM Beneficios', (error, results) => {
        if (error) {
            console.error("Error en la consulta de beneficios:", error);
            return res.status(500).json({ error: error.message });
        }
        res.json(results);  // Enviar los datos de los beneficios como respuesta
    });
});
// ----------------------------------------------------------------------------------
// Ruta para obtener las tarjetas de regalo con estado 'activa'
app.get('/api/tarjetas-regalo', (req, res) => {
    connection.query('SELECT * FROM tarjetas_regalo WHERE estado = "activa"', (error, results) => {
        if (error) {
            console.error("Error en la consulta de tarjetas de regalo:", error);
            return res.status(500).json({ error: error.message });
        }
        res.json(results);  // Enviar los datos de las tarjetas de regalo activas como respuesta
    });
});

// -------------------------------------------------------------------------------
// Ruta para marcar la tarjeta como usada y guardar la información en un archivo JSON
app.post('/api/usar-tarjeta', (req, res) => {
    const { tarjetaId, codigo, valor } = req.body;

    // Crear un objeto con los datos de la tarjeta
    const tarjetaUsada = {
        tarjetaId,
        codigo,
        valor,
        fechaUso: new Date().toLocaleString() // Agregar la fecha de uso
    };

    // Ruta donde se guardará el archivo JSON
    const rutaArchivo = path.join(__dirname, 'Public', 'ArchivosJson', 'Informacion_Tarjetas.json');

    // Leer el archivo JSON existente, o crear uno nuevo si no existe
    fs.readFile(rutaArchivo, 'utf8', (err, data) => {
        let tarjetasUsadas = [];
        if (err) {
            // Si el archivo no existe, creamos uno vacío
            console.log("El archivo no existe, creando uno nuevo.");
        } else {
            tarjetasUsadas = JSON.parse(data); // Parsear los datos existentes
        }

        // Agregar la nueva tarjeta usada a la lista
        tarjetasUsadas.push(tarjetaUsada);

        // Escribir los datos actualizados en el archivo JSON
        fs.writeFile(rutaArchivo, JSON.stringify(tarjetasUsadas, null, 2), (err) => {
            if (err) {
                console.error('Error al guardar el archivo JSON:', err);
                return res.status(500).json({ success: false, message: 'Error al guardar los datos' });
            }

            console.log('Tarjeta marcada como usada y datos guardados');
            return res.json({ success: true, message: 'Tarjeta usada exitosamente' });
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