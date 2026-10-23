const { describe, test } = require('node:test')
const assert = require('node:assert/strict')
const { getBasePathname, getJobPathnames } = require('./job-pathnames')

const job = (id, greenhouseJobId, jobSlug = 'product-manager') => ({
  id,
  greenhouseJobId,
  officeSlug: 'brazil',
  departmentSlug: 'product',
  jobSlug,
})

describe('getBasePathname', () => {
  test('joins office, department and job slugs', () => {
    assert.equal(getBasePathname(job('a', '1')), '/brazil/product/product-manager')
  })

  test('leaves out a missing office or department', () => {
    assert.equal(getBasePathname({ jobSlug: 'designer' }), '/designer')
    assert.equal(getBasePathname({ departmentSlug: 'design', jobSlug: 'designer' }), '/design/designer')
  })
})

describe('getJobPathnames', () => {
  test('keeps the plain path for unique jobs', () => {
    const pathnames = getJobPathnames([job('a', '10', 'designer'), job('b', '20', 'engineer')])
    assert.equal(pathnames.get('a'), '/brazil/product/designer')
    assert.equal(pathnames.get('b'), '/brazil/product/engineer')
  })

  test('gives the oldest duplicate the plain path and adds the ID to the others', () => {
    const pathnames = getJobPathnames([job('a', '8120721'), job('b', '8120611'), job('c', '9000000')])
    assert.equal(pathnames.get('b'), '/brazil/product/product-manager')
    assert.equal(pathnames.get('a'), '/brazil/product/product-manager-8120721')
    assert.equal(pathnames.get('c'), '/brazil/product/product-manager-9000000')
  })

  test('does not depend on the order jobs come in', () => {
    const jobs = [job('a', '30'), job('b', '10'), job('c', '20')]
    const forward = getJobPathnames(jobs)
    const backward = getJobPathnames([...jobs].reverse())
    assert.deepEqual([...forward].sort(), [...backward].sort())
  })

  test('gives every job a unique path, even without a Greenhouse ID', () => {
    const jobs = [job('a', null), job('b', '5'), job('c', null)]
    const pathnames = [...getJobPathnames(jobs).values()]
    assert.equal(new Set(pathnames).size, jobs.length)
    assert.equal(getJobPathnames(jobs).get('b'), '/brazil/product/product-manager')
  })
})
