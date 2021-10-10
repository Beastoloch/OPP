import { Injectable, Module, Scope } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CoffeesController } from './coffees.controller'
import { CoffeesService } from './coffees.service'
import { CoffeeEntity } from './entities/coffee.entity'
import { FlavorEntity } from './entities/flavor.entity'
import { EventEntity } from '../events/entities/event.entity'
import { COFFEE_BRANDS, MY_CONFIG_SERVICE } from './coffees.constants'
import { Connection } from 'typeorm'

@Injectable()
export class CoffeeBrandsFactory {
    create() {
        return ['buddy brew', 'nescafe']
    }
}

export interface MyConfigService {}

export class ProductionConfigService implements MyConfigService {}

export class DevelopmentConfigService implements MyConfigService {}

@Module({
    imports: [TypeOrmModule.forFeature([CoffeeEntity, FlavorEntity, EventEntity])],
    controllers: [CoffeesController],
    providers: [
        CoffeeBrandsFactory,
        {
            provide: MY_CONFIG_SERVICE,
            useClass:
                process.env.NODE_ENV === 'development'
                    ? DevelopmentConfigService
                    : ProductionConfigService,
        },
        {
            provide: CoffeesService,
            useClass: CoffeesService,
        },
        {
            provide: COFFEE_BRANDS,

            // выполнится до TypeOrmModule dependencies initialized (до подключения к бд)
            // useFactory: () => {
            //     // const coffeeBrands = await connection.query('SELECT * ...')
            //     const coffeeBrands = ['buddy brew', 'nescafe']
            //     console.log('Module   ', coffeeBrands)
            //     return coffeeBrands
            // },

            // выполнится после TypeOrmModule dependencies initialized (после подключения к бд)
            useFactory: async (connection: Connection): Promise<string[]> => {
                // const coffeeBrands = await connection.query('SELECT * ...')
                const coffeeBrands = await Promise.resolve(['buddy brew', 'nescafe'])
                console.log('Module   ', coffeeBrands)
                return coffeeBrands
            },
            scope: Scope.DEFAULT,
            inject: [CoffeeBrandsFactory],
        },
    ],
    exports: [CoffeesService],
})
export class CoffeesModule {}
