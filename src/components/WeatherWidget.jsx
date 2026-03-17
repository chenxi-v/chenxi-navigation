import { useState, useEffect } from 'react'
import { useTheme } from '../context/ThemeContext'

const weatherIcons = {
  '晴': '☀️',
  '多云': '⛅',
  '阴': '☁️',
  '小雨': '🌦️',
  '中雨': '🌧️',
  '大雨': '🌧️',
  '暴雨': '⛈️',
  '雷': '⚡',
  '雪': '❄️',
  '雾': '🌫️',
  '霾': '🌫️',
  '未知': '🌤️'
}

export default function WeatherWidget() {
  const { isDark } = useTheme()
  const [isHovered, setIsHovered] = useState(false)
  const [dateTime, setDateTime] = useState(new Date())
  const [weatherData, setWeatherData] = useState({
    location: '加载中...',
    condition: '未知',
    temperature: 'N/A',
    tempRange: 'N/A',
    airQuality: 'N/A',
    humidity: 'N/A',
    windSpeed: 'N/A',
    icon: '🌤️',
    timestamp: Date.now()
  })

  useEffect(() => {
    loadWeatherData()
    const interval = setInterval(loadWeatherData, 3600000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const loadWeatherData = async () => {
    const cacheKey = 'weatherIslandCache'
    const cachedData = localStorage.getItem(cacheKey)
    const now = Date.now()
    const CACHE_DURATION = 3600000

    if (cachedData) {
      const cacheData = JSON.parse(cachedData)
      if (now - cacheData.lastUpdated < CACHE_DURATION) {
        setWeatherData(cacheData.data)
        return
      }
    }

    try {
      const { location, coordinates } = await fetchUserLocation()
      if (!location || !coordinates) {
        const errorData = processWeatherData({ error: true, reason: '无法获取位置信息' }, now, '未知位置')
        setWeatherData(errorData)
        return
      }

      const weatherApiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`
      const airQualityApiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}&current=european_aqi&timezone=auto`

      const weatherController = new AbortController()
      const weatherTimeoutId = setTimeout(() => weatherController.abort(), 4000)
      const weatherResponse = await fetch(weatherApiUrl, { signal: weatherController.signal })
      clearTimeout(weatherTimeoutId)

      if (!weatherResponse.ok) throw new Error('获取天气信息失败')
      const weatherData = await weatherResponse.json()

      let airQualityData = { current: { european_aqi: null } }
      try {
        const airQualityController = new AbortController()
        const airQualityTimeoutId = setTimeout(() => airQualityController.abort(), 5000)
        const airQualityResponse = await fetch(airQualityApiUrl, { signal: airQualityController.signal })
        clearTimeout(airQualityTimeoutId)
        if (airQualityResponse.ok) {
          airQualityData = await airQualityResponse.json()
        }
      } catch (e) {
        console.warn('获取空气质量数据时出错:', e)
      }

      const combinedData = {
        ...weatherData,
        current: {
          ...weatherData.current,
          european_aqi: airQualityData.current?.european_aqi
        }
      }

      const parsedWeatherData = processWeatherData(combinedData, now, location, coordinates)
      localStorage.setItem(cacheKey, JSON.stringify({ data: parsedWeatherData, lastUpdated: now }))
      setWeatherData(parsedWeatherData)
    } catch (error) {
      console.error('获取天气信息失败:', error)
      const errorData = processWeatherData({ error: true, reason: error.message }, Date.now(), '未知位置')
      setWeatherData(errorData)
    }
  }

  const fetchUserLocation = async () => {
    try {
      let location = ''
      let coordinates = null

      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 4000)
        const myipLaResponse = await fetch('https://api.myip.la/cn?json', { signal: controller.signal })
        clearTimeout(timeoutId)

        if (myipLaResponse.ok) {
          const data = await myipLaResponse.json()
          if (data?.location) {
            if (data.location.latitude && data.location.longitude) {
              coordinates = {
                latitude: parseFloat(data.location.latitude),
                longitude: parseFloat(data.location.longitude)
              }
            }
            const province = data.location.province || ''
            const city = data.location.city || ''
            if (province && city) {
              location = city.includes(province.replace('省', '').replace('市', '').replace('都', ''))
                ? city
                : province + city
            } else {
              location = province || city || data.location.country_name || ''
            }
          }
        }
      } catch (error) {
        console.warn('api.myip.la 获取失败:', error.message)
      }

      if (!location) {
        try {
          const ipipResponse = await fetch('https://myip.ipip.net')
          if (ipipResponse.ok) {
            const text = await ipipResponse.text()
            if (text?.includes('来自于：')) {
              const locationPart = text.split('来自于：')[1]
              if (locationPart) {
                const locationInfo = locationPart.split(' ')[0]
                if (locationInfo) {
                  const parts = locationInfo.trim().split(' ')
                  location = parts.length >= 3 ? parts[1] + parts[2] : parts[parts.length - 1] || parts[0]
                  coordinates = await getCoordinates(location)
                }
              }
            }
          }
        } catch (fallbackError) {
          console.error('备用 API 也失败了:', fallbackError.message)
        }
      }

      return { location, coordinates }
    } catch (error) {
      console.error('获取位置信息过程中发生错误:', error)
      return { location: '', coordinates: null }
    }
  }

  const getCoordinates = async (cityName) => {
    if (!cityName) return null
    try {
      const geocodeUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName)}&format=json&limit=1&accept-language=zh-Hans&countrycodes=CN`
      const response = await fetch(geocodeUrl)
      if (!response.ok) throw new Error('地理编码请求失败')
      const data = await response.json()
      if (data?.length > 0) {
        return { latitude: parseFloat(data[0].lat), longitude: parseFloat(data[0].lon) }
      }
      return null
    } catch (error) {
      console.error('获取坐标失败:', error)
      return null
    }
  }

  const processWeatherData = (data, timestamp, userLocation = '') => {
    if (!data || data.error) {
      return {
        location: userLocation || '未知位置',
        condition: data?.reason || '该位置暂不支持',
        temperature: 'N/A',
        tempRange: 'N/A',
        airQuality: 'N/A',
        humidity: 'N/A',
        windSpeed: 'N/A',
        icon: weatherIcons['未知'],
        timestamp
      }
    }

    const current = data.current || {}
    const weatherCode = current.weather_code || 0
    const temperature = current.temperature_2m !== undefined ? `${Math.round(current.temperature_2m)}°C` : 'N/A'
    
    let tempRange = 'N/A'
    if (data.daily) {
      const minTemp = data.daily.temperature_2m_min?.[0]
      const maxTemp = data.daily.temperature_2m_max?.[0]
      if (minTemp !== undefined && maxTemp !== undefined) {
        tempRange = `${Math.round(minTemp)}～${Math.round(maxTemp)}°C`
      }
    }

    const humidity = current.relative_humidity_2m !== undefined ? `${current.relative_humidity_2m}%` : 'N/A'
    
    let airQuality = 'N/A'
    if (current.european_aqi !== undefined) {
      const aqi = current.european_aqi
      let aqiLevel = aqi <= 20 ? '优' : aqi <= 40 ? '良' : aqi <= 60 ? '中等' : aqi <= 80 ? '一般' : aqi <= 100 ? '差' : '严重'
      airQuality = `${aqiLevel} (${aqi})`
    }

    const windSpeed = current.wind_speed_10m !== undefined ? `${Math.round(current.wind_speed_10m)} km/h` : 'N/A'

    let weatherCondition = '未知'
    let weatherIcon = weatherIcons['未知']
    
    if (weatherCode === 0) {
      weatherCondition = '晴'; weatherIcon = weatherIcons['晴']
    } else if (weatherCode === 1) {
      weatherCondition = '大部晴朗'; weatherIcon = weatherIcons['晴']
    } else if (weatherCode === 2) {
      weatherCondition = '局部多云'; weatherIcon = weatherIcons['多云']
    } else if (weatherCode === 3) {
      weatherCondition = '多云'; weatherIcon = weatherIcons['多云']
    } else if ([45, 48].includes(weatherCode)) {
      weatherCondition = '雾'; weatherIcon = weatherIcons['雾']
    } else if ([51, 53, 55, 56, 57].includes(weatherCode)) {
      weatherCondition = '小雨'; weatherIcon = weatherIcons['小雨']
    } else if ([61, 63, 66, 80, 81].includes(weatherCode)) {
      weatherCondition = '中雨'; weatherIcon = weatherIcons['中雨']
    } else if ([65, 67, 82].includes(weatherCode)) {
      weatherCondition = '大雨'; weatherIcon = weatherIcons['大雨']
    } else if ([95, 96, 99].includes(weatherCode)) {
      weatherCondition = '雷雨'; weatherIcon = weatherIcons['雷']
    } else if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) {
      weatherCondition = '雪'; weatherIcon = weatherIcons['雪']
    } else if (weatherCode !== undefined) {
      weatherCondition = '阴'; weatherIcon = weatherIcons['阴']
    }

    return {
      location: userLocation || '未知位置',
      condition: weatherCondition,
      temperature,
      tempRange,
      airQuality,
      humidity,
      windSpeed,
      icon: weatherIcon,
      timestamp
    }
  }

  const formatUpdateTime = (timestamp) => {
    const date = new Date(timestamp)
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
  }

  const formatDate = () => {
    const year = dateTime.getFullYear()
    const month = dateTime.getMonth() + 1
    const day = dateTime.getDate()
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
    const weekday = weekdays[dateTime.getDay()]
    return `${year}年${month}月${day}日 ${weekday}`
  }

  const formatTime = () => {
    const hours = dateTime.getHours().toString().padStart(2, '0')
    const minutes = dateTime.getMinutes().toString().padStart(2, '0')
    const seconds = dateTime.getSeconds().toString().padStart(2, '0')
    return `${hours}:${minutes}:${seconds}`
  }

  return (
    <div 
      className={`fixed z-[9999] max-w-[95vw] rounded-full shadow-lg transition-all duration-300 top-5 left-1/2 -translate-x-1/2 ${
        isDark ? 'text-white' : 'text-gray-700'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`w-full backdrop-blur-md flex items-center gap-6 px-8 py-2 rounded-full ${
          isDark
            ? 'bg-white/10 border border-white/20'
            : 'bg-white/95 border border-black/10'
        }`}
      >
        <div className="text-2xl flex-shrink-0">{weatherData.icon}</div>
        <div className="flex-1 min-w-0 flex items-center gap-6">
          <div className="text-lg font-bold">{weatherData.temperature}</div>
          <div className="text-xs opacity-80 truncate flex-1">{weatherData.location}</div>
        </div>
        <div className="flex-shrink-0 border-l border-black/10 dark:border-white/10 pl-6">
          <div className="flex items-center gap-3">
            <div className="text-xs font-semibold text-gray-600 dark:text-slate-300">
              {formatDate()}
            </div>
            <div className="text-xl font-bold text-primary-400 tracking-wide">
              {formatTime()}
            </div>
          </div>
        </div>
      </div>
      
      <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
        <div className={`px-4 py-3 rounded-xl backdrop-blur-md shadow-xl min-w-[200px] ${
          isDark
            ? 'bg-white/20 border border-white/30'
            : 'bg-white/95 border border-black/10'
        }`}>
          <div className={`text-sm font-bold mb-2 text-center ${isDark ? 'text-white' : ''}`}>{weatherData.condition}</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className={isDark ? 'text-white' : 'text-gray-600'}>湿度: {weatherData.humidity}</div>
            <div className={isDark ? 'text-white' : 'text-gray-600'}>风速: {weatherData.windSpeed}</div>
            <div className={isDark ? 'text-white' : 'text-gray-600'}>温度: {weatherData.tempRange}</div>
            <div className={isDark ? 'text-white' : 'text-gray-600'}>空气: {weatherData.airQuality.split(' ')[0]}</div>
          </div>
          <div className={`text-xs mt-2 text-center ${isDark ? 'text-white/70' : 'text-gray-400'}`}>
            更新: {formatUpdateTime(weatherData.timestamp)}
          </div>
        </div>
      </div>
    </div>
  )
}
