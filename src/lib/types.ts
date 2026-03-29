// src/lib/types.ts

export type ApplicationStatus = 'pending' | 'approved' | 'rejected'

export interface Event {
  id: string
  title: string
  description: string
  event_date: string
  location: string
  image_url?: string
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface Partner {
  id: string
  name: string
  logo_url?: string
  website_url?: string
  description?: string
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface GalleryItem {
  id: string
  image_url: string
  caption?: string
  category?: string
  created_at: string
}

export interface CommitteeMember {
  id: string
  full_name: string
  role: string
  bio?: string
  image_url?: string
  email?: string
  sort_order: number
  created_at: string
  updated_at: string
}

export interface SiteInfo {
  id: string
  section: string
  key: string
  value: string
  updated_at: string
}

export interface ContactDetail {
  id: string
  label: string
  value: string
  type: 'phone' | 'email' | 'address' | 'social' | string
  sort_order: number
  updated_at: string
}

export interface MembershipTier {
  id: string
  name: string
  description?: string
  price: number
  currency: string
  benefits?: string[]
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface MembershipApplication {
  id: string
  tier_id?: string
  full_name: string
  email: string
  phone?: string
  vehicle_make?: string
  vehicle_model?: string
  vehicle_year?: number
  status: ApplicationStatus
  notes?: string
  created_at: string
  updated_at: string
  // Joined from membership_tiers collection
  membership_tiers?: MembershipTier
}