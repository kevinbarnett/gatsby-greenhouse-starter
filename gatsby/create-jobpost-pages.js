const path = require(`path`)
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
                gh_Id
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
          const gh_Id = node.gh_Id
          const [department] = node.departments // array always contains just one element
          const test = node.offices ? true : false

          if (!test) {
            console.log(node)
          }

          createPage({
            path: pathname,
            component: template,
            context: {
              embedGreenhouseForm: embedGreenhouseForm,
              greenhouseBoardToken: greenhouseBoardToken,
              pathname: pathname,
              id: id,
              gh_Id: gh_Id
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