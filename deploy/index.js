/**

How to use:

  yarn add -D node-ssh colors optimist

  yarn deploy:<type name>
  or
  node ./deploy/index.js --type <type-name>

How to config:

  create a file named 'config.js' in current folder.

config.js Example:

module.exports = {
  <type name 1>: {
    host: <ip|host>,
    username: <username>,
    password: <password>,
    remoteDir: '/var/www/<project-name>'
  },
  <type name 2>: {
    host: <ip|host>,
    username: <username>,
    password: <password>,
    remoteDir: '/var/www/<project-name>'
  }
}


 */

const path = require('path')

const node_ssh = require('node-ssh')
const ssh = new node_ssh()

const colors = require('colors/safe')

const argv = require('optimist').argv

const deployType = argv.type

colors.setTheme({
  info: 'green',
  warn: 'yellow',
  error: 'red'
})

const config = require('./config.js')

if (!config[deployType]) {
  console.log(colors.error('No deploy type config found!'))
  process.exit()
}

const { host, username, password, remoteDir, distPath, ...rest } = config[deployType]

let startTime = Date.now()

async function main(currentTryTimes = 0) {
  await ssh.connect({
    host,
    username,
    password,
    distPath,
    ...rest
  })

  console.log('\nSSH Connected!\n')

  const failed = []
  const successful = []

  await ssh.putDirectory(path.join(__dirname, distPath), remoteDir, {
    recursive: true,
    concurrency: 3,
    tick: function(localPath, remotePath, error) {
      if (error) {
        failed.push(localPath)
        console.log(colors.warn(`Fail: ${localPath} - ${error.message}`))
      } else {
        successful.push(localPath)
        console.log(colors.info(`Upload: ${localPath}`))
      }
    }
  })

  if (failed.length) {
    if (currentTryTimes >= 2) {
      console.log(colors.error('\nUpload failed for 3 times!\n'))
      process.exit()
    } else {
      console.log(colors.warn(`\nUpload fail count: ${failed.length}, try again...\n`))
      main(currentTryTimes + 1)
    }
  } else {
    console.log(
      colors.info(
        `\nUpload To ${host} Success in ${((Date.now() - startTime) / 1000).toFixed(2)}s !\n`
      )
    )
    process.exit()
  }
}

try {
  main()
} catch (e) {
  console.log(colors.error(e))
  process.exit()
}
