import express from 'express';
import morgan from 'morgan';
import {engine} from 'express-handlebars';
import {join, dirname} from 'path';
import { fileURLToPath } from 'url';
import clientesRoutes from './routes/clientes.routes.js';
import handlebars from 'handlebars';

//Initialize
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

//Settings
app.set('port', process.env.PORT || 13301);
app.set('views', join(__dirname, 'views'));

//Configurar motors de plantilla
app.engine('.hbs', engine({
    defaultLayout: 'main',
    layoutsDir: join(app.get('views'), 'layouts'),
    partialsDir: join(app.get('views'), 'partials'),
    extname: '.hbs',
}));

app.set('view engine', '.hbs');

//Middlewares
app.use(morgan('dev'));

//Express para trabajar con interfaces y formularios 
//y para trabajar con archivos tipo Json
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// Registrar el helper eq manualmente
handlebars.registerHelper('eq', function(arg1, arg2, options) {
    return arg1 === arg2 ? options.fn(this) : options.inverse(this);
});

//Routes
app.get('/', (req, res) => {
    res.render('index');
    // res.json({'message': 'Hola mundo'})
});

app.use(clientesRoutes)

//Public Files
//funcion que permite a os usuarios utilizar los archivos piblicos
app.use(express.static(join(__dirname, 'public')));

//Run Server
app.listen(app.get('port'), () =>
    console.log('cargando listeninng', app.get('port'))
);
