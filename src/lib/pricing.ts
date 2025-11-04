export interface PricingOptions {
  text: string
  fontStyle: string
  color: string
  size: string
  material: string
  backing?: string
  mounting?: string
  powerOption?: string
}

export interface PriceBreakdown {
  basePrice: number
  sizeMultiplier: number
  materialCost: number
  textLengthCost: number
  backingCost: number
  mountingCost: number
  powerCost: number
  total: number
}

const BASE_PRICE = 150

const SIZE_MULTIPLIERS: Record<string, number> = {
  small: 0.7,
  medium: 1.0,
  large: 1.5,
  'extra-large': 2.0,
}

const MATERIAL_COSTS: Record<string, number> = {
  standard: 0,
  premium: 50,
  luxury: 100,
}

const TEXT_COST_PER_CHAR = 5

const BACKING_COSTS: Record<string, number> = {
  none: 0,
  acrylic: 30,
  metal: 50,
  wood: 40,
}

const MOUNTING_COSTS: Record<string, number> = {
  none: 0,
  wall: 25,
  ceiling: 35,
  stand: 50,
}

const POWER_COSTS: Record<string, number> = {
  plug: 0,
  battery: 20,
  solar: 40,
}

export function calculatePrice(options: PricingOptions): PriceBreakdown {
  const { text, size, material, backing, mounting, powerOption } = options

  const basePrice = BASE_PRICE
  const sizeMultiplier = SIZE_MULTIPLIERS[size] || 1.0
  const materialCost = MATERIAL_COSTS[material] || 0
  const textLengthCost = (text?.length || 0) * TEXT_COST_PER_CHAR
  const backingCost = backing ? BACKING_COSTS[backing] || 0 : 0
  const mountingCost = mounting ? MOUNTING_COSTS[mounting] || 0 : 0
  const powerCost = powerOption ? POWER_COSTS[powerOption] || 0 : 0

  const subtotal = (basePrice + materialCost + textLengthCost + backingCost + mountingCost + powerCost) * sizeMultiplier
  const total = Math.round(subtotal)

  return {
    basePrice,
    sizeMultiplier,
    materialCost,
    textLengthCost,
    backingCost,
    mountingCost,
    powerCost,
    total,
  }
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}
