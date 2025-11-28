import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import "../components/queryFragments"

// filter:{jobs:{elemMatch:{id:{ne:0}}}}


const JobsListing = ({node: job}) => {
  return (
    <li key={job.id} className='jobs-list-item'>
      {job.title} ({job.location.name})
    </li>
  )
}

const DepartmentsListing = ({node: department}) => {
  const hasJobs = Boolean(department.jobs && department.jobs.length)
  
  if (!hasJobs) {
    return null
  }

  return (
    <li key={department.id} className='departments-list-item'>
      <div className='department-list-item-name'>{department.name}</div>
      {hasJobs &&
        <ul className='jobs-list'>
          {department.jobs.map((node) => <JobsListing node={node} />)}
        </ul>
      }
    </li>
  )
}



const DepartmentsList = () => {
  const data = useStaticQuery(graphql`
    query {
      allGreenhouseDepartment {
        edges {
          node {
            name,
            jobs {
              ...JobQueryFragment
            }
          }
        }
      }
    }
  `)

  return (
    <ul className='departments-list'>
      {data.allGreenhouseDepartment.edges.map((edge) => <DepartmentsListing key={edge.node.name} node={edge.node} />)}
    </ul>
  )
}

export default DepartmentsList