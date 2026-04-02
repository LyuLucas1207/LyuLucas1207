/**
 * Merges mock/data/*.json into mock/db.json for json-server v1+
 * (v1 expects JSON, not a CommonJS module.)
 */
const fs = require('node:fs')
const path = require('node:path')

const dir = __dirname
const profile = require(path.join(dir, 'data/profile.json'))
const projects = require(path.join(dir, 'data/projects.json'))
const highlights = require(path.join(dir, 'data/highlights.json'))
const timeline = require(path.join(dir, 'data/timeline.json'))
const lifeRecords = require(path.join(dir, 'data/lifeRecords.json'))
const lifeTimeline = require(path.join(dir, 'data/lifeTimeline.json'))

const db = {
  profile,
  projects,
  highlights,
  timeline,
  lifeRecords,
  lifeTimeline,
}

fs.writeFileSync(path.join(dir, 'db.json'), `${JSON.stringify(db, null, 2)}\n`, 'utf8')
console.log('[mock] wrote mock/db.json')
