import { Migration } from '@mikro-orm/migrations';

export class Migration20230714212513 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "refresh_token" alter column "is_active" type boolean using ("is_active"::boolean);');
    this.addSql('alter table "refresh_token" alter column "is_active" set not null;');

    this.addSql('alter table "otp" alter column "is_active" type boolean using ("is_active"::boolean);');
    this.addSql('alter table "otp" alter column "is_active" set not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "refresh_token" alter column "is_active" type boolean using ("is_active"::boolean);');
    this.addSql('alter table "refresh_token" alter column "is_active" drop not null;');

    this.addSql('alter table "otp" alter column "is_active" type boolean using ("is_active"::boolean);');
    this.addSql('alter table "otp" alter column "is_active" drop not null;');
  }

}
