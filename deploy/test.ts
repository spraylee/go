// declare function require(name:string)

// import childProcess = require('child_process')
import childProcess from 'child_process'
import fs from 'fs'
import path from 'path'
import colors from 'colors/safe'

colors.setTheme({
  info: 'green',
  warn: 'yellow',
  error: 'red'
})

const runBuild = () => childProcess.execSync('npm run build', { stdio: 'inherit' })

const log = (str: string) => console.log(str)
log.success = (str: string) => console.log(colors.green(str))
log.warn = (str: string) => console.log(colors.yellow(str))
log.error = (str: string) => {
  console.log(colors.red(str))
  // throw Error(str)
}

const emptyConfig = `{
  "spraylee": {
    "host": "spraylee.com",
    "port": 22,
    "username": "ubuntu",
    "password": "fZjK5zTgADY",
    "remoteDir": "/home/www/go",
    "distPath": "../build"
  }
}
`
type ConfigType = {
  host: string
  port: number
  username: string
  password: string
  remoteDir: string
  distPath: string
}
type MutilConfigType = Record<string, ConfigType>

const ensureConfigFile: () => Promise<MutilConfigType> | never = async () => {
  const configPath = path.join(__dirname, './config.json')
  if (fs.existsSync(configPath)) {
    const jsonStr = fs.readFileSync(configPath, 'utf-8')
    try {
      const json = JSON.parse(jsonStr) as MutilConfigType
      return json
    } catch (e) {
      log.error(e)
      throw e
    }
  } else {
    fs.writeFileSync(configPath, emptyConfig)
    log.error('请填写文件部署配置信息')
    throw '请填写文件部署配置信息'
  }
}

async function checkJsonFormat (json: MutilConfigType) {
  for (const key in json) {
    const item = json[key]
    if (typeof item !== 'object') {
      throw Error(`format of config json is not correct`)
    }
  }
}

async function main() {
  const json = await ensureConfigFile()
  await checkJsonFormat(json)
  // const params = await getConfigByType()
  // await buildAndUpload()
}

main()
