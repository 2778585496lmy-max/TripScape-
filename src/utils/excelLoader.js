// utils/excelLoader.js
import * as XLSX from 'xlsx'

export const loadExcelData = async (filePath) => {
  try {
    const response = await fetch(filePath)
    const arrayBuffer = await response.arrayBuffer()
    const workbook = XLSX.read(arrayBuffer, { type: 'array' })
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]
    const data = XLSX.utils.sheet_to_json(worksheet)

    return data.map((item, index) => ({
      id: index + 1,
      景区名称: item['景区名称'] || '',
      地区: item['地区'] || '',
      景区等级: item['景区等级'] || '',
      经度: item['经度'] || '',
      纬度: item['纬度'] || '',
    }))
  } catch (error) {
    console.error('加载 Excel 数据失败:', error)
    return []
  }
}
