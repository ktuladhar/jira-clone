import { Project } from 'entities';

const CURRENT_NAME = 'Singularity v1.0';
const LEGACY_NAME = 'singularity 1.0';

const migrateLegacyProjectNames = async (): Promise<void> => {
  await Project.createQueryBuilder()
    .update()
    .set({ name: CURRENT_NAME })
    .where('LOWER(name) = :legacyName', { legacyName: LEGACY_NAME })
    .execute();
};

export default migrateLegacyProjectNames;
