import { TypeEnum } from '@loginjs/type'
export const model2Prisma: Partial<Record<TypeEnum, string>> = {
  [TypeEnum.boolean]: 'Boolean',
  [TypeEnum.string]: 'String',
  [TypeEnum.int]: 'Int',
}
