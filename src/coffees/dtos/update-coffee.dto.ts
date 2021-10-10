// nest g class coffees/dtos/update-coffee.dto --no-spec

import { PartialType } from '@nestjs/swagger'
import { CreateCoffeeDto } from './create-coffee.dto'

// https://docs.nestjs.com/openapi/mapped-types
// делает поля из CreateCoffeeDtop необязательными
export class UpdateCoffeeDto extends PartialType(CreateCoffeeDto) {}
