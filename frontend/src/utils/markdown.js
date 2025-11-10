import MarkdownIt from 'markdown-it'

const md = new MarkdownIt({
  html: false, // Disable HTML tags in source for security
  linkify: true, // Auto-convert URL-like text to links
  typographer: true, // Enable smartquotes and other typographic replacements
  breaks: true // Convert '\n' in paragraphs into <br>
})

export function renderMarkdown(text) {
  if (!text) return ''
  return md.render(text)
}

export function renderInline(text) {
  if (!text) return ''
  return md.renderInline(text)
}
