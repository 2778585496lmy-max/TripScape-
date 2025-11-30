// server.js
import express from 'express'
import axios from 'axios'

const app = express()
const port = 3001

const GAODE_KEY = process.env.GAODE_KEY || 'c530d7bf33cab683c55d0ae90150ee46' // 换成你自己的

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.sendStatus(204)
  next()
})

/** 统一出口：前端默认访问 /api/popular-attractions */
app.get('/api/popular-attractions', async (req, res) => {
  try {
    if (!GAODE_KEY || GAODE_KEY.includes('请在此处')) {
      return res.status(500).json({ error: '高德 Key 未配置' })
    }

    const params = {
      key: GAODE_KEY,
      keywords: '景区',
      types: '110000', // 景区类型
      offset: 100, // 单次 100 条
      page: req.query.page || 1,
      extensions: 'all',
      output: 'JSON',
      citylimit: false, // ① 全国
      sortrule: 'weight', // 按热度排序
    }

    const { data } = await axios.get('https://restapi.amap.com/v3/place/text', {
      params,
      timeout: 8000,
    })

    // 把高德格式转成前端需要的格式
    const list = (data.pois || []).map((p) => {
      const [lon, lat] = (p.location || ',').split(',')
      return {
        id: p.id,
        name: p.name,
        visitors: Number(p.biz_ext?.rating || 0),
        lon: Number(lon) || undefined,
        lat: Number(lat) || undefined,
        city: p.cityname || p.adname || '',
      }
    })

    res.json(list) // 直接返回数组
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: '后端请求高德失败', detail: e.message })
  }
})

app.listen(port, () =>
  console.log(` 后端已启动 → http://localhost:${port}/api/popular-attractions`),
)
