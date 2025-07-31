// Simple JWT utility for demo purposes
// In production, use a proper JWT library like jsonwebtoken

export function generateDemoToken(): string {
  // This is a simple demo token - in production, use proper JWT signing
  const payload = {
    userId: 'demo_user',
    exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour
    iat: Math.floor(Date.now() / 1000)
  };
  
  // Simple base64 encoding for demo (NOT secure for production)
  return btoa(JSON.stringify(payload));
}

export function validateDemoToken(token: string): boolean {
  try {
    const decoded = JSON.parse(atob(token));
    const now = Math.floor(Date.now() / 1000);
    
    // Check if token is expired
    if (decoded.exp && decoded.exp < now) {
      return false;
    }
    
    // Check if token has required fields
    if (!decoded.userId) {
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
}

export function getUserIdFromToken(token: string): string | null {
  try {
    const decoded = JSON.parse(atob(token));
    return decoded.userId || null;
  } catch {
    return null;
  }
} 