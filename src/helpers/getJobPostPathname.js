

// gatsby-node.js adds a pathname field that stays unique when two jobs share a
// title, office and department. The rest is the old rule, for queries without it.
const getJobPostPathname = (node) => {
  if (node.pathname) return node.pathname

  const [office] = (node.offices) ? node.offices : []
  const officeSlug = (office) ? `${office.fields.slug}/` : ``
  const [department] = (node.departments) ? node.departments : []
  const departmentSlug = (department) ? `${department.fields.slug}/` : ``
  const jobSlug = `${node.fields.slug}`

  return `/${officeSlug}${departmentSlug}${jobSlug}`
}

export default getJobPostPathname