import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { Observable } from 'rxjs';

/**
 *
 */
@Injectable()
export class GoogleGuard extends AuthGuard('google') implements CanActivate {
    /**
     *
     * @param {ExecutionContext} context - The execution context
     * @returns {boolean | Promise<boolean> | Observable<boolean>} The result
     */
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        // Bạn có thể thêm logic tùy chỉnh ở đây, nếu cần
        return super.canActivate(context);
    }
}
