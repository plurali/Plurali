const DefaultShadeCount = 9

export const generateShades = (baseHex: string, shadeCount = DefaultShadeCount) => {
  const shades = []
  for (let i = 0; i < shadeCount; i++) {
    const shadeHex = generateShade(baseHex, i, shadeCount)
    shades.push(shadeHex)
  }
  return shades
}

export const generateShade = (baseHex: string, index: number, shadeCount: number) => {
  const baseRgb = hexToRgb(baseHex)
  const percent = index / (shadeCount - 1)
  const delta = Math.round(percent * 255)
  const rgb = baseRgb.map(value => Math.max(0, Math.min(255, value + delta)))
  return rgbToHex(rgb)
}

export const hexToRgb = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return [r, g, b]
}

export const rgbToHex = (rgb: number[]) => {
  const r = rgb[0].toString(16).padStart(2, '0')
  const g = rgb[1].toString(16).padStart(2, '0')
  const b = rgb[2].toString(16).padStart(2, '0')
  return `#${r}${g}${b}`
}