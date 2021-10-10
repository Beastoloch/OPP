import { Column, Entity, PrimaryGeneratedColumn, Index } from 'typeorm'

// https://www.youtube.com/watch?v=su6XSeL3r7s
// добавили индексы т.к. type и name
// будет часто одним и темже {type: 'coffe', name: 'recommended_coffe'}
@Index(['name', 'type'])
@Entity()
export class EventEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    type: string

    @Index()
    @Column()
    name: string

    @Column('json')
    payload: Record<string, any>
}
