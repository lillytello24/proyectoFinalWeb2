const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

// Instanciamos express
const app = express();

// Middleware para analizar los datos del cuerpo de las solicitudes HTTP
app.use(bodyParser.urlencoded({ extended: false }));

// Establecemos el motor de plantillas (EJS)
app.set('view engine', 'ejs');

// Configuramos la carpeta de vistas en la raíz del proyecto
app.set('views', path.join(__dirname));  // Buscamos las vistas en el directorio raíz
app.use(express.static(__dirname)); // Esto permitirá que el CSS se cargue desde la raíz


// Datos de conexión a la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Li240203',  // Cambia esta contraseña si es necesario
    database: 'proyecto_final',  // Asegúrate de que tu base de datos se llame así
    
});

// Conexión a la base de datos
db.connect((err) => {
    if (err) {
        console.log(`Error al momento de hacer conexión con la base de datos: ${err}`);
    } else {
        console.log('Conexión realizada correctamente.');
    }
});

// Puerto y host
const port = 3000; 
const hostName = 'localhost';

// Iniciamos el servidor
app.listen(port, hostName, () => {
    console.log(`El servidor está en escucha desde http://${hostName}:${port}`);
});

// Ruta principal para mostrar la lista de usuarios
app.get('/', (req, res) => {
    const query = 'SELECT * FROM users';  // Consulta a la base de datos
    db.query(query, (err, results) => {
        if (err) {
            console.error(`Error al recuperar datos: ${err}`);
            return res.send('Error al recuperar los datos');
        } else {
            res.render('index', { users: results });  // Renderizamos la vista con los usuarios
        }
    });
});

// Ruta para agregar un nuevo usuario
app.post('/add', (req, res) => {
    const { name, email } = req.body;  // Extraemos los datos del formulario
    const query = 'INSERT INTO users (name, email) VALUES (?, ?)';  // Consulta SQL para insertar usuario
    db.query(query, [name, email], (err) => {
        if (err) {
            console.error(`Error al insertar usuario: ${err}`);
            return res.send('Error');
        } else {
            res.redirect('/');  // Redirigimos a la página principal
        }
    });
});

// Ruta para editar un usuario
app.get('/edit/:id', (req, res) => {
    const { id } = req.params;  // Obtenemos el ID del usuario
    const query = 'SELECT * FROM users WHERE id = ?';  // Consulta SQL para obtener un usuario por su ID
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error(`Error al obtener usuario: ${err}`);
            return res.send('Error en la DB');
        } else {
            res.render('edit', { user: results[0] });  // Renderizamos la vista para editar
        }
    });
});

// Ruta para actualizar un usuario
app.post('/edit/:id', (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    const query = 'UPDATE users SET name = ?, email = ? WHERE id = ?';
    db.query(query, [name, email, id], (err) => {
        if (err) {
            console.error(`Error al actualizar usuario: ${err}`);
            return res.send('Error al actualizar usuario');
        } else {
            res.redirect('/');  // Redirigimos a la página principal
        }
    });
});

// Ruta para eliminar un usuario
app.get('/delete/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM users WHERE id = ?';  // Consulta SQL para eliminar un usuario
    db.query(query, [id], (err) => {
        if (err) {
            console.error(`Error al eliminar usuario: ${err}`);
            return res.send('Error al eliminar usuario');
        } else {
            res.redirect('/');  // Redirigimos a la página principal
        }
    });
});
