import { Migration } from '@mikro-orm/migrations';

export class Migration20230713230448 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "otp" ("id" serial primary key, "expires_in" timestamptz(0) not null, "otp_code" varchar(20) not null, "user_id" int not null, "is_used" boolean not null default false);');
    this.addSql('create index "otp_id_index" on "otp" ("id");');
    this.addSql('create index "otp_otp_code_index" on "otp" ("otp_code");');
    this.addSql('create index "otp_user_id_index" on "otp" ("user_id");');

    this.addSql('alter table "otp" add constraint "otp_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');

    this.addSql('alter table "refresh_token" alter column "is_revoked" type boolean using ("is_revoked"::boolean);');
    this.addSql('alter table "refresh_token" alter column "is_revoked" set not null;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "otp" cascade;');

    this.addSql('alter table "refresh_token" alter column "is_revoked" type boolean using ("is_revoked"::boolean);');
    this.addSql('alter table "refresh_token" alter column "is_revoked" drop not null;');
  }

}
