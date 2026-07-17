import type { ExceptionFilter, ArgumentsHost } from '@nestjs/common'
import { Catch, HttpException, HttpStatus, Logger } from '@nestjs/common'
import type { FastifyReply } from 'fastify'
import { errorResponse } from '../response/api-response'

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name)

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp()
    const reply = ctx.getResponse<FastifyReply>()

    if (exception instanceof HttpException) {
      const status = exception.getStatus()
      const exceptionResponse = exception.getResponse()

      const message =
        typeof exceptionResponse === 'object' && 'message' in exceptionResponse
          ? (exceptionResponse as Record<string, unknown>).message
          : exception.message

      const details = Array.isArray(message) ? (message as string[]) : undefined
      const errorMessage = Array.isArray(message) ? 'Validation failed' : (message as string)

      reply.status(status).send(errorResponse(this.resolveErrorCode(status), errorMessage, details))
      return
    }

    this.logger.error('Unhandled exception', exception)

    reply
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send(errorResponse('INTERNAL_SERVER_ERROR', 'An unexpected error occurred'))
  }

  private resolveErrorCode(status: number): string {
    const codes: Record<number, string> = {
      400: 'BAD_REQUEST',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      409: 'CONFLICT',
      422: 'UNPROCESSABLE_ENTITY',
      429: 'TOO_MANY_REQUESTS',
      500: 'INTERNAL_SERVER_ERROR',
    }
    return codes[status] ?? 'UNKNOWN_ERROR'
  }
}
