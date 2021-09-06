import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { UserDTO } from '../src/service/dto/user.dto';
import { UserService } from '../src/service/user.service';

describe('User', () => {
    let app: INestApplication;
    let service: UserService;

    const authGuardMock = { canActivate: (): any => true };
    const rolesGuardMock = { canActivate: (): any => true };

    const testUserRequestObject: any = {
        login: 'userTestLogin',
        firstName: 'UserTest',
        lastName: 'UserTest',
        email: 'usertest@localhost.it',
    };

    const testUserDTO: UserDTO = {
        login: 'userTestLogin',
        firstName: 'UserTest',
        lastName: 'UserTest',
        email: 'usertest@localhost.it',
        password: 'userTestLogin',
    };

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideGuard(AuthGuard)
            .useValue(authGuardMock)
            .overrideGuard(RolesGuard)
            .useValue(rolesGuardMock)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
        service = moduleFixture.get<UserService>(UserService);
    });

    it('/POST create user', async () => {
        const createdUser: UserDTO = (
            await request(app.getHttpServer())
                .post('/api/admin/users')
                .send(testUserRequestObject)
                .expect(201)
        ).body;

        expect(createdUser.login).toEqual(testUserRequestObject.login);
        await service.delete(createdUser);
    });

    it('/GET all users', () => {
        request(app.getHttpServer())
            .get('/api/admin/users')
            .expect(200);
    });

    it('/PUT update user', async () => {
        testUserDTO.login = 'TestUserUpdate';
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: savedPassword, lastModifiedDate: savedLastModifiedDate, ...savedUser } = await service.save(
            testUserDTO,
        );
        savedUser.firstName = 'Updated Name';

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: updatedPassword, lastModifiedDate: updatedLastModifiedDate, ...updatedUser } = (
            await request(app.getHttpServer())
                .put('/api/admin/users')
                .send(savedUser)
                .expect(200)
        ).body;

        expect(updatedUser).toEqual(JSON.parse(JSON.stringify(savedUser)));

        await service.delete(savedUser as UserDTO);
    });

    it('/GET user with a login name', async () => {
        testUserDTO.login = 'TestUserGet';
        const savedUser: UserDTO = await service.save(testUserDTO);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...savedUserWithoutPassword } = savedUser;

        const getUser: UserDTO = (
            await request(app.getHttpServer())
                .get('/api/admin/users/' + savedUser.login)
                .expect(200)
        ).body;

        expect(getUser).toEqual(JSON.parse(JSON.stringify(savedUserWithoutPassword)));

        await service.delete(savedUser);
    });

    it('/DELETE user', async () => {
        testUserDTO.login = 'TestUserDelete';
        const savedUser: UserDTO = await service.save(testUserDTO);

        await request(app.getHttpServer())
            .delete('/api/admin/users/' + savedUser.login)
            .expect(204);

        const userUndefined = await service.findById(savedUser.id);
        expect(userUndefined).toBeUndefined();
    });

    afterEach(async () => {
        await app.close();
    });
});
