import { graphql } from 'gatsby'

export const jobQueryFragment = graphql`
  fragment JobQueryFragment on GreenhouseJob {
    id
    title
    absolute_url
    internal_job_id
    updated_at
    offices {
      id
      fields {
        slug
      }
    }
    location {
      name
    }
    departments {
      fields {
        slug
      }
    }
    fields {
      slug
    }
  }
`

export const departmentQueryFragment = graphql`
  fragment DepartmentQueryFragment on GreenhouseDepartment {
    name
  }
`