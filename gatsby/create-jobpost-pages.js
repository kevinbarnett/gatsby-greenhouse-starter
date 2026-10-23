const path = require(`path`)
const getGreenhouseJobId = require(`./greenhouse-job-id`)
const template = path.resolve(`src/templates/job-post.js`)


const getPathname = (node) => {
  const [office] = (node.offices) ? node.offices : []
  const officeSlug = (office) ? `${office.fields.slug}/` : ``
  const [department] = (node.departments) ? node.departments : []
  const departmentSlug = (department) ? `${department.fields.slug}/` : ``
  const jobSlug = `${node.fields.slug}`

  return `/${officeSlug}${departmentSlug}${jobSlug}`
}

const createJobPostPages = ({ actions, graphql }) => {
  const { createPage } = actions

  return new Promise((resolve, reject) => {
    resolve(
      graphql(`
        {
          site {
            siteMetadata {
              embedGreenhouseForm
              greenhouseBoardToken
            }
          }
          allGreenhouseJob {
            edges {
              node {
                id
                internal_job_id
                title
                absolute_url
                offices {
                  fields {
                    slug
                  }
                }
                departments {
                  fields {
                    slug
                  }
                }
                fields {
                  slug
                }
              }
            }
          }
        }
      `).then(result => {
        if (result.errors) {
          console.error(result.errors)
          reject(result.errors)
        }

        const jobNodes = result.data.allGreenhouseJob.edges
        const embedGreenhouseForm = Boolean(result.data.site.siteMetadata.embedGreenhouseForm)
        const greenhouseBoardToken = result.data.site.siteMetadata.greenhouseBoardToken

        jobNodes.forEach(({ node }) => {
          const pathname = getPathname(node)
          const id = node.id
          const greenhouseJobId = getGreenhouseJobId(node.absolute_url)

          if (embedGreenhouseForm && !greenhouseJobId) {
            console.warn(`No Greenhouse job ID in ${node.absolute_url}, the application form for "${node.title}" won't load`)
          }

          createPage({
            path: pathname,
            component: template,
            context: {
              embedGreenhouseForm: embedGreenhouseForm,
              greenhouseBoardToken: greenhouseBoardToken,
              pathname: pathname,
              id: id,
              internal_job_id: node.internal_job_id,
              greenhouseJobId: greenhouseJobId
            }
          })
        })
      })
    )
    .catch(reason => {
      console.error(reason)
      process.exit(1);
    })
  })
}

module.exports = createJobPostPages