import api from './api'
import { authService } from './auth'

export interface MedicalProfileData {
  id?: number
  user_id?: number
  allergies: string[]
  maladies: string[]
  is_smoker: boolean
  is_alcoholic: boolean
  is_drugging: boolean
  drug_type?: string | null
  created_at?: string
  updated_at?: string
}

export interface MedicalProfileFormData {
  allergies: string[]
  maladies: string[]
  is_smoker: boolean
  is_alcoholic: boolean
  is_drugging: boolean
  drug_type?: string
}

export const medicalProfileService = {
  // Get user's medical profile
  async getMedicalProfile(): Promise<MedicalProfileData | null> {
    try {
      console.log('📋 Fetching medical profile...')
      
      const response = await api.get('/lifestyle/medical-profiles/me')
      console.log('✅ Medical profile fetched successfully:', response.data)
      return response.data
    } catch (error: any) {
      console.error('❌ Medical profile fetch error:', {
        url: '/lifestyle/medical-profiles/me/',
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      })
      
      // If 404, medical profile doesn't exist
      if (error.response?.status === 404) {
        console.log('Medical profile not found (404) - returning null')
        return null
      }
      
      // If 401/403, authentication issue
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.log('🔒 Authentication error detected in medical profile fetch')
        authService.clearAuthData()
        throw new Error('Authentication required. Please login again.')
      }
      
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.detail || 
        'Medical profile not found or cannot be accessed'
      )
    }
  },

  // Create medical profile
  async createMedicalProfile(data: MedicalProfileFormData): Promise<MedicalProfileData> {
    try {
      console.log('📝 Creating medical profile...', data)
      
      const response = await api.post('/lifestyle/medical-profiles/', data)
      console.log('✅ Medical profile created successfully:', response.data)
      return response.data
    } catch (error: any) {
      console.error('❌ Medical profile creation error:', error)
      
      // Handle authentication errors
      if (error.response?.status === 401 || error.response?.status === 403) {
        authService.clearAuthData()
        throw new Error('Authentication required. Please login again.')
      }
      
      // Handle validation errors
      if (error.response?.status === 400) {
        const errorData = error.response.data
        if (typeof errorData === 'object') {
          const fieldErrors = Object.entries(errorData)
            .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
            .join('\n')
          
          throw new Error(`Validation failed:\n${fieldErrors}`)
        }
      }
      
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.detail || 
        error.response?.data?.error || 
        error.message || 
        'Failed to create medical profile'
      )
    }
  },

  // Update medical profile
  async updateMedicalProfile(profileId: number, data: Partial<MedicalProfileFormData>): Promise<MedicalProfileData> {
    try {
      console.log('📝 Updating medical profile...', data)
      
      const response = await api.put(`/lifestyle/medical-profiles/${profileId}/`, data)
      console.log('✅ Medical profile updated successfully:', response.data)
      return response.data
    } catch (error: any) {
      console.error('❌ Medical profile update error:', error)
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        authService.clearAuthData()
        throw new Error('Authentication required. Please login again.')
      }
      
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.detail || 
        error.response?.data?.error || 
        error.message || 
        'Failed to update medical profile'
      )
    }
  },

  // Common allergies list for autocomplete
  getCommonAllergies(): string[] {
    return [
      'Pollen',
      'Dust mites',
      'Mold',
      'Pet dander',
      'Penicillin',
      'Sulfa drugs',
      'Aspirin',
      'Ibuprofen',
      'Latex',
      'Insect stings',
      'Food (nuts)',
      'Food (shellfish)',
      'Food (dairy)',
      'Food (eggs)',
      'Food (wheat)',
      'Food (soy)',
    ]
  },

  // Common maladies list for autocomplete
  getCommonMaladies(): string[] {
    return [
      'Hypertension',
      'Diabetes Type 1',
      'Diabetes Type 2',
      'Asthma',
      'Arthritis',
      'Heart Disease',
      'Stroke',
      'Cancer',
      'Chronic Obstructive Pulmonary Disease (COPD)',
      'Kidney Disease',
      'Liver Disease',
      'Thyroid Disorders',
      'Anxiety Disorder',
      'Depression',
      'Migraine',
      'Epilepsy',
      'HIV/AIDS',
      'Hepatitis',
      'Tuberculosis',
      'COVID-19',
    ]
  },

  // Common drug types
  getCommonDrugTypes(): string[] {
    return [
      'Cannabis',
      'Cocaine',
      'Heroin',
      'Methamphetamine',
      'MDMA (Ecstasy)',
      'LSD',
      'Prescription opioids',
      'Benzodiazepines',
      'Stimulants',
      'Hallucinogens',
      'Inhalants',
      'Steroids',
    ]
  }
}