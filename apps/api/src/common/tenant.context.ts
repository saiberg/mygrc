import { AsyncLocalStorage } from 'async_hooks';

export interface TenantContext {
  institutionId: string;
}

export const tenantLocalStorage = new AsyncLocalStorage<TenantContext>();
