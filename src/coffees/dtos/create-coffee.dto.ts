// nest g class coffees/dtos/create-coffee.dto --no-spec

import { IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateCoffeeDto {
    @ApiProperty({
        description: ' The name of a coffee',
    })
    @IsString()
    readonly name: string

    @ApiProperty()
    @IsString()
    readonly brand: string

    @ApiProperty({
        example: [],
    })
    @IsString({ each: true })
    readonly flavors: string[]
}
