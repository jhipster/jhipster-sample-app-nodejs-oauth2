import { Controller, Get, Logger, Req, UseInterceptors } from '@nestjs/common';
import { UserDTO } from '../../service/dto/user.dto';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { AuthService } from '../../service/auth.service';

@Controller('api')
@UseInterceptors(LoggingInterceptor)
@ApiUseTags('account-resource')
export class AccountController {
    logger = new Logger('AccountController');

    constructor(private readonly authService: AuthService) {}

    @Get('/account')
    @ApiOperation({ title: 'Get the current user if logged' })
    @ApiResponse({
        status: 200,
        description: 'User retrieved',
        type: UserDTO,
    })
    getAccount(@Req() req: any): any {
        if (!req.session) {
            return;
        }
        const userDTO: UserDTO = req.session.user;
        return this.authService.getAccount(userDTO);
    }
}
