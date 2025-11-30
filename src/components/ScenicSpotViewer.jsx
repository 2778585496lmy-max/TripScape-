// components/ScenicSpotViewer.jsx
import React, { useState, useEffect } from 'react'
import {
  loadExcelData,
  searchData,
  sortData,
  filterData,
  filterByLevel,
  getAreaList,
  getLevelList,
} from 'src/utils/excelLoader.js'

const ScenicSpotViewer = () => {
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    area: '',
    level: '',
  })
  const [selectedLevels, setSelectedLevels] = useState([])

  // 加载数据
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      // 假设你的 Excel 文件在 public/data/scenic_spots.xlsx
      const excelData = await loadExcelData('public/A级景区.xlsx')
      setData(excelData)
      setFilteredData(excelData)
    } catch (error) {
      console.error('数据加载失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 搜索和过滤
  useEffect(() => {
    let result = data

    // 全局搜索
    if (searchTerm) {
      result = searchData(result, searchTerm)
    }

    // 字段过滤
    if (filters.area || filters.level) {
      result = filterData(result, filters)
    }

    // 多选等级过滤
    if (selectedLevels.length > 0) {
      result = filterByLevel(result, selectedLevels)
    }

    setFilteredData(result)
  }, [data, searchTerm, filters, selectedLevels])

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleLevelSelect = (level) => {
    setSelectedLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level],
    )
  }

  const handleSort = (field) => {
    const sortedData = sortData(filteredData, field)
    setFilteredData(sortedData)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setFilters({ area: '', level: '' })
    setSelectedLevels([])
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div>加载景区数据中...</div>
      </div>
    )
  }

  const areaList = getAreaList(data)
  const levelList = getLevelList(data)

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ color: '#1890ff', marginBottom: '20px' }}>景区数据查看器</h2>

      {/* 搜索和过滤区域 */}
      <div
        style={{
          backgroundColor: '#f5f5f5',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px',
        }}
      >
        {/* 搜索框 */}
        <div style={{ marginBottom: '15px' }}>
          <input
            type="text"
            placeholder="搜索景区名称、地区、等级..."
            value={searchTerm}
            onChange={handleSearch}
            style={{
              padding: '10px',
              width: '400px',
              border: '1px solid #d9d9d9',
              borderRadius: '4px',
              fontSize: '14px',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          {/* 地区筛选 */}
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              地区筛选:
            </label>
            <select
              value={filters.area}
              onChange={(e) => handleFilterChange('area', e.target.value)}
              style={{ padding: '8px', minWidth: '150px' }}
            >
              <option value="">全部地区</option>
              {areaList.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>

          {/* 等级筛选 */}
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              等级筛选:
            </label>
            <select
              value={filters.level}
              onChange={(e) => handleFilterChange('level', e.target.value)}
              style={{ padding: '8px', minWidth: '150px' }}
            >
              <option value="">全部等级</option>
              {levelList.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          {/* 多选等级 */}
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              多选等级:
            </label>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {levelList.map((level) => (
                <label key={level} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <input
                    type="checkbox"
                    checked={selectedLevels.includes(level)}
                    onChange={() => handleLevelSelect(level)}
                  />
                  {level}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* 统计和清除 */}
        <div
          style={{
            marginTop: '15px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ color: '#666' }}>
            共找到 {filteredData.length} 个景区
            {data.length > 0 && ` (总共 ${data.length} 个)`}
          </span>
          <button
            onClick={clearFilters}
            style={{
              padding: '8px 16px',
              backgroundColor: '#ff4d4f',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            清除筛选
          </button>
        </div>
      </div>

      {/* 数据表格 */}
      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#1890ff', color: 'white' }}>
              <th
                onClick={() => handleSort('id')}
                style={{
                  cursor: 'pointer',
                  padding: '12px',
                  textAlign: 'left',
                  minWidth: '60px',
                }}
              >
                ID ↆ
              </th>
              <th
                onClick={() => handleSort('name')}
                style={{
                  cursor: 'pointer',
                  padding: '12px',
                  textAlign: 'left',
                  minWidth: '200px',
                }}
              >
                景区名称 ↆ
              </th>
              <th
                onClick={() => handleSort('area')}
                style={{
                  cursor: 'pointer',
                  padding: '12px',
                  textAlign: 'left',
                  minWidth: '120px',
                }}
              >
                地区 ↆ
              </th>
              <th
                onClick={() => handleSort('level')}
                style={{
                  cursor: 'pointer',
                  padding: '12px',
                  textAlign: 'left',
                  minWidth: '120px',
                }}
              >
                景区等级 ↆ
              </th>
              <th style={{ padding: '12px', textAlign: 'left', minWidth: '100px' }}>经度</th>
              <th style={{ padding: '12px', textAlign: 'left', minWidth: '100px' }}>纬度</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr
                key={item.id}
                style={{
                  backgroundColor: index % 2 === 0 ? '#fff' : '#fafafa',
                  borderBottom: '1px solid #f0f0f0',
                }}
              >
                <td style={{ padding: '12px' }}>{item.id}</td>
                <td style={{ padding: '12px', fontWeight: '500' }}>{item.name}</td>
                <td style={{ padding: '12px' }}>{item.area}</td>
                <td style={{ padding: '12px' }}>
                  <span
                    style={{
                      padding: '2px 8px',
                      backgroundColor: item.level.includes('A') ? '#e6f7ff' : '#f6ffed',
                      border: '1px solid #91d5ff',
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                  >
                    {item.level}
                  </span>
                </td>
                <td style={{ padding: '12px', fontFamily: 'monospace' }}>{item.lng}</td>
                <td style={{ padding: '12px', fontFamily: 'monospace' }}>{item.lat}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredData.length === 0 && !loading && (
        <div
          style={{
            textAlign: 'center',
            padding: '40px',
            color: '#999',
          }}
        >
          暂无景区数据，请调整搜索条件
        </div>
      )}
    </div>
  )
}

export default ScenicSpotViewer
