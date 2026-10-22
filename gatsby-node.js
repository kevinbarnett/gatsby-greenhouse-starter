const slugify = require('slugify')

const { createFilePath, createFileNode } = require(`gatsby-source-filesystem`)
const path = require('path')

const createJobPostPages = require('./gatsby/create-jobpost-pages')
const createOfficePages = require('./gatsby/create-office-pages')
const createDepartmentPages = require('./gatsby/create-department-pages')
const sanitizeHtml = require('./gatsby/sanitize-html')


exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  // job nodes have a 'title' property, office and department nodes have a 'name' property
  const slugString = node.title || node.name
  const slugOptions = {
    replacement: '-',
    remove: RegExp(/[*+~.()'"!?:@]/g),
    lower: true,
    strict: true
  }

  if (slugString) {
    createNodeField({
      node,
      name: `slug`,
      value: `${slugify(slugString, slugOptions)}`,
    })
  }
}

exports.createPages = ({ actions, graphql }) => {
  return Promise.all([
    createJobPostPages({ actions, graphql }),
    createOfficePages({ actions, graphql }),
    createDepartmentPages({ actions, graphql })
  ])
}

// Sanitize Greenhouse HTML in Node at build time, so pages only ever receive safe HTML
exports.createResolvers = ({ createResolvers }) => {
  createResolvers({
    GreenhouseJob: {
      sanitizedContent: {
        type: 'String',
        resolve: (source) => sanitizeHtml(source.content),
      },
    },
    GreenhouseJobQuestions: {
      sanitizedDescription: {
        type: 'String',
        resolve: (source) => sanitizeHtml(source.description),
      },
    },
  })
}
