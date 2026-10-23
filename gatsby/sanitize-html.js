const he = require('he')
const DOMPurify = require('isomorphic-dompurify')

const FORBIDDEN_TAGS = ['form', 'input', 'button', 'select', 'textarea', 'style']

// Greenhouse returns job content and question descriptions as HTML, sometimes
// entity-encoded (e.g. &lt;p&gt;) and sometimes plain text. Either way, return
// HTML that is safe to render with dangerouslySetInnerHTML.
const sanitizeHtml = (content) => {
  if (!content) return null

  const decoded = he.decode(content)
  const hasHtmlTags = /<[a-z][\s\S]*>/i.test(decoded)

  if (hasHtmlTags) {
    // Job content never needs forms or styles, and both can be abused for
    // phishing or defacing the page even without scripts
    return DOMPurify.sanitize(decoded, { FORBID_TAGS: FORBIDDEN_TAGS })
  }

  return he.escape(decoded).replace(/\n/g, '<br />')
}

module.exports = sanitizeHtml
