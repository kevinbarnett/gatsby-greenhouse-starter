import React from 'react'
import { StaticQuery, graphql } from 'gatsby'
import getJobPostPathname from "../helpers/getJobPostPathname"

const JobListing = ({jobNode, departmentNode, officeNode}) => {
  const href = getJobPostPathname(jobNode)
  return (
    <li className='job'>
      <a href={href}>{jobNode.title}</a>
    </li>
  )
}

const DepartmentListing = ({departmentNode, officeNode}) => {
  const href = `/${departmentNode.fields.slug}/`
  const jobs = departmentNode.jobs ? departmentNode.jobs.filter(job => {
    // if (job.offices) {
    //   return (job.offices.filter(office => office.id === officeNode.id).length)
    // } else {
    //   console.warn(`${job.id} "${job.title}": requires an office to be displayed in this list`)
    //   return null
    // }
    return job.offices ? (job.offices.filter(office => office.id === officeNode.id).length) : false
  }) : []
  const hasJobs = Boolean(jobs && jobs.length)

  if (!hasJobs) {
    return null
  }

  return (
    <div className='department'>
      <h3 className='department-name'><a href={href}>{departmentNode.name}</a></h3>
      <ul>
        {jobs.map((node) => 
          <JobListing key={node.id} jobNode={node} departmentNode={departmentNode} officeNode={officeNode} />
        )}
      </ul>
    </div>
  )
}

const OfficeListing = ({officeNode}) => {
  const hasJobs = Boolean(officeNode.jobs && officeNode.jobs.length)
  const href = `/${officeNode.fields.slug}/`
  

  if (!hasJobs) {
    return null
  }

  return (
    <div className='office'>
      <h2 className='office-name'><a href={href}>{officeNode.name}</a></h2>
      {officeNode.departments.map((node) => 
        <DepartmentListing key={node.id} departmentNode={node} officeNode={officeNode} />
      )}
    </div>
  )
}

const AllJobsList = () => (
  <StaticQuery
    query={graphql`
      query {
        allGreenhouseOffice {
          edges {
            node {
              name
              id
              fields {
                slug
              }
              jobs {
                id
              }
              departments {
                id
                name
                fields {
                  slug
                }
                jobs {
                  ...JobQueryFragment
                }
              }
            }
          }
        }
      }
    `}
    render={data => (
      <div className='all-jobs-list'>
        {data.allGreenhouseOffice.edges.map(({node}) => 
          <OfficeListing key={node.id} officeNode={node} />
        )}
      </div>
    )}
  />
)

export default AllJobsList