import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../domain/user.entity';
import { UserDTO } from './dto/user.dto';
import { UserMapper } from './mapper/user.mapper';
import { UserRepository } from '../repository/user.repository';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { transformPassword } from '../security';

@Injectable()
export class UserService {
    constructor(@InjectRepository(UserRepository) private userRepository: UserRepository) {}

    async findById(id: number): Promise<UserDTO | undefined> {
        const result = await this.userRepository.findOne(id);
        return UserMapper.fromEntityToDTO(this.flatAuthorities(result));
    }

    async findByFields(options: FindOneOptions<UserDTO>): Promise<UserDTO | undefined> {
        options.relations = ['authorities'];
        const result = await this.userRepository.findOne(options);
        return UserMapper.fromEntityToDTO(this.flatAuthorities(result));
    }

    async find(options: FindManyOptions<UserDTO>): Promise<UserDTO | undefined> {
        const result = await this.userRepository.findOne(options);
        return UserMapper.fromEntityToDTO(this.flatAuthorities(result));
    }

    async findAndCount(options: FindManyOptions<UserDTO>): Promise<[UserDTO[], number]> {
        options.relations = ['authorities'];
        const resultList = await this.userRepository.findAndCount(options);
        const usersDTO: UserDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(user => usersDTO.push(UserMapper.fromEntityToDTO(this.flatAuthorities(user))));
            resultList[0] = usersDTO;
        }
        return resultList;
    }

    async save(userDTO: UserDTO, creator?: string, updatePassword = false): Promise<UserDTO | undefined> {
        const user = this.convertInAuthorities(UserMapper.fromDTOtoEntity(userDTO));
        if (updatePassword) {
            await transformPassword(user);
        }
        if (creator) {
            if (!user.createdBy) {
                user.createdBy = creator;
            }
            user.lastModifiedBy = creator;
        }
        const result = await this.userRepository.save(user);
        return UserMapper.fromEntityToDTO(this.flatAuthorities(result));
    }

    async update(userDTO: UserDTO, updater?: string): Promise<UserDTO | undefined> {
        return this.save(userDTO, updater);
    }

    async delete(userDTO: UserDTO): Promise<UserDTO | undefined> {
        const user = UserMapper.fromDTOtoEntity(userDTO);
        const result = await this.userRepository.remove(user);
        return UserMapper.fromEntityToDTO(result);
    }

    private flatAuthorities(user: any): User {
        if (user && user.authorities) {
            const authorities: string[] = [];
            user.authorities.forEach(authority => authorities.push(authority.name));
            user.authorities = authorities;
        }
        return user;
    }

    private convertInAuthorities(user: any): User {
        if (user && user.authorities) {
            const authorities: any[] = [];
            user.authorities.forEach(authority => authorities.push({ name: authority }));
            user.authorities = authorities;
        }
        return user;
    }
}
