import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 *
 */
@Injectable()
export class FacebookGuard extends AuthGuard('facebook') implements CanActivate {
    /**
     *
     * @param {ExecutionContext} context - The execution context object
     * @returns {boolean | Promise<boolean>} The result
     */
    canActivate(context: ExecutionContext) {
        return super.canActivate(context);
    }
}
