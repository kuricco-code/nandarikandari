export interface PlanetData {
  name: string
  nameEn: string
  radius: number
  orbitRadius: number
  period: number
  color: string
  emissive: string
  ring: string | null
  initialAngle?: number
}

export const PLANETS: PlanetData[] = [
  { name: '水星', nameEn: 'Mercury', radius: 0.28, orbitRadius: 8,  period: 0.24,  color: '#b5b5b5', emissive: '#555555', ring: null },
  { name: '金星', nameEn: 'Venus',   radius: 0.48, orbitRadius: 12, period: 0.62,  color: '#e8cda0', emissive: '#c8a060', ring: null },
  { name: '地球', nameEn: 'Earth',   radius: 0.50, orbitRadius: 17, period: 1.00,  color: '#4ca3dd', emissive: '#1a5020', ring: null },
  { name: '火星', nameEn: 'Mars',    radius: 0.34, orbitRadius: 22, period: 1.88,  color: '#c1440e', emissive: '#8b2500', ring: null },
  { name: '木星', nameEn: 'Jupiter', radius: 1.50, orbitRadius: 32, period: 11.86, color: '#c88b3a', emissive: '#6b4010', ring: null },
  { name: '土星', nameEn: 'Saturn',  radius: 1.20, orbitRadius: 43, period: 29.46, color: '#e4d191', emissive: '#b09050', ring: '#c8b870' },
  { name: '天王星', nameEn: 'Uranus', radius: 0.80, orbitRadius: 54, period: 84.0,  color: '#7de8e8', emissive: '#309090', ring: null },
  { name: '海王星', nameEn: 'Neptune',radius: 0.75, orbitRadius: 64, period: 165.0, color: '#4b70dd', emissive: '#204090', ring: null },
]
