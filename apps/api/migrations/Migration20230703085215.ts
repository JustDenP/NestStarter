import { Migration } from '@mikro-orm/migrations';

export class Migration20230703085215 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user" ("id" serial primary key, "is_deleted" boolean null default false, "deleted_at" timestamptz(0) null, "created_at" varchar(255) null, "updated_at" varchar(255) null, "roles" text[] not null default \'{client}\', "username" varchar(255) not null, "email" varchar(255) not null, "password" varchar(255) not null, "is_verified" boolean not null default false, "is_active" boolean not null default true, "first_name" varchar(255) not null, "last_name" varchar(255) not null, "phone" varchar(255) null, "picture" varchar(255) null, "last_login" timestamptz(0) null);');
    this.addSql('create index "user_id_index" on "user" ("id");');
    this.addSql('create index "user_username_index" on "user" ("username");');
    this.addSql('alter table "user" add constraint "user_username_unique" unique ("username");');
    this.addSql('create index "user_email_index" on "user" ("email");');
    this.addSql('alter table "user" add constraint "user_email_unique" unique ("email");');
    this.addSql('alter table "user" add constraint "user_phone_unique" unique ("phone");');

    this.addSql('create table "refresh_token" ("id" serial primary key, "expires_in" timestamptz(0) not null, "user_id" int not null, "is_revoked" boolean null default false);');
    this.addSql('create index "refresh_token_id_index" on "refresh_token" ("id");');

    this.addSql('create table "user_profile" ("id" serial primary key);');
    this.addSql('create index "user_profile_id_index" on "user_profile" ("id");');

    this.addSql('alter table "refresh_token" add constraint "refresh_token_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');

    this.addSql('drop table if exists "user_settings" cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "refresh_token" drop constraint "refresh_token_user_id_foreign";');

    this.addSql('create table "user_settings" ("id" serial primary key);');
    this.addSql('create index "user_settings_id_index" on "user_settings" ("id");');

    this.addSql('drop table if exists "user" cascade;');

    this.addSql('drop table if exists "refresh_token" cascade;');

    this.addSql('drop table if exists "user_profile" cascade;');
  }

}
