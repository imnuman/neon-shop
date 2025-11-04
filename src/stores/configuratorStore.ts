import { create } from 'zustand'

export interface ConfiguratorState {
  // Design configuration
  text: string
  fontStyle: string
  color: string
  size: string
  material: string
  backing?: string
  mounting?: string
  powerOption?: string
  
  // Calculated price
  price: number
  
  // Actions
  setText: (text: string) => void
  setFontStyle: (font: string) => void
  setColor: (color: string) => void
  setSize: (size: string) => void
  setMaterial: (material: string) => void
  setBacking: (backing: string) => void
  setMounting: (mounting: string) => void
  setPowerOption: (power: string) => void
  setPrice: (price: number) => void
  reset: () => void
}

const initialState = {
  text: 'HELLO',
  fontStyle: 'modern',
  color: '#00f2ff',
  size: 'medium',
  material: 'premium',
  backing: undefined,
  mounting: undefined,
  powerOption: undefined,
  price: 0,
}

export const useConfiguratorStore = create<ConfiguratorState>((set) => ({
  ...initialState,
  
  setText: (text) => set({ text }),
  setFontStyle: (fontStyle) => set({ fontStyle }),
  setColor: (color) => set({ color }),
  setSize: (size) => set({ size }),
  setMaterial: (material) => set({ material }),
  setBacking: (backing) => set({ backing }),
  setMounting: (mounting) => set({ mounting }),
  setPowerOption: (powerOption) => set({ powerOption }),
  setPrice: (price) => set({ price }),
  reset: () => set(initialState),
}))
