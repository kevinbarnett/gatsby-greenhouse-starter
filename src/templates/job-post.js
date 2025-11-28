import React from "react"
import { graphql } from "gatsby"
import DOMPurify from 'isomorphic-dompurify'
import he from 'he'
import Layout from "../components/layout"
import Head from "../components/head"
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

const JobContent = (job) => {
  if (!job.content) return null

  let content = job.content

  // Decode HTML entities first (e.g., &lt; becomes <)
  content = he.decode(content)

  // Check if content contains HTML tags (after decoding)
  const hasHtmlTags = /<[a-z][\s\S]*>/i.test(content)

  // If content has HTML tags, sanitize and render as HTML
  if (hasHtmlTags) {
    const sanitizedContent = DOMPurify.sanitize(content, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a', 'blockquote', 'div', 'span'],
      ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'id']
    })

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
  const head = {
    pageTitle: job.title,
    pageDescription: job.description,
    pagePathname: pageContext.pathname
  }

  if (pageContext.embedGreenhouseForm) {
    job.embedGreenhouseForm = pageContext.embedGreenhouseForm
    head.pageScripts = [{
      src: `https://boards.greenhouse.io/embed/job_board/js?for=${pageContext.greenhouseBoardToken}`,
      type: "text/javascript",
      async: true
    }, {
      src: "/job-post.js",
      type: "text/javascript",
      defer: true
    }]
    head.pageMeta = [{
      id: "gh_id",
      name: "gh:id",
      content: pageContext.gh_Id,
    }]
  }
  return (
    <Layout>
      <Head {...head} />
      <JobTitle {...job} />
      <JobContent {...job} />
      <JobForm {...job} />
    </Layout>
  )
}

export default JobPost

export const query = graphql`
  query JobPostQuery($id: String!) {
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