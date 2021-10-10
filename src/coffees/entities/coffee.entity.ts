import { ManyToMany, Column, Entity, JoinTable, PrimaryGeneratedColumn } from 'typeorm'
import { FlavorEntity } from './flavor.entity'

@Entity()
export class CoffeeEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: 'varchar',
    })
    title: string

    @Column({
        type: 'varchar',
    })
    brand: string

    @Column({ default: 0 })
    recommendations: number

    @JoinTable()
    @ManyToMany((type) => FlavorEntity, (flavor) => flavor.coffees, {
        cascade: true,
    })
    flavors: FlavorEntity[]
}
