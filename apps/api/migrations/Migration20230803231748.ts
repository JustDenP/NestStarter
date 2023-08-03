import { Migration } from '@mikro-orm/migrations';

export class Migration20230803231748 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" alter column "last_login" drop default;');
    this.addSql('alter table "user" alter column "last_login" type timestamptz(0) using ("last_login"::timestamptz(0));');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" alter column "last_login" type varchar(255) using ("last_login"::varchar(255));');
    this.addSql('alter table "user" alter column "last_login" set default function Date() { [native code] };');
  }

}
