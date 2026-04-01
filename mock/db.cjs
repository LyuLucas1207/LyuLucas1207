const profile = require('./data/profile.json')
const projects = require('./data/projects.json')
const highlights = require('./data/highlights.json')
const timeline = require('./data/timeline.json')
const lifeRecords = require('./data/lifeRecords.json')

module.exports = () => ({
  profile,
  projects,
  highlights,
  timeline,
  lifeRecords,
})
