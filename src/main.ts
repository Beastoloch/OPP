import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { NestExpressApplication } from '@nestjs/platform-express'
import { ValidationPipe } from '@nestjs/common'
import { HttpExceptionFilter } from './common/filters/http-exception.filter'
import { ApiKeyGuard } from './common/guards/api-key.guard'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule)
    app.setGlobalPrefix('api')
    // https://docs.nestjs.com/pipes

    // глобальный pipe - все запросы через проходят
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true, // преобразоывает все аргументы  к нужным :
            transformOptions: {
                enableImplicitConversion: true,
            },
        }),
    )
    // можно использовать @UseFilters
    // но тута используется глобальный
    // app.useGlobalFilters(new HttpExceptionFilter())

    // глобальный, но есть @UseGuard
    // app.useGlobalGuards(new ApiKeyGuard())

    const options = new DocumentBuilder()
        .setTitle('rasem0n')
        .setDescription('Coffee application')
        .setVersion('1.0')
        .build()
    const document = SwaggerModule.createDocument(app, options)
    SwaggerModule.setup('document', app, document)

    await app.listen(4002)
}

bootstrap().catch((e) => console.error(e))
