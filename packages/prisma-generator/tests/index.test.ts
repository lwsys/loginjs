import { describe, expect, test } from '@jest/globals'
import { updateSchema } from '../src/index'
import * as fs from 'fs'
import path from 'path'
import { s } from '@loginjs/type'
const getReceiveSchema = (module: string) =>
  fs.readFileSync(
    path.resolve(__dirname, 'schema', module, './receive.prisma'),
    'utf-8',
  )
const getExpectSchema = (module: string) =>
  fs.readFileSync(
    path.resolve(__dirname, 'schema', module, './expect.prisma'),
    'utf-8',
  )
var receiveSchema = ''
var expectSchema = ''

const writeFn = jest.fn()

let prismaPath = 'schema.prisma'
jest.mock('@prisma/internals', () => ({
  getSchemaPath: () => prismaPath,
}))

jest.mock('fs/promises', () => ({
  readFile: () => receiveSchema,
  writeFile: (...args: any[]) => writeFn(...args),
}))

/**
 *    (fsPromise as any).mockImplementation(

    )
*/
describe('默认值 cases', () => {
  const passwordStrategy = {
    name: 'password',
    model: s.object({
      password: s.string('').setUnique(true),
    }),
  }
  test('attach strategy', async () => {
    receiveSchema = getReceiveSchema('attach-strategy')
    expectSchema = getExpectSchema('attach-strategy')

    await updateSchema(passwordStrategy)
    expect(writeFn).toBeCalledWith(prismaPath, expectSchema.trim())
  })

  test('exist', async () => {
    receiveSchema = getReceiveSchema('exist')
    expectSchema = getExpectSchema('exist')

    await updateSchema(passwordStrategy)
    expect(writeFn).toBeCalledWith(prismaPath, expectSchema.trim())
  })
})
