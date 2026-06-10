import { AppDataSource } from 'database/createConnection';

const resetDatabase = async (): Promise<void> => {
  await AppDataSource.dropDatabase();
  await AppDataSource.synchronize();
};

export default resetDatabase;
