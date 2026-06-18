const { execFileSync } = require('child_process')
const fs = require('fs')
const os = require('os')
const path = require('path')

const root = path.resolve(__dirname, '..')
const nextBin = require.resolve('next/dist/bin/next')
const tsconfigPath = path.join(root, 'tsconfig.json')
const tempBuildLinkName = 'next-build-temp'

function ensureTempBuildJunction() {
  const linkPath = path.join(root, tempBuildLinkName)

  try {
    fs.rmSync(linkPath, { recursive: true, force: true })
    fs.mkdirSync(linkPath, { recursive: true })
    return tempBuildLinkName
  } catch {
    // App root may be read-only (e.g. Docker production).
    // Fall back to a temp directory.
    const fallback = path.join(os.tmpdir(), tempBuildLinkName)
    fs.rmSync(fallback, { recursive: true, force: true })
    fs.mkdirSync(fallback, { recursive: true })
    return fallback
  }
}

function buildDistName() {
  if (process.env.NEXT_DIST_DIR) {
    return process.env.NEXT_DIST_DIR
  }

  return ensureTempBuildJunction()
}

function runNextBuild() {
  const originalTsconfig = fs.existsSync(tsconfigPath) ? fs.readFileSync(tsconfigPath, 'utf8') : undefined

  try {
    execFileSync(process.execPath, [nextBin, 'build'], {
      cwd: root,
    env: {
      ...process.env,
      NEXT_DIST_DIR: buildDistName(),
    },
      stdio: 'pipe'
    })
  } finally {
    if (originalTsconfig !== undefined) {
      fs.writeFileSync(tsconfigPath, originalTsconfig, 'utf8')
    }
  }
}

if (require.main === module) {
  runNextBuild()
}

module.exports = {
  runNextBuild
}
