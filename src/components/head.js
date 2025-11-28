import React from "react";
import { useStaticQuery, graphql } from "gatsby";
import Helmet from "react-helmet";

const Head = ({
  pageTitle = null,
  pageDescription = null,
  pagePathname = null,
  pageScripts = [],
  pageMeta = []
}) => {
  const data = useStaticQuery(graphql`
    query HeadMetaQuery {
      site {
        siteMetadata {
          defaultTitle: title
          defaultDescription: description
          hostUrl: hostUrl
          titleTemplate
        }
      }
    }
  `)

  const {
    site: {
      siteMetadata: {
        defaultTitle,
        titleTemplate,
        defaultDescription,
        hostUrl,
      },
    },
  } = data

  const title = pageTitle || defaultTitle
  const canonical = `${hostUrl}${pagePathname || '/'}`
  const description = pageDescription || defaultDescription
  const metaDescription = [{name: "description", content: description}]
  const meta = [...pageMeta, ...metaDescription]
  const scripts = [...pageScripts]

  return (
    <React.Fragment>
      <Helmet title={title} titleTemplate={titleTemplate} script={scripts} meta={meta}>
        <html lang="en" />
        <link rel="canonical" href={canonical} />
      </Helmet>
    </React.Fragment>
  );
}


export default Head