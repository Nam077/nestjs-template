import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { Observable } from 'rxjs';

/**
 * Guard sử dụng 'jwt-refresh' strategy để bảo vệ các route cần xác thực bằng Refresh Token.
 */
@Injectable()
export class RefreshTokenGuard extends AuthGuard('jwt-refresh') {
    /**
     * Xác thực yêu cầu thông qua refresh token.
     * @param {ExecutionContext} context - Ngữ cảnh thực thi của yêu cầu HTTP.
     * @returns {boolean | Promise<boolean>} - Kết quả xác thực.
     */
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        return super.canActivate(context); // Sử dụng logic mặc định của AuthGuard
    }
}
