// The Greenhouse embed needs the job post ID, which the source plugin replaces
// with a Gatsby node ID. Greenhouse puts it in absolute_url, either as the
// gh_jid parameter (https://careers.example.com/jobs?gh_jid=123) or in the path
// (https://job-boards.greenhouse.io/example/jobs/123).
const getGreenhouseJobId = (absoluteUrl) => {
  if (!absoluteUrl) return null

  let url
  try {
    url = new URL(absoluteUrl)
  } catch {
    return null
  }

  const id = url.searchParams.get('gh_jid') || url.pathname.match(/\/jobs\/(\d+)/)?.[1]
  return /^\d+$/.test(id) ? id : null
}

module.exports = getGreenhouseJobId
