import express, { NextFunction, Request, Response } from 'express';
import { urlencoded, json } from 'body-parser';
import cookieParser from 'cookie-parser';
import pinoHTTP from 'pino-http';
import cors from 'cors';
import morgan from 'morgan';
import { logger } from '../libs';
import { API_ROUTES, API_VERSION, HTTP_STATUS_CODE } from '../helpers';
//import { generalRoute, authRoute, todosRoute, notesRoute, tagRoute } from '../routes';

const { PORT, NODE_ENV } = process.env;

const corsOptions = {
  credentials: true,
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'],
  methods: ['GET', 'POST', 'DELETE', 'PUT'],
};

const server = () => {
  const app = express();

  app.disable('x-powered-by');
  app.enable('trust proxy');

  if (NODE_ENV === 'development') {
    app.use(morgan('combined'));
  } else {
    app.use(
      pinoHTTP({
        logger,
        customLogLevel: function (_req, res, err) {
          if (res.statusCode === HTTP_STATUS_CODE.UNAUTHORIZED) return 'warn';
          if (res.statusCode === HTTP_STATUS_CODE.NOT_FOUND) return 'error';
          if (res.statusCode >= HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR || err) return 'error';
          if (res.statusCode >= 300 && res.statusCode < 400) return 'silent';
          return 'info';
        },
        customSuccessMessage: function (req, res) {
          if (res.statusCode === HTTP_STATUS_CODE.NOT_FOUND) {
            return `${req.method} ${req.url} ${res.statusCode} resource not found`;
          }
          return `${req.method} ${req.url} ${res.statusCode} completed`;
        },
      }),
    );
  }

  app.use(cors(corsOptions));
  app.use(urlencoded({ extended: true }));
  app.use(json({ limit: '1mb' }));
  app.use(cookieParser());

  app.all('/', (req, res): any => res.sendStatus(HTTP_STATUS_CODE.OK));

  //app.use(`${API_VERSION.V1}${API_ROUTES.GENERAL}`, generalRoute);

  /* 
  ! Eğer ki bir URL backend'de yoksa otomatik olarak 404 Not Found hatası yaratıp onu yönetim sistemine iletir.
  app.all('*', (req: Request, _res: Response, next: NextFunction) => {
    const err = new Error(`Route ${req.originalUrl} not found`) as any;
    err.statusCode = HTTP_STATUS_CODE.NOT_FOUND;
    next(err);
  }); */

  // Global Error Handler

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    logger.error(err);
    let _err = {
      statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
      message: 'Some Server Error :)',
    };

    if (typeof err === 'string') {
      _err.message = err;
    } else {
      _err.statusCode = err.statusCode ?? HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR;
      _err.message = _err.statusCode === HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR ? 'Some Server Error :)' : err.message;
    }

    logger.error(`[EXPRESS ERROR] ${_err.statusCode} ${_err.message}`);

    res.status(_err.statusCode).json({
      message: _err.message,
    });
  });

  return new Promise((resolve) => {
    app.listen(PORT, () => {
      logger.info(`[EXPRESS APP]\tSuccessfully opened on port ${PORT}`);
      resolve(null);
    });
  });
};

export { server };
