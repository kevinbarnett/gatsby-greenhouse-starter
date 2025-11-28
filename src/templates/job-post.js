import React from "react"
import { graphql } from "gatsby"
import he from 'he'
import Layout from "../components/layout"
import Form from "../components/applicationForm"





const JobForm = (job) => {
  if (!job.questions) return null

  if (job.embedGreenhouseForm) {
    return (
      <div id="grnhse_app"></div>
    )
  }

  return (
    <Form {...job} />
  )
}

// Simple sanitization function that works during SSR/build (no jsdom required)
const basicSanitize = (html) => {
  // Remove script and style tags completely
  html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
  html = html.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')

  // Remove event handlers (onclick, onerror, etc.)
  html = html.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '')
  html = html.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, '')

  // Remove javascript: protocol from links
  html = html.replace(/href\s*=\s*["']javascript:[^"']*["']/gi, 'href="#"')

  return html
}

const JobContent = (job) => {
  if (!job.content) return null

  let content = job.content

  // Decode HTML entities first (e.g., &lt; becomes <)
  content = he.decode(content)

  // Check if content contains HTML tags (after decoding)
  const hasHtmlTags = /<[a-z][\s\S]*>/i.test(content)

  // If content has HTML tags, sanitize and render as HTML
  if (hasHtmlTags) {
    // Use basic sanitization that works during SSR/build
    // This is safe enough for build-time, and DOMPurify can enhance on client if needed
    const sanitizedContent = basicSanitize(content)

    return (
      <div
        className="job-content"
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />
    )
  }

  // If content is plain text, convert newlines to <br> and render
  const textWithBreaks = content.split('\n').map((line, i) => (
    <React.Fragment key={i}>
      {line}
      {i < content.split('\n').length - 1 && <br />}
    </React.Fragment>
  ))

  return (
    <div className="job-content">{textWithBreaks}</div>
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
        <meta id="gh_id" name="gh:id" content={pageContext.gh_Id} />
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
      content
      questions {
        description
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