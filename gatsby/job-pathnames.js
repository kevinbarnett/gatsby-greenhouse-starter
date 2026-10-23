// A job's path is /office/department/job-title. Two jobs with the same title,
// office and department would get the same path and one page would overwrite
// the other. The oldest job (lowest Greenhouse ID) keeps the plain path, so
// posting a new duplicate never moves an existing page, and the others get
// their Greenhouse ID added to the end.
const getBasePathname = ({ officeSlug, departmentSlug, jobSlug }) => {
  const office = officeSlug ? `${officeSlug}/` : ``
  const department = departmentSlug ? `${departmentSlug}/` : ``
  return `/${office}${department}${jobSlug}`
}

const byAge = (a, b) => {
  const aId = a.greenhouseJobId ? Number(a.greenhouseJobId) : Infinity
  const bId = b.greenhouseJobId ? Number(b.greenhouseJobId) : Infinity
  if (aId !== bId) return aId < bId ? -1 : 1
  return a.id < b.id ? -1 : a.id > b.id ? 1 : 0
}

// jobs: [{ id, officeSlug, departmentSlug, jobSlug, greenhouseJobId }]
// Returns a Map of job id to its unique pathname
const getJobPathnames = (jobs) => {
  const groups = new Map()
  for (const job of jobs) {
    const basePathname = getBasePathname(job)
    if (!groups.has(basePathname)) groups.set(basePathname, [])
    groups.get(basePathname).push(job)
  }

  const pathnames = new Map()
  for (const [basePathname, group] of groups) {
    group.sort(byAge).forEach((job, index) => {
      const suffix = job.greenhouseJobId || index + 1
      pathnames.set(job.id, index === 0 ? basePathname : `${basePathname}-${suffix}`)
    })
  }
  return pathnames
}

module.exports = { getBasePathname, getJobPathnames }
