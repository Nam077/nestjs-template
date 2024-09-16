import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 *
 */
@Injectable()
export class GithubGuard extends AuthGuard('github') implements CanActivate {
    /**
     *
     * @param {ExecutionContext} context - The execution context
     * @returns {boolean | Promise<boolean>} The result
     */
    canActivate(context: ExecutionContext) {
        return super.canActivate(context);
    }
}
