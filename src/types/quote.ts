export interface Quote {
  id: string
  quoteNumber: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CUSTOMER_APPROVED'
  
  // Design Configuration
  customText: string
  fontStyle: string
  color: string
  size: string
  material: string
  backing?: string
  mounting?: string
  powerOption?: string
  
  // Pricing
  calculatedPrice: number
  approvedPrice?: number
  
  // Customer Info
  customerId: string
  customerNotes?: string
  
  // Business Response
  businessNotes?: string
  estimatedDelivery?: Date
  depositRequired?: number
  
  // Timestamps
  createdAt: Date
  updatedAt: Date
  approvedAt?: Date
}

export interface CreateQuoteRequest {
  name: string
  email: string
  phone?: string
  company?: string
  customerNotes?: string
  shippingAddress: string
  customText: string
  fontStyle: string
  color: string
  size: string
  material: string
  backing?: string
  mounting?: string
  powerOption?: string
  calculatedPrice: number
}
