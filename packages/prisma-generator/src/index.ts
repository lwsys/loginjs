import { GeneratorFn } from './../../type/src/strategy-generator'
import { generatorHandler, GeneratorOptions } from '@prisma/generator-helper'
import { getSchemaPath } from '@prisma/internals'
// import { IBaseStrategy, TypeEnum } from '@loginjs/type'
import { readFile, writeFile } from 'fs/promises'
import {
  createPrismaSchemaBuilder,
  Field,
  getSchema,
  Model,
} from '@mrleebo/prisma-ast'
import { IBaseStrategy, TypeEnum, getFieldName } from '@loginjs/type'
import { model2Prisma as TYPE_MAP } from './utils/type-convert'

interface Options {
  schemaPath?: string
}
const getProperty = (model: any) => {
  return model.properties as {
    type: 'attribute'
    kind: string
    name: string
    args: any[]
  }[]
}
const schemaObjects = ['model', 'view']
function isSchemaObject(obj: any): boolean {
  return obj != null && 'type' in obj && schemaObjects.includes(obj.type)
}

const findAttrByName = (model: any, name: string) => {
  let subject = model.getSubject()
  if (!isSchemaObject(subject)) {
    const parent = model.getParent()
    if (!isSchemaObject(parent))
      throw new Error('Subject must be a prisma model or view!')

    subject = parent
  }
  return subject.properties.find((attr: any) => attr.name === name)
}
const STRATEGY_NAME = 'LoginStrategy'
const UID = 'uid'
export async function updateSchema(
  strategyInfo: { name: string; model: IBaseStrategy },
  options: Options = {},
) {
  const schemaPath = await getSchemaPath(options.schemaPath)
  if (!schemaPath) {
    console.error('Not found prism Schema')
    return
  }

  const schemaBuilder = createPrismaSchemaBuilder(
    await readFile(schemaPath, {
      encoding: 'utf-8',
    }),
  )

  const schema = schemaBuilder.getSchema()
  const userNode = schema.list.find(
    (node) => node.type === 'model' && node.name === 'User',
  ) as Model
  if (!userNode) {
    console.error("Can't find User Model")
    return
  }
  const userIdField = userNode.properties.find(
    (field) =>
      field.type === 'field' &&
      field.attributes?.find((attr) => attr.name === 'id'),
  ) as Field
  if (!userIdField) {
    console.error("Can't find user id field")
    return
  }
  //todo process Func?
  const uidInfo = {
    name: userIdField.name,
    //TODO mapping prisma type to loginjs type
    type: String(userIdField.fieldType),
  }

  const { model } = strategyInfo
  const prismaModel = schemaBuilder.model(STRATEGY_NAME)
  prismaModel
    .field('id', 'Int')
    .attribute('id')
    .attribute('default', [{ name: 'autoincrement' }])
  prismaModel.field(UID, uidInfo.type).attribute('unique')
  if (model.type !== TypeEnum.object) {
    console.error('Model must wrapper with a object struct')
    return
  }
  const modelChildren = model.children!
  Object.keys(modelChildren).forEach((fieldKey) => {
    const item = modelChildren[fieldKey]
    // insert strategy name before field name.
    fieldKey = getFieldName(strategyInfo.name, fieldKey)

    prismaModel.field(fieldKey, `${TYPE_MAP[item.type]}?`)

    if (item.isUnique) {
      const attrUnique = findAttrByName(prismaModel, 'unique')
      const argItem = attrUnique?.args?.find(
        (arg: any) => arg.type === 'attributeArgument',
      )?.value
      if (!argItem?.args?.includes(fieldKey)) {
        // add a blank space to schema file
        prismaModel.break()
        prismaModel.blockAttribute('index', [UID, fieldKey])
      }
    }
  })

  writeFile(schemaPath, schemaBuilder.print().trim())
}
const main: GeneratorFn = async (strategyInfo: {
  name: string
  model: IBaseStrategy
}) => {
  await updateSchema(strategyInfo)
}
export default main
