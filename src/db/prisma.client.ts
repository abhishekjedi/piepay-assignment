import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type ModelMap = {
  offer: typeof prisma.offer;
  // Add more models here if needed
};

type CreateArgs<T extends keyof ModelMap> = Parameters<ModelMap[T]['create']>[0];
type CreateManyArgs<T extends keyof ModelMap> = Parameters<ModelMap[T]['createMany']>[0];
type CreateResult<T extends keyof ModelMap> = Awaited<ReturnType<ModelMap[T]['create']>>;
type CreateManyResult<T extends keyof ModelMap> = Awaited<ReturnType<ModelMap[T]['createMany']>>;

class PrismaDBClient {
  private static instance: PrismaDBClient;
  private client: PrismaClient;

  private constructor() {
    this.client = prisma;
  }

  public static getInstance(): PrismaDBClient {
    if (!PrismaDBClient.instance) {
      PrismaDBClient.instance = new PrismaDBClient();
    }
    return PrismaDBClient.instance;
  }

  public insertData<T extends keyof ModelMap>(
    model: T,
    data: CreateArgs<T>['data']
  ): Promise<CreateResult<T>> {
    return this.client[model].create({ data }) as Promise<CreateResult<T>>;
  }

  public insertMany<T extends keyof ModelMap>(
    model: T,
    args: CreateManyArgs<T>
  ): Promise<CreateManyResult<T>> {
    return this.client[model].createMany(args) as Promise<CreateManyResult<T>>;
  }

  public findMany<K extends keyof ModelMap>(
    model: K,
    args?: Parameters<ModelMap[K]['findMany']>[0]
  ): Promise<Awaited<ReturnType<ModelMap[K]['findMany']>>> {
    return this.client[model].findMany(args) as Promise<Awaited<ReturnType<ModelMap[K]['findMany']>>>;
  }

}

export default PrismaDBClient;
