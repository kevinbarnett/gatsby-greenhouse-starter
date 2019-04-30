import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import getJobPostPathname from "../helpers/getJobPostPathname"

export default ({data}) => {
  const department = data.greenhouseDepartment
  const hasJobs = Boolean(department.jobs && department.jobs.length)

  return (
    <Layout>
      <h1>{department.name}</h1>
      <ul>
      {console.log(department)}
      {hasJobs && department.jobs.map(job =>
        <li key={job.id} className='job'>
          <a href={getJobPostPathname(job)}>{job.title}</a> ({job.location.name})
        </li>
      )}
      </ul>
    </Layout>
  )
}

export const query = graphql`
  query DepartmentPageQuery($id: String!) {
    greenhouseDepartment(id: { eq: $id }) {
      name
      jobs {
        id
        title
        location {
          name
        }
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