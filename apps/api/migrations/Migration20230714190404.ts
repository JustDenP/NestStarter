import { Migration } from '@mikro-orm/migrations';

export class Migration20230714190404 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "refresh_token" drop column "is_revoked";');

    this.addSql('alter table "otp" drop column "is_used";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "refresh_token" add column "is_revoked" boolean not null default false;');

    this.addSql('alter table "otp" add column "is_used" boolean not null default false;');
  }

}
