import * as mongoose from 'mongoose';
import * as app from './app';
import { initMocks } from './services/mocks';
import * as config from './config';

mongoose.connect(config.db, (err, res) => {
    if (err) {
        return console.log(`Error al conectar con la base de datos: ${err}`);
    }
    console.log('Conexión a la base de datos realizada')
    initMocks();
    app.listen(config.port, () => {
        console.log(`Servidor iniciado en http://localhost:${config.port}`);
    })
});
