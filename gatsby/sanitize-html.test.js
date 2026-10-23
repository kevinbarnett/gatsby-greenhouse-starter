const { describe, test } = require('node:test')
const assert = require('node:assert/strict')
const sanitizeHtml = require('./sanitize-html')

describe('sanitizeHtml', () => {
  test('returns null for empty content', () => {
    assert.equal(sanitizeHtml(null), null)
    assert.equal(sanitizeHtml(undefined), null)
    assert.equal(sanitizeHtml(''), null)
  })

  test('keeps safe HTML as is', () => {
    const html =
      '<p data-lfile-container="60f0a594" data-pm-slice="1 1 []">Join <strong>us</strong> <a href="https://example.com">here</a></p><ul><li>One</li></ul>'
    assert.equal(sanitizeHtml(html), html)
  })

  test('decodes entity-encoded HTML before sanitizing', () => {
    assert.equal(
      sanitizeHtml('&lt;p&gt;Hello &amp;amp; welcome&lt;/p&gt;'),
      '<p>Hello &amp; welcome</p>'
    )
  })

  test('escapes plain text and keeps line breaks', () => {
    assert.equal(
      sanitizeHtml('Salary < 100k & bonus\nRemote "ok"'),
      'Salary &lt; 100k &amp; bonus<br />Remote &quot;ok&quot;'
    )
  })

  // Payloads that got past the old regex sanitizer or html-react-parser
  const payloads = {
    'script tag with trailing space': '<p>x</p><script >alert(1)</script >',
    'nested script tags': '<p>x</p><scr<script></script>ipt>alert(1)</script>',
    'unquoted javascript: link': '<a href=javascript:alert(1)>x</a>',
    'entity-encoded javascript: link': '<a href="JaVaScRiPt&colon;alert(1)">x</a>',
    'javascript: iframe': '<iframe src="javascript:alert(1)"></iframe>',
    'iframe srcdoc': '<iframe srcdoc="&lt;script&gt;alert(1)&lt;/script&gt;"></iframe>',
    'object with data URL': '<object data="data:text/html,<script>alert(1)</script>"></object>',
    'event handler': '<img src=x onerror="alert(1)">',
    'unquoted event handler': '<p onmouseover=alert(1)>x</p>',
    'svg event handler': '<svg><a><animate attributeName=href values=javascript:alert(1) /></a></svg>',
    'javascript: form action': '<form action="javascript:alert(1)"><button>x</button></form>',
    'phishing form': '<form action="https://evil.example"><input name="password"></form>',
    'style tag': '<style>body { display: none }</style><p>x</p>',
    'entity-encoded script': '&lt;script&gt;alert(1)&lt;/script&gt;<p>x</p>',
  }

  for (const [name, payload] of Object.entries(payloads)) {
    test(`removes ${name}`, () => {
      const output = sanitizeHtml(payload)
      assert.doesNotMatch(output, /<(script|iframe|object|embed|form|input|button|style)\b/i)
      assert.doesNotMatch(output, /\son\w+\s*=/i)
      assert.doesNotMatch(output, /javascript:/i)
      assert.doesNotMatch(output, /srcdoc/i)
    })
  }
})
