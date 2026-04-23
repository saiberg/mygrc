import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { tenantLocalStorage } from '../common/tenant.context';

// Models that don't need tenant scope
import * as dotenv from 'dotenv';
import { Pool } from 'pg';

// Import dotenv in case ConfigModule hasn't populated process.env yet during constructor
dotenv.config();

const globalModels = [
  'Institution',
  'User',
  'LicencePlan',
  'InstitutionLicenceplan',
];

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private _extendedClient: any;

  constructor() {
    const connectionString = process.env.DATABASE_URL;
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    
    super({ adapter } as any);

    this._extendedClient = this.$extends({
      query: {
        $allModels: {
          async $allOperations({ model, operation, args, query }) {
            if (globalModels.includes(model)) return query(args);

            const tenant = tenantLocalStorage.getStore();
            const institutionId = tenant?.institutionId;

            if (!institutionId) return query(args);

            let pArgs = args as any;
            if (!pArgs) pArgs = {};

            if (operation === 'findUnique' || operation === 'findFirst') {
               pArgs.where = { ...pArgs.where, institutionId };
            } else if (['findMany', 'updateMany', 'deleteMany', 'count', 'aggregate', 'groupBy'].includes(operation)) {
               pArgs.where = { ...pArgs.where, institutionId };
            } else if (operation === 'update' || operation === 'delete') {
               pArgs.where = { ...pArgs.where, institutionId };
            } else if (operation === 'create' || operation === 'createMany') {
               if (pArgs.data) {
                 if (Array.isArray(pArgs.data)) {
                   pArgs.data = pArgs.data.map((d: any) => ({ ...d, institutionId }));
                 } else {
                   pArgs.data = { ...pArgs.data, institutionId };
                 }
               }
            } else if (operation === 'upsert') {
               if (pArgs.where) pArgs.where = { ...pArgs.where, institutionId };
               if (pArgs.create) pArgs.create = { ...pArgs.create, institutionId };
            }

            return query(pArgs);
          }
        }
      }
    });

    return new Proxy(this, {
      get: (target, prop) => {
        if (typeof prop === 'string' && target._extendedClient[prop]) {
          return target._extendedClient[prop];
        }
        return (target as any)[prop];
      }
    });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
