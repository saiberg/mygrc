import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tenantLocalStorage } from '../tenant.context';

@Injectable()
export class TenantInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    // In NestJS, ExecutionContext may be HTTP or WS.
    if (!user || !user.institutionId) {
      // Si no hay usuario autenticado o no tiene institutionId, procedemos sin interceptar (eg. rutas públicas)
      return next.handle();
    }

    // Corremos el resto de la petición dentro del contexto del tenant
    return tenantLocalStorage.run({ institutionId: user.institutionId }, () => {
      return next.handle();
    });
  }
}
