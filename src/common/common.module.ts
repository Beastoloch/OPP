import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { LoggingMiddleware } from './middlewares/logging.middleware'

@Module({})
export class CommonModule implements NestModule {
    configure(consumer: MiddlewareConsumer): any {
        consumer.apply(LoggingMiddleware).forRoutes({
            path: 'coffees',
            method: RequestMethod.ALL,
        })
    }
}
