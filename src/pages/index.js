import React from 'react'

import Layout from '../components/layout'
import AllJobsList from '../components/listAllJobs'

const IndexPage = () => (
  <Layout>
    <h1>Open Positions</h1>
    <AllJobsList />
  </Layout>
)

export default IndexPage