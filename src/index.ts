import app from 'app';
import configs from 'configs';
import logger from 'configs/logger';
import ws from 'configs/ws';

const server = app.listen(configs.port, () => {
  logger.info(
    `⚡️[server]: Server is active at http://localhost:${configs.port}`
  );
});

ws(server);

export default server;
