import { Migration } from '@mikro-orm/migrations';

export class Migration20230714190028 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "refresh_token" add column "is_active" boolean null default true, add column "is_deleted" boolean null default false, add column "deleted_at" timestamptz(0) null, add column "created_at" varchar(255) null, add column "updated_at" varchar(255) null;');

    this.addSql('alter table "otp" add column "is_active" boolean null default true, add column "is_deleted" boolean null default false, add column "deleted_at" timestamptz(0) null, add column "created_at" varchar(255) null, add column "updated_at" varchar(255) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "refresh_token" drop column "is_active";');
    this.addSql('alter table "refresh_token" drop column "is_deleted";');
    this.addSql('alter table "refresh_token" drop column "deleted_at";');
    this.addSql('alter table "refresh_token" drop column "created_at";');
    this.addSql('alter table "refresh_token" drop column "updated_at";');

    this.addSql('alter table "otp" drop column "is_active";');
    this.addSql('alter table "otp" drop column "is_deleted";');
    this.addSql('alter table "otp" drop column "deleted_at";');
    this.addSql('alter table "otp" drop column "created_at";');
    this.addSql('alter table "otp" drop column "updated_at";');
  }

}
