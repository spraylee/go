// declare function require(name:string)
// import child_process = require('child_process')
var childProcess = require('child_process');
childProcess.execSync('npm run build', { stdio: 'inherit' });
