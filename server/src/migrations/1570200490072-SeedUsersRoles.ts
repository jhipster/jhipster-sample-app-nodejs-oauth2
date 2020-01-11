import { MigrationInterface, QueryRunner } from 'typeorm';
import { Authority } from '../domain/authority.entity';

export class SeedUsersRoles1570200490072 implements MigrationInterface {
  role1: Authority = { name: 'ROLE_ADMIN' };

  role2: Authority = { name: 'ROLE_USER' };

  public async up(queryRunner: QueryRunner): Promise<any> {
    const conn = queryRunner.connection;
    await conn
      .createQueryBuilder()
      .insert()
      .into(Authority)
      .values([this.role1, this.role2])
      .execute();
  }

  // eslint-disable-next-line
  public async down(queryRunner: QueryRunner): Promise<any> {}
}
