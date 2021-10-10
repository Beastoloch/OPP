import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Inject,
    Param,
    Post,
    Put,
    Query,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common'
import { CoffeesService } from './coffees.service'
import { CreateCoffeeDto } from './dtos/create-coffee.dto'
import { UpdateCoffeeDto } from './dtos/update-coffee.dto'
import { PaginationQueryDto } from '../common/dtos/pagination-query.dto'
import { ParseIntPipe } from 'src/common/pipes/parse-int.pipe'
import { ApiResponse, ApiTags } from '@nestjs/swagger'

// new ValidationPipe(conf...) лучше использовать только
// для настройки конфигурации т.к. экземпляр ValidationPipe
// используется не 1 раз (меньше памяти занимает, а то надо каждый раз
// создавать новый экземпляр ValidationPipe)
// @UsePipes(ValidationPipe) - вешается на .../coffees/...
@Controller('coffees')
@ApiTags('coffee')
export class CoffeesController {
    constructor(private readonly coffeesService: CoffeesService) {}

    @ApiResponse({
        status: 403,
        description: 'Forbidden.',
    })
    @Get('')
    findAll(@Query() paginationQuery: PaginationQueryDto) {
        return this.coffeesService.findAll(paginationQuery)
    }

    @Get(':id')
    findOneById(@Param('id') id: boolean) {
        console.log(typeof id)
        // @ts-ignore
        return this.coffeesService.findOne(id)
    }

    @Post()
    @HttpCode(HttpStatus.GONE)
    create(@Body() createCoffeeDto: CreateCoffeeDto) {
        return this.coffeesService.create(createCoffeeDto)
    }

    // @UsePipes(ValidationPipe) вешается на update
    @Put(':id')
    // передав на @Body у нас не будет работать на @Param
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body(ValidationPipe) updateCoffeeDto: UpdateCoffeeDto,
    ) {
        return this.coffeesService.update(id, updateCoffeeDto)
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.coffeesService.remove(id)
    }
}
