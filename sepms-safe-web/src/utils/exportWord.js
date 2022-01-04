import JSZip from 'jszip'
import docxtemplater from 'docxtemplater'
import JSZipUtils from 'jszip-utils'
import { saveAs } from 'file-saver'

export function exportWord(template, docxData, exportWordName) {
  JSZipUtils.getBinaryContent(template, function(error, content) {
    // 抛出异常
    if (error) {
      throw error
    }
    const zip = new JSZip(content)
    // eslint-disable-next-line new-cap
    const doc = new docxtemplater().loadZip(zip)
    // 设置模板变量的值
    doc.setData({
      ...docxData
    })
    try {
      // 用模板变量的值替换所有模板变量
      doc.render()
    } catch (error) {
      // 抛出异常
      const e = {
        message: error.message,
        name: error.name,
        stack: error.stack,
        properties: error.properties
      }
      console.log(JSON.stringify({ error: e }))
      throw error
    }
    const out = doc.getZip().generate({
      type: 'blob',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    })
    saveAs(out, exportWordName)
  })
}
