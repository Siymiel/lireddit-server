import { Migration } from '@mikro-orm/migrations';

export class Migration20240910140007 extends Migration {

  override async up(): Promise<void> {
    this.addSql('create table "post" ("id" serial primary key, "title" text not null, "created_at" date not null, "updated_at" date not null);');
  }

  override async down(): Promise<void> {
    this.addSql('drop table if exists "post" cascade;');
  }

}
