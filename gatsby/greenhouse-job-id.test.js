const { describe, test } = require('node:test')
const assert = require('node:assert/strict')
const getGreenhouseJobId = require('./greenhouse-job-id')

describe('getGreenhouseJobId', () => {
  test('reads gh_jid from a custom careers URL', () => {
    assert.equal(getGreenhouseJobId('https://careers.airbnb.com/positions/8120611?gh_jid=8120611'), '8120611')
  })

  test('reads gh_jid from a Greenhouse hosted URL', () => {
    assert.equal(getGreenhouseJobId('https://job-boards.greenhouse.io/greenhouse/jobs/8126988?gh_jid=8126988'), '8126988')
  })

  test('falls back to the /jobs/ path segment', () => {
    assert.equal(getGreenhouseJobId('https://boards.greenhouse.io/example/jobs/4567'), '4567')
  })

  test('returns null when there is no job ID', () => {
    assert.equal(getGreenhouseJobId(null), null)
    assert.equal(getGreenhouseJobId('not a url'), null)
    assert.equal(getGreenhouseJobId('https://careers.example.com/positions/'), null)
    assert.equal(getGreenhouseJobId('https://careers.example.com/?gh_jid=1%22%3E'), null)
  })
})
