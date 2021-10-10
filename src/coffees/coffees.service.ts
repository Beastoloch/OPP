import {
    Inject,
    Injectable,
    NotFoundException,
    Scope,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common'
import { CoffeeEntity } from './entities/coffee.entity'
import { CreateCoffeeDto } from './dtos/create-coffee.dto'
import { UpdateCoffeeDto } from './dtos/update-coffee.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Connection, Repository } from 'typeorm'
import { FlavorEntity } from './entities/flavor.entity'
import { PaginationQueryDto } from '../common/dtos/pagination-query.dto'
import { EventEntity } from '../events/entities/event.entity'
import { COFFEE_BRANDS, MY_CONFIG_SERVICE } from './coffees.constants'
import { MyConfigService } from './coffees.module'

interface PaginationSettings {
    limit: number | string
    offset: number | string
}

interface FindAllSettings extends PaginationSettings {}

@Injectable({
    // https://docs.nestjs.com/providers#scopes
    // по дефолту используется singleton
    scope: Scope.DEFAULT,
})
export class CoffeesService {
    constructor(
        @InjectRepository(CoffeeEntity) private readonly coffeeRepository: Repository<CoffeeEntity>,
        @InjectRepository(FlavorEntity) private readonly flavorRepository: Repository<FlavorEntity>,
        @InjectRepository(EventEntity) private readonly eventRepository: Repository<EventEntity>,
        private readonly connection: Connection,
        @Inject(COFFEE_BRANDS) coffeeBrands: string[],
        @Inject(MY_CONFIG_SERVICE) myConfig: MyConfigService,
    ) {
        console.log('Service   ', coffeeBrands) // [ 'buddy brew', 'nescafe' ]
        console.log('Service   ', myConfig)

        // --- scope ---
        // выведется 1 раз (даже если было много запросов, где
        // использовался этот service)
        console.log('this service use a SINGLETON')

        // Transiet будет выводить несколько раз
        // т.к. для каждой модуля, сервиса, контроллера
        // создается новый сервис

        // Request  1 запрос - новый service
    }

    async findAll(paginationQuery: PaginationQueryDto): Promise<CoffeeEntity[]> {
        const { limit, offset } = paginationQuery

        return this.coffeeRepository.find({
            relations: ['flavors'],
            skip: offset,
            take: limit,
        })
    }

    async findOne(id: number): Promise<CoffeeEntity> {
        const coffee = await this.coffeeRepository.findOne(id, {
            relations: ['flavors'],
        })

        if (!coffee) {
            throw new NotFoundException(`Coffee #${id} not found`)
        }

        return coffee
    }

    async create(createCoffeeDto: CreateCoffeeDto): Promise<CoffeeEntity> {
        const flavors = await Promise.all(
            createCoffeeDto.flavors.map((name) => this.preloadFlavorByName(name)),
        )

        const coffee = this.coffeeRepository.create({
            ...createCoffeeDto,
            flavors,
        })

        return this.coffeeRepository.save(coffee)
    }

    async update(id: number, updateCoffeeDto: UpdateCoffeeDto): Promise<CoffeeEntity> {
        const flavors =
            updateCoffeeDto.flavors &&
            (await Promise.all(
                updateCoffeeDto.flavors.map((name) => this.preloadFlavorByName(name)),
            ))

        const coffee = await this.coffeeRepository.preload({
            id,
            ...updateCoffeeDto,
            flavors,
        })

        return this.coffeeRepository.save(coffee)
    }

    async remove(id: number) {
        const coffee = await this.findOne(id)

        if (!coffee) {
            throw new NotFoundException(`Coffee #${id} not found`)
        }

        return this.coffeeRepository.remove(coffee)
    }

    async recommendCoffee(coffee: CoffeeEntity) {
        const queryRunner = this.connection.createQueryRunner()

        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
            // добавляем новую рекомендацию

            // увеличием счетчик рекомендацией над одним coffee
            coffee.recommendations++

            // создаем рекомендацию
            const recommendEvent = new EventEntity()
            recommendEvent.name = 'recommend_coffee'
            recommendEvent.type = 'coffee'
            recommendEvent.payload = {
                coffeeId: coffee.id,
            }

            await queryRunner.manager.save(coffee)
            await queryRunner.manager.save(recommendEvent)

            await queryRunner.commitTransaction()
        } catch (e) {
            await queryRunner.rollbackTransaction()
        } finally {
            await queryRunner.release()
        }
    }

    private async preloadFlavorByName(name: string): Promise<FlavorEntity> {
        const existingFlavor = await this.flavorRepository.findOne({
            name,
        })

        if (existingFlavor) {
            return existingFlavor
        }

        return this.flavorRepository.create({ name })
    }
}
