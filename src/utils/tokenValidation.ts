import AsyncStorage from '@react-native-async-storage/async-storage';

export async function validateStoredToken(): Promise<boolean> {
  try {
    const storedUser = await AsyncStorage.getItem('@app:user');
    
    if (!storedUser) {
      return false;
    }
    
    const userData = JSON.parse(storedUser);
    
    // Check if token exists
    if (!userData.token) {
      return false;
    }
    
    // Basic token structure validation (optional)
    const tokenParts = userData.token.split('.');
    if (tokenParts.length !== 3) {
      // Not a valid JWT structure
      await AsyncStorage.removeItem('@app:user');
      return false;
    }
    
    return true;
  } catch (error) {
    // If there's any error, assume token is invalid
    await AsyncStorage.removeItem('@app:user');
    return false;
  }
}

export async function clearStoredToken(): Promise<void> {
  try {
    await AsyncStorage.removeItem('@app:user');
  } catch (error) {
    // Silent fail
  }
}