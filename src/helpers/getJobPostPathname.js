

const getJobPostPathname = (node) => {
  const [office] = (node.offices) ? node.offices : []
  const officeSlug = (office) ? `${office.fields.slug}/` : ``
  const [department] = (node.departments) ? node.departments : []
  const departmentSlug = (department) ? `${department.fields.slug}/` : ``
  const jobSlug = `${node.fields.slug}`

  return `/${officeSlug}${departmentSlug}${jobSlug}`
}

export default getJobPostPathname