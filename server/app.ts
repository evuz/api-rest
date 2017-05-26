import * as path from 'path';
import * as express from 'express';
import * as favicon from 'serve-favicon';
import * as bodyParser from 'body-parser';
import * as hbs from 'express-handlebars';
import * as api from './routes';
import * as cors from './middlewares/cors';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors);
app.use(favicon(path.join(__dirname, '..', 'public', 'img', 'favicon.ico')))
app.use(express.static('public'));
app.engine('.hbs', hbs({
    defaultLayout: 'default',
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

app.use('/api', api);
app.get('/', (req, res) => {
    res.render('react')
});

export default app;