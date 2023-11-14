import app from 'app';
import configs from 'configs';
import logger from 'configs/logger';
import { connectMongodb } from 'configs/mongodb';

connectMongodb();

app.listen(configs.port, () => {
  logger.info(
    `⚡️[server]: Server is running at http://localhost:${configs.port}`
  );
});
