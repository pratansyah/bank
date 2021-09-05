import { Connection, createConnection, ConnectionOptions } from 'typeorm';

export default async function createDatabaseConnection(
): Promise<Connection> {
  try {
    const conf: ConnectionOptions = {
      name: 'default',
      type: 'sqlite',
      database: `${__dirname}/../.data/data.sqlite`,
      entities: [`${__dirname}/entities/*.{ts,js}`],
      synchronize: true,
    };
    const connection = await createConnection(conf);
    return connection;
  } catch (e) {
    throw Error(`[DB Error] ${e.message}`);
  }
}
