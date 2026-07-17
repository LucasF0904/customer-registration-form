import { Type } from '@nestjs/common'
import { applyDecorators } from '@nestjs/common'
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger'

export function ApiPaginatedResponse<T extends Type>(model: T) {
  return applyDecorators(
    ApiExtraModels(model),
    ApiOkResponse({
      schema: {
        allOf: [
          {
            properties: {
              success: { type: 'boolean', example: true },
              data: { type: 'array', items: { $ref: getSchemaPath(model) } },
              meta: {
                type: 'object',
                properties: {
                  page: { type: 'number', example: 1 },
                  limit: { type: 'number', example: 10 },
                  total: { type: 'number', example: 42 },
                  totalPages: { type: 'number', example: 5 },
                },
              },
            },
          },
        ],
      },
    }),
  )
}
