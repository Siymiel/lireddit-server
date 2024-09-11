import { Migration } from '@mikro-orm/migrations';

export class Migration20240911053436 extends Migration {

  override async up(): Promise<void> {
    this.addSql('create table "user" ("id" serial primary key, "username" text not null, "password" text not null, "created_at" date not null, "updated_at" date not null);');
    this.addSql('alter table "user" add constraint "user_username_unique" unique ("username");');
  }

  override async down(): Promise<void> {
    this.addSql('drop table if exists "user" cascade;');
  }

}
