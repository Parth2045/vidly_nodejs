import helmet from 'helmet';
import compression from 'compression';

export default function startProd (app) {
    app.use(helmet()); // We need to call in order to get middleware function
    app.use(compression());
};