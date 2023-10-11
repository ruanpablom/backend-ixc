import express  from 'express';
import 'express-async-errors';
import cors from 'cors';
import passport from 'passport'
import { createServer } from 'node:http'

import setupRoutes from './routes';
import responseError from '../middlewares/response-error.middleware';
import { corsConfig } from './cors-config';
import { setupIo } from './io';
import { sessionMiddleware } from '../middlewares/session.middleware';
import { passportSetup } from './passport';


const app = express();

export const server = createServer(app);

app.use(express.json());
app.use(cors(corsConfig));
app.use(sessionMiddleware);
app.use(passport.initialize()); 
app.use(passport.session()); 
passportSetup();
setupRoutes(app);
setupIo(server);
app.use(responseError)

export default app;