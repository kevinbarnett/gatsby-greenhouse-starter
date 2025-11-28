module.exports = {
  siteMetadata: {
    title: 'Gatsby + Greenhouse Job Board',
    titleTemplate: '%s · Gatsby + Greenhouse',
    description: 'An example of how to use Gatsby and the Greenhouse Job Board API for your company\'s careers website',
    keywords: 'gatsby, greenhouse, jobs, careers',
    hostUrl: 'https://inspiring-hodgkin-1eba1b.netlify.com',
    embedGreenhouseForm: true,
    greenhouseBoardToken: 'greenhouse'
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'Gatsby + Greenhouse Job Board',
        short_name: 'Gatsby + Greenhouse',
        start_url: '/',
        background_color: '#ff6600',
        theme_color: '#ff6600',
        display: 'minimal-ui',
        icon: 'src/images/gatsby-icon.png', // This path is relative to the root of the site.
      },
    },
    {
      resolve: 'gatsby-source-greenhouse-job-board',
      options: {
        boardToken: 'airbnb'
      },
    },
    'gatsby-plugin-offline',
  ],
}
