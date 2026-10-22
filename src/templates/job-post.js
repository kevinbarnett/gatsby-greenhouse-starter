import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import Form from "../components/applicationForm"





const JobForm = (job) => {
  if (!job.questions) return null

  if (job.embedGreenhouseForm) {
    // The Greenhouse embed script injects its iframe here, often before React
    // hydrates. An empty dangerouslySetInnerHTML tells React not to check or
    // touch the children, which avoids a hydration mismatch.
    return (
      <div id="grnhse_app" dangerouslySetInnerHTML={{ __html: '' }} />
    )
  }

  return (
    <Form {...job} />
  )
}

// sanitizedContent is produced at build time, see gatsby/sanitize-html.js
const JobContent = (job) => {
  if (!job.sanitizedContent) return null

  return (
    <div
      className="job-content"
      dangerouslySetInnerHTML={{ __html: job.sanitizedContent }}
    />
  )
}

const JobTitle = (job) => {
  if (!job.title) return null

  // Title is usually plain text, no need to parse HTML
  return (
    <h1>{job.title}</h1>
  )
}


const JobPost = ({ data, pageContext }) => {
  const job = data.greenhouseJob

  if (pageContext.embedGreenhouseForm) {
    job.embedGreenhouseForm = pageContext.embedGreenhouseForm
  }

  return (
    <Layout>
      <JobTitle {...job} />
      <JobContent {...job} />
      <JobForm {...job} />
    </Layout>
  )
}

export function Head({ data, pageContext }) {
  const job = data.greenhouseJob
  const siteMetadata = data.site.siteMetadata

  const title = job.title || siteMetadata.title
  const fullTitle = siteMetadata.titleTemplate
    ? siteMetadata.titleTemplate.replace('%s', title)
    : title
  const canonical = `${siteMetadata.hostUrl}${pageContext.pathname || '/'}`
  const description = job.description || siteMetadata.description

  const headElements = (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
    </>
  )

  // Add Greenhouse form scripts and meta if needed
  if (pageContext.embedGreenhouseForm) {
    return (
      <>
        {headElements}
        <script
          src={`https://boards.greenhouse.io/embed/job_board/js?for=${pageContext.greenhouseBoardToken}`}
          type="text/javascript"
          async
        />
        <script src="/job-post.js" type="text/javascript" defer />
        <meta id="gh_id" name="gh:id" content={pageContext.internal_job_id} />
      </>
    )
  }

  return headElements
}

export default JobPost

export const query = graphql`
  query JobPostQuery($id: String!) {
    site {
      siteMetadata {
        title
        titleTemplate
        description
        hostUrl
      }
    }
    greenhouseJob(id: { eq: $id }) {
      title
      sanitizedContent
      questions {
        sanitizedDescription
        label
        required
        fields {
          name
          type
          values {
            label
            value
          }
        }
      }
    }
  }
`