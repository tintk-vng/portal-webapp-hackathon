const fs = require('fs')
const path = require('path')
const { spawn } = require('child_process')

const root = path.resolve(__dirname, '..')
const logPath = path.join(root, 'dev-server.log')
const errPath = path.join(root, 'dev-server.err.log')
const pidPath = path.join(root, 'dev-server.pid')

const env = {}
for (const [key, value] of Object.entries(process.env)) {
  if (key.toLowerCase() !== 'path') {
    env[key] = value
  }
}
env.Path = process.env.Path || process.env.PATH || ''
env.NEXT_DIST_DIR = process.env.NEXT_DIST_DIR || 'next-build-temp'
env.NODE_PATH = [path.join(root, 'node_modules'), process.env.NODE_PATH].filter(Boolean).join(path.delimiter)

const out = fs.openSync(logPath, 'a')
const err = fs.openSync(errPath, 'a')
const nextBin = path.join(root, 'node_modules', 'next', 'dist', 'bin', 'next')
const port = process.argv[2] || '8090'

const child = spawn(process.execPath, [nextBin, 'start', '-p', port], {
  cwd: root,
  detached: true,
  env,
  stdio: ['ignore', out, err],
  windowsHide: true,
})

child.unref()
fs.writeFileSync(pidPath, `${child.pid}\n`, 'utf8')
console.log(`Started napthevui-study-local on port ${port} with process ${child.pid}.`)
