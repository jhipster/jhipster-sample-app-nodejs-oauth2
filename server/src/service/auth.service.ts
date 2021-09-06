import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthorityRepository } from '../repository/authority.repository';
import { UserService } from '../service/user.service';
import { UserDTO } from './dto/user.dto';
import { FindManyOptions } from 'typeorm';

@Injectable()
export class AuthService {
    logger = new Logger('AuthService');
    constructor(
        @InjectRepository(AuthorityRepository) private authorityRepository: AuthorityRepository,
        private userService: UserService,
    ) {}

    async findUserOrSave(loginUser: UserDTO): Promise<UserDTO | undefined> {
        if (loginUser.login && loginUser.password && !loginUser.email) {
            loginUser.email = loginUser.login + '@localhost.it';
        }
        let userFound: UserDTO = await this.userService.findByFields({ where: { login: loginUser.login } });

        if (!userFound) {
            const authoritiesName = [];
            loginUser.authorities.forEach(authority => authoritiesName.push({ name: authority }));
            userFound = Object.assign({}, loginUser);
            userFound.authorities = authoritiesName;
            await this.userService.save(userFound, loginUser.login);
        }
        return loginUser;
    }

    getAccount(userDTO: UserDTO): any {
        if (!userDTO) {
            return;
        }
        return userDTO;
    }

    async getAllUsers(options: FindManyOptions<UserDTO>): Promise<[UserDTO[], number]> {
        return await this.userService.findAndCount(options);
    }
}
