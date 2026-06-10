import { EntityTarget, FindOneOptions, ObjectLiteral } from 'typeorm';

import { AppDataSource } from 'database/createConnection';
import { Project, User, Issue, Comment } from 'entities';
import { EntityNotFoundError, BadUserInputError } from 'errors';
import { generateErrors } from 'utils/validation';

type EntityConstructor = typeof Project | typeof User | typeof Issue | typeof Comment;
type EntityInstance = Project | User | Issue | Comment;

const entities: { [key: string]: EntityConstructor } = { Comment, Issue, Project, User };

export const findEntityOrThrow = async <T extends ObjectLiteral>(
  Constructor: EntityTarget<T>,
  id: number | string,
  options?: Omit<FindOneOptions<T>, 'where'>,
): Promise<T> => {
  const instance = await AppDataSource.getRepository(Constructor).findOne({
    ...(options || {}),
    where: ({ id: Number(id) } as unknown) as FindOneOptions<T>['where'],
  });
  if (!instance) {
    const name = typeof Constructor === 'function' ? Constructor.name : 'Entity';
    throw new EntityNotFoundError(name);
  }
  return instance;
};

export const validateAndSaveEntity = async <T extends EntityInstance>(instance: T): Promise<T> => {
  const Constructor = entities[instance.constructor.name];

  if ('validations' in Constructor) {
    const errorFields = generateErrors(instance, Constructor.validations);

    if (Object.keys(errorFields).length > 0) {
      throw new BadUserInputError({ fields: errorFields });
    }
  }
  return instance.save() as Promise<T>;
};

export const createEntity = async <T extends EntityConstructor>(
  Constructor: T,
  input: Partial<InstanceType<T>>,
): Promise<InstanceType<T>> => {
  const instance = Constructor.create(input);
  return validateAndSaveEntity(instance as InstanceType<T>);
};

export const updateEntity = async <T extends EntityConstructor>(
  Constructor: T,
  id: number | string,
  input: Partial<InstanceType<T>>,
): Promise<InstanceType<T>> => {
  const instance = await findEntityOrThrow(Constructor, id);
  Object.assign(instance, input);
  return validateAndSaveEntity(instance as InstanceType<T>);
};

export const deleteEntity = async <T extends EntityConstructor>(
  Constructor: T,
  id: number | string,
): Promise<InstanceType<T>> => {
  const instance = await findEntityOrThrow(Constructor, id);
  await instance.remove();
  return instance as InstanceType<T>;
};
