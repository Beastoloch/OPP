import { MigrationInterface, QueryRunner } from 'typeorm'

export class CoffeeRefactor1630051434563 implements MigrationInterface {
    // в entity мы изменили колонку -name- на -title- (просто переименовали)
    // и шоб postgres понял шо мы -просто переименоли-, а не удалили колонку -name-
    // и создали пустую колонку -title-, мы делаем миграцию

    // мигрировать на изменения -name to -title-
    // перед этим в entity надо изменить -name- на -title-

    // запускается через npx typeorm  migration:run
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "coffee" RENAME COLUMN "name" TD "title"')
    }

    // откатить миграцию -title- to -name-
    // перед этим в entity надо изменить -title- на -name-

    // запускается через npx typeorm  migration:revert
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "coffee" RENAME COLUMN "title" TD "name"')
    }
}
