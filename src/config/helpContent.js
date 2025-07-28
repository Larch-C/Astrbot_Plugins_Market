import helpMarkdown from './help.md?raw'

function parseMd(markdown) {
  const lines = markdown.split('\n')
  let title = ''
  const sections = []
  let currentSection = null

  lines.forEach(line => {
    // 提取一级标题作为总标题
    if (line.startsWith('# ')) {
      title = line.slice(2).trim()
    }
    // 提取二级标题作为章节标题
    else if (line.startsWith('## ')) {
      if (currentSection) {
        sections.push({ ...currentSection, content: currentSection.content.trim() })
      }
      currentSection = {
        title: line.slice(3).trim(),
        content: ''
      }
    }
    // 其他行作为内容
    else if (currentSection && line.trim()) {
      currentSection.content += line + ' '
    }
  })

  // 添加最后一个章节
  if (currentSection) {
    sections.push({ ...currentSection, content: currentSection.content.trim() })
  }

  return { title, sections }
}

export const helpContent = parseMd(helpMarkdown)
