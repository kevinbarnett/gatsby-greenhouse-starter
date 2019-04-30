const path = require(`path`)
const template = path.resolve(`src/templates/department-page.js`)

const createDepartmentPages = ({ actions, graphql }) => {
  const { createPage } = actions

  return new Promise((resolve, reject) => {
    resolve(
      graphql(`
      {
        allGreenhouseDepartment {
          edges {
            node {
              id
              name
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

        result.data.allGreenhouseDepartment.edges.forEach(({ node }) => {
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

module.exports = createDepartmentPages