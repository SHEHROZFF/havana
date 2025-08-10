// Simple authentication without JWT to avoid any issues
export interface AdminUser {
  userId: string
  email: string
  role: string
}

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') {
    console.log('Server side - not authenticated')
    return false
  }
  
  const token = localStorage.getItem('admin_token')
  console.log('Checking auth - token exists:', !!token)
  
  if (!token) {
    console.log('No token found')
    return false
  }
  
  // For now, just check if token exists (simplified)
  // In production, you would verify the JWT
  console.log('Token found - user is authenticated')
  return true
}

export function logout() {
  if (typeof window !== 'undefined') {
    console.log('Logging out - removing token')
    localStorage.removeItem('admin_token')
    window.location.href = '/admin/login'
  }
}