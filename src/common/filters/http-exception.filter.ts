import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common'
import { Response } from 'express'

// отлавливает все ответы с HttpException
@Catch(HttpException)
// T extends HttpException т.к. у нас разные HttpException-ы есть
export class HttpExceptionFilter<T extends HttpException> implements ExceptionFilter {
    catch(exception: T, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        // resp из Express
        const resp = ctx.getResponse<Response>()

        const status = exception.getStatus()
        const exceptionResponse = exception.getResponse()

        const error =
            typeof exceptionResponse === 'string'
                ? { message: exceptionResponse }
                : (exceptionResponse as object)

        resp.status(status).json({
            ...error,
            timestamp: new Date().toISOString(),
        })
    }
}
