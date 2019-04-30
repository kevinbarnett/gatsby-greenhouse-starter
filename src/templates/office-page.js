import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import getJobPostPathname from "../helpers/getJobPostPathname"

export default ({data}) => {
  const office = data.greenhouseOffice
  const hasJobs = Boolean(office.jobs && office.jobs.length)

  return (
    <Layout>
      <h1>{office.name}</h1>
      <h2>{office.location}</h2>
      <ul>
      {hasJobs && office.jobs.map(job =>
        <li key={job.id} className='job'>
          <a href={getJobPostPathname(job)}>{job.title}</a>
        </li>
      )}
      </ul>
    </Layout>
  )
}

export const query = graphql`
  query OfficePageQuery($id: String!) {
    greenhouseOffice(id: { eq: $id }) {
      name
      location
      jobs {
        id
        title
        fields {
          slug
        }
        departments {
          fields {
            slug
          }
        }
        offices {
          fields {
            slug
          }
        }
      }
    }
  }
`