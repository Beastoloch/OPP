import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { CoffeesModule } from './coffees/coffees.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CoffeeRatingModule } from './coffee-rating/coffee-rating.module'
import { DatabaseModule } from './database/database.module'
import { CommonModule } from './common/common.module';

@Module({
    imports: [
        // async модули загружаются после
        // загрузки других модулей
        // теперь наш модуль не влияет на порядок загрузки
        TypeOrmModule.forRootAsync({
            useFactory: () => ({
                type: 'postgres',
                host: '192.168.99.100',
                port: 5433,
                username: 'rasem0n',
                password: '123456',
                database: 'postgre-nest-fund',
                autoLoadEntities: true,
                synchronize: true,
            }),
        }),
        CoffeesModule,
        CoffeeRatingModule,
        DatabaseModule,
        CommonModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
