import Handlebars from 'handlebars'
import fs from 'fs'
import path from 'path'
const templateDir = path.resolve(__dirname, './templates')
const outDir = path.resolve(__dirname, '../example')
function compileTemplate(dir: string, outDir: string) {
  const files = fs.readdirSync(dir)
  files
    .filter((file) => file.endsWith('.template'))
    .forEach((fileName) => {
      const templateFile = fs.readFileSync(path.resolve(dir, fileName), {
        encoding: 'utf-8',
      })
      const template = Handlebars.compile(templateFile)
      const res = template({
        var: 'hello',
      })
      fs.writeFileSync(
        path.resolve(outDir, fileName.split('.').slice(0, -1).join('.')),
        res,
      )
    })
}
compileTemplate(templateDir, outDir)
