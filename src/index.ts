import app from 'app';
import configs from 'configs';
import logger from 'configs/logger';
import ws from 'configs/ws';

// connectMongodb();

const server = app.listen(configs.port, () => {
  logger.info(
    `⚡️[server]: Server is running at http://localhost:${configs.port}`
  );
});

ws(server);

export default server;
