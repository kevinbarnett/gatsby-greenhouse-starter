const slugify = require('slugify')

const { createFilePath, createFileNode } = require(`gatsby-source-filesystem`)
const path = require('path')

const createJobPostPages = require('./gatsby/create-jobpost-pages')
const createOfficePages = require('./gatsby/create-office-pages')
const createDepartmentPages = require('./gatsby/create-department-pages')
const sanitizeHtml = require('./gatsby/sanitize-html')
const getGreenhouseJobId = require('./gatsby/greenhouse-job-id')
const { getJobPathnames } = require('./gatsby/job-pathnames')


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

// Paths depend on every job, since duplicates need telling apart, see gatsby/job-pathnames.js
const getAllJobPathnames = async (nodeModel) => {
  const { entries } = await nodeModel.findAll({ type: 'GreenhouseJob' })
  const firstSlug = (ids) => {
    const [id] = ids || []
    const node = id ? nodeModel.getNodeById({ id }) : null
    return node && node.fields ? node.fields.slug : null
  }

  return getJobPathnames(Array.from(entries, (job) => ({
    id: job.id,
    officeSlug: firstSlug(job.offices___NODE),
    departmentSlug: firstSlug(job.departments___NODE),
    jobSlug: job.fields.slug,
    greenhouseJobId: getGreenhouseJobId(job.absolute_url),
  })))
}

// Sanitize Greenhouse HTML in Node at build time, so pages only ever receive safe HTML
exports.createResolvers = ({ createResolvers }) => {
  createResolvers({
    GreenhouseJob: {
      pathname: {
        type: 'String',
        resolve: async (source, args, context) => {
          const pathnames = await getAllJobPathnames(context.nodeModel)
          return pathnames.get(source.id)
        },
      },
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
