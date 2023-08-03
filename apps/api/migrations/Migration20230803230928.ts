import { Migration } from '@mikro-orm/migrations';

export class Migration20230803230928 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user" ("id" serial primary key, "deleted_at" timestamptz(0) null, "created_at" timestamptz(0) null, "updated_at" timestamptz(0) null, "role" text check ("role" in (\'admin\', \'client\', \'user\')) not null default \'user\', "email" varchar(255) not null, "password" varchar(255) not null, "first_name" varchar(255) not null, "last_name" varchar(255) not null, "phone" varchar(255) null, "picture" varchar(255) null, "is_verified" boolean not null default false, "is_active" boolean not null default true, "last_login" timestamptz(0) null);');
    this.addSql('create index "user_id_index" on "user" ("id");');
    this.addSql('create index "user_email_index" on "user" ("email");');
    this.addSql('alter table "user" add constraint "user_email_unique" unique ("email");');
    this.addSql('alter table "user" add constraint "user_phone_unique" unique ("phone");');

    this.addSql('create table "refresh_token" ("id" serial primary key, "deleted_at" timestamptz(0) null, "created_at" timestamptz(0) null, "updated_at" timestamptz(0) null, "expires_in" timestamptz(0) not null, "user_id" int not null, "is_active" boolean not null default true);');
    this.addSql('create index "refresh_token_id_index" on "refresh_token" ("id");');

    this.addSql('alter table "refresh_token" add constraint "refresh_token_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');
  }

}
