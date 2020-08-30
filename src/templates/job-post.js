import React from "react"
import { graphql } from "gatsby"
import ReactHtmlParser from "react-html-parser"
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

  return (
    <div dangerouslySetInnerHTML={{ __html: ReactHtmlParser(job.content) }} />
  )
}

const JobTitle = (job) => {
  if (!job.title) return null

  return (
    <h1>{job.title}</h1>
  )
}


export default ({data, pageContext}) => {
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
    },{
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