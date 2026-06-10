import { BaseEntity, DataSource } from 'typeorm';

import * as entities from 'entities';
import migrateLegacyProjectNames from 'database/migrateLegacyProjectNames';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: Object.values(entities),
  synchronize: true,
});

const createDatabaseConnection = async (): Promise<DataSource> => {
  const dataSource = await AppDataSource.initialize();
  BaseEntity.useDataSource(dataSource);
  await migrateLegacyProjectNames();
  return dataSource;
};

export default createDatabaseConnection;
