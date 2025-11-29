import { logger, server, prisma } from './libs';

const app = async () => {
  logger.info('[NETWORK APP]\tSTARTING ');
  await prisma.$connect();
  logger.info('[POSTGRESQL]\tSuccessfully connected to the database');
  await server();
};

app()
  .then(async () => {
    logger.info('[NETWORK APP]\tSTARTED');
  })
  .catch((err) => {
    console.log(err);

    logger.error(`[NETWORK APP]\tNOT STARTED ${err}`);

    process.exit();
  });
