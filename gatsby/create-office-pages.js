const path = require(`path`)
const template = path.resolve(`src/templates/office-page.js`)

const createOfficePages = ({ actions, graphql }) => {
  const { createPage } = actions

  return new Promise((resolve, reject) => {
    resolve(
      graphql(`
      {
        allGreenhouseOffice {
          edges {
            node {
              id
              name
              location
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

        const officeNodes = result.data.allGreenhouseOffice.edges

        officeNodes.forEach(({ node }) => {
          const id = node.id
          const pathname = `/${node.fields.slug}/`

          createPage({
            path: pathname,
            component: template,
            context: {
              pathname: pathname,
              id: id
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

module.exports = createOfficePages