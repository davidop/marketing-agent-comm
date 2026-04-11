import jsPDF from 'jspdf'
import type { CampaignOutput } from './types'

type SectionKey = keyof CampaignOutput

interface SectionExportOptions {
  sectionName: string
  sectionData: any
  language: 'es' | 'en'
  format: 'pdf' | 'html' | 'word' | 'json' | 'text'
}

export const exportSection = ({ sectionName, sectionData, language, format }: SectionExportOptions) => {
  const timestamp = new Date().toISOString().split('T')[0]
  const fileName = `${sectionName.toLowerCase().replace(/\s+/g, '-')}-${timestamp}`

  switch (format) {
    case 'pdf':
      return exportSectionToPDF({ sectionName, sectionData, language, fileName })
    case 'html':
      return exportSectionToHTML({ sectionName, sectionData, language, fileName })
    case 'word':
      return exportSectionToWord({ sectionName, sectionData, language, fileName })
    case 'json':
      return exportSectionToJSON({ sectionName, sectionData, fileName })
    case 'text':
      return exportSectionToText({ sectionName, sectionData, fileName })
    default:
      throw new Error(`Unsupported format: ${format}`)
  }
}

const exportSectionToPDF = ({ sectionName, sectionData, language, fileName }: any) => {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 20
  const maxWidth = pageWidth - (margin * 2)
  let yPosition = margin

  const addPageIfNeeded = (requiredSpace: number = 20) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      doc.addPage()
      yPosition = margin
      return true
    }
    return false
  }

  const addText = (text: string, fontSize: number = 10, isBold: boolean = false, color: [number, number, number] = [0, 0, 0]) => {
    doc.setFontSize(fontSize)
    doc.setFont('helvetica', isBold ? 'bold' : 'normal')
    doc.setTextColor(...color)
    
    const lines = doc.splitTextToSize(text, maxWidth)
    lines.forEach((line: string) => {
      addPageIfNeeded()
      doc.text(line, margin, yPosition)
      yPosition += fontSize * 0.5
    })
    yPosition += 3
  }

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.setTextColor(94, 179, 161)
  doc.text(sectionName, margin, yPosition)
  yPosition += 10

  doc.setFontSize(9)
  doc.setTextColor(100, 100, 100)
  doc.text(new Date().toLocaleString(language === 'es' ? 'es-ES' : 'en-US'), margin, yPosition)
  yPosition += 15

  if (typeof sectionData === 'string') {
    addText(sectionData, 10, false)
  } else if (Array.isArray(sectionData)) {
    sectionData.forEach((item, idx) => {
      addPageIfNeeded(30)
      addText(`${language === 'es' ? 'Elemento' : 'Item'} ${idx + 1}`, 12, true, [94, 179, 161])
      yPosition += 2
      
      if (typeof item === 'string') {
        addText(item, 10, false)
      } else if (typeof item === 'object') {
        Object.entries(item).forEach(([key, value]) => {
          if (value && typeof value !== 'object') {
            addText(`${key}: ${value}`, 10, false)
          }
        })
      }
      yPosition += 5
    })
  } else if (typeof sectionData === 'object' && sectionData !== null) {
    Object.entries(sectionData).forEach(([key, value]) => {
      addPageIfNeeded(20)
      addText(key, 11, true, [94, 179, 161])
      
      if (typeof value === 'string') {
        addText(value, 10, false)
      } else if (Array.isArray(value)) {
        value.forEach((item, idx) => {
          if (typeof item === 'string') {
            addText(`• ${item}`, 10, false)
          } else {
            addText(`${idx + 1}. ${JSON.stringify(item)}`, 10, false)
          }
        })
      } else if (typeof value === 'object' && value !== null) {
        addText(JSON.stringify(value, null, 2), 9, false)
      } else {
        addText(String(value), 10, false)
      }
      yPosition += 3
    })
  }

  doc.save(`${fileName}.pdf`)
}

const exportSectionToHTML = ({ sectionName, sectionData, language, fileName }: any) => {
  let htmlContent = ''

  if (typeof sectionData === 'string') {
    htmlContent = `<p>${sectionData.replace(/\n/g, '<br>')}</p>`
  } else if (Array.isArray(sectionData)) {
    htmlContent = '<div class="section-list">'
    sectionData.forEach((item, idx) => {
      htmlContent += `<div class="list-item"><h3>${language === 'es' ? 'Elemento' : 'Item'} ${idx + 1}</h3>`
      if (typeof item === 'string') {
        htmlContent += `<p>${item}</p>`
      } else if (typeof item === 'object') {
        htmlContent += '<dl>'
        Object.entries(item).forEach(([key, value]) => {
          if (value && typeof value !== 'object') {
            htmlContent += `<dt>${key}</dt><dd>${value}</dd>`
          }
        })
        htmlContent += '</dl>'
      }
      htmlContent += '</div>'
    })
    htmlContent += '</div>'
  } else if (typeof sectionData === 'object' && sectionData !== null) {
    htmlContent = '<dl>'
    Object.entries(sectionData).forEach(([key, value]) => {
      htmlContent += `<dt>${key}</dt>`
      if (typeof value === 'string') {
        htmlContent += `<dd>${value.replace(/\n/g, '<br>')}</dd>`
      } else if (Array.isArray(value)) {
        htmlContent += '<dd><ul>'
        value.forEach(item => {
          htmlContent += `<li>${typeof item === 'string' ? item : JSON.stringify(item)}</li>`
        })
        htmlContent += '</ul></dd>'
      } else {
        htmlContent += `<dd><pre>${JSON.stringify(value, null, 2)}</pre></dd>`
      }
    })
    htmlContent += '</dl>'
  }

  const fullHTML = `
<!DOCTYPE html>
<html lang="${language}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${sectionName}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #f5f7fa;
      padding: 40px 20px;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
      background: white;
      padding: 60px;
      border-radius: 12px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    }
    h1 {
      font-size: 36px;
      color: #5eb3a1;
      margin-bottom: 12px;
      font-weight: 700;
    }
    .timestamp {
      color: #6b7280;
      font-size: 14px;
      margin-bottom: 32px;
      padding-bottom: 16px;
      border-bottom: 2px solid #e5e7eb;
    }
    h3 {
      font-size: 20px;
      color: #1f2937;
      margin-top: 24px;
      margin-bottom: 12px;
      font-weight: 600;
    }
    p {
      margin-bottom: 16px;
      color: #374151;
      line-height: 1.8;
    }
    dl {
      margin-bottom: 24px;
    }
    dt {
      font-weight: 600;
      color: #5eb3a1;
      margin-top: 16px;
      margin-bottom: 8px;
      font-size: 16px;
    }
    dd {
      margin-left: 0;
      padding-left: 20px;
      color: #4b5563;
      line-height: 1.8;
    }
    ul {
      list-style: disc;
      margin-left: 40px;
      margin-top: 8px;
    }
    li {
      margin-bottom: 8px;
      color: #4b5563;
    }
    pre {
      background: #f3f4f6;
      padding: 16px;
      border-radius: 8px;
      overflow-x: auto;
      font-size: 13px;
      line-height: 1.6;
      border: 1px solid #e5e7eb;
    }
    .section-list {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    .list-item {
      border-left: 4px solid #5eb3a1;
      padding-left: 20px;
      padding-top: 8px;
      padding-bottom: 8px;
    }
    @media print {
      body { background: white; padding: 0; }
      .container { box-shadow: none; padding: 20px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>${sectionName}</h1>
    <div class="timestamp">${new Date().toLocaleString(language === 'es' ? 'es-ES' : 'en-US')}</div>
    ${htmlContent}
  </div>
</body>
</html>
  `

  const blob = new Blob([fullHTML], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${fileName}.html`
  link.click()
  URL.revokeObjectURL(url)
}

const exportSectionToWord = ({ sectionName, sectionData, language, fileName }: any) => {
  let content = `<h1>${sectionName}</h1>`
  content += `<p style="color: #666; font-size: 12px;">${new Date().toLocaleString(language === 'es' ? 'es-ES' : 'en-US')}</p>`
  content += '<hr>'

  if (typeof sectionData === 'string') {
    content += `<p>${sectionData.replace(/\n/g, '<br>')}</p>`
  } else if (Array.isArray(sectionData)) {
    sectionData.forEach((item, idx) => {
      content += `<h3>${language === 'es' ? 'Elemento' : 'Item'} ${idx + 1}</h3>`
      if (typeof item === 'string') {
        content += `<p>${item}</p>`
      } else if (typeof item === 'object') {
        content += '<table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%; margin-bottom: 20px;">'
        Object.entries(item).forEach(([key, value]) => {
          if (value && typeof value !== 'object') {
            content += `<tr><td style="font-weight: bold; background: #f0f0f0;">${key}</td><td>${value}</td></tr>`
          }
        })
        content += '</table>'
      }
    })
  } else if (typeof sectionData === 'object' && sectionData !== null) {
    content += '<table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%;">'
    Object.entries(sectionData).forEach(([key, value]) => {
      content += `<tr><td style="font-weight: bold; background: #f0f0f0; width: 30%;">${key}</td><td>`
      if (typeof value === 'string') {
        content += value.replace(/\n/g, '<br>')
      } else if (Array.isArray(value)) {
        content += '<ul>'
        value.forEach(item => {
          content += `<li>${typeof item === 'string' ? item : JSON.stringify(item)}</li>`
        })
        content += '</ul>'
      } else {
        content += `<pre>${JSON.stringify(value, null, 2)}</pre>`
      }
      content += '</td></tr>'
    })
    content += '</table>'
  }

  const wordHTML = `
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word">
<head>
  <meta charset="UTF-8">
  <title>${sectionName}</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; padding: 40px; }
    h1 { color: #5eb3a1; font-size: 28px; margin-bottom: 10px; }
    h3 { color: #333; font-size: 18px; margin-top: 20px; margin-bottom: 10px; }
    p { margin-bottom: 12px; }
    table { margin-bottom: 20px; }
  </style>
</head>
<body>
  ${content}
</body>
</html>
  `

  const blob = new Blob([wordHTML], { type: 'application/msword' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${fileName}.doc`
  link.click()
  URL.revokeObjectURL(url)
}

const exportSectionToJSON = ({ sectionName, sectionData, fileName }: any) => {
  const jsonData = {
    section: sectionName,
    exportDate: new Date().toISOString(),
    data: sectionData
  }

  const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${fileName}.json`
  link.click()
  URL.revokeObjectURL(url)
}

const exportSectionToText = ({ sectionName, sectionData, fileName }: any) => {
  let textContent = `${sectionName}\n`
  textContent += `${'='.repeat(sectionName.length)}\n`
  textContent += `${new Date().toLocaleString()}\n\n`

  if (typeof sectionData === 'string') {
    textContent += sectionData
  } else if (Array.isArray(sectionData)) {
    sectionData.forEach((item, idx) => {
      textContent += `\n${idx + 1}. `
      if (typeof item === 'string') {
        textContent += item
      } else {
        textContent += JSON.stringify(item, null, 2)
      }
      textContent += '\n'
    })
  } else if (typeof sectionData === 'object' && sectionData !== null) {
    Object.entries(sectionData).forEach(([key, value]) => {
      textContent += `\n${key}:\n`
      if (typeof value === 'string') {
        textContent += `  ${value}\n`
      } else if (Array.isArray(value)) {
        value.forEach(item => {
          textContent += `  • ${typeof item === 'string' ? item : JSON.stringify(item)}\n`
        })
      } else {
        textContent += `  ${JSON.stringify(value, null, 2)}\n`
      }
    })
  }

  const blob = new Blob([textContent], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${fileName}.txt`
  link.click()
  URL.revokeObjectURL(url)
}
