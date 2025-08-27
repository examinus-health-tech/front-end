import { logger } from './debugLogger';
import { api } from '../services/api';

export interface NetworkDiagnostics {
  isConnected: boolean;
  apiReachable: boolean;
  latency?: number;
  error?: string;
  timestamp: Date;
}

export class NetworkDiagnosticsHelper {
  static async runDiagnostics(): Promise<NetworkDiagnostics> {
    const startTime = Date.now();
    const result: NetworkDiagnostics = {
      isConnected: false,
      apiReachable: false,
      timestamp: new Date(),
    };

    try {
      logger.network('Running network diagnostics');

      // Test basic connectivity
      try {
        const connectivityTest = await fetch('https://www.google.com', { 
          method: 'HEAD',
          mode: 'no-cors',
          cache: 'no-cache',
        });
        result.isConnected = true;
        logger.network('Basic connectivity: OK');
      } catch (error) {
        result.isConnected = false;
        logger.network('Basic connectivity: FAILED', { error });
      }

      // Test API connectivity
      try {
        const apiStartTime = Date.now();
        
        // Test authentication endpoint with HEAD - 405 is expected and means API is working
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}authentication`, {
          method: 'HEAD',
          timeout: 10000
        });
        
        result.apiReachable = true;
        result.latency = Date.now() - apiStartTime;
        
        logger.network('API connectivity: OK', { 
          latency: result.latency,
          status: response.status 
        });
      } catch (error: any) {
        // 405 Method Not Allowed is expected and indicates API is working
        if (error.response?.status === 405 || error.status === 405) {
          result.apiReachable = true;
          result.latency = Date.now() - apiStartTime;
          logger.network('API connectivity: OK (405 expected)', { 
            latency: result.latency,
            status: 405 
          });
        } else {
          result.apiReachable = false;
          result.error = error.message || 'API unreachable';
          
          logger.network('API connectivity: FAILED', { 
            error: error.message,
            status: error.response?.status || error.status,
            code: error.code
          });
        }
      }

      const totalTime = Date.now() - startTime;
      logger.network('Network diagnostics completed', { 
        totalTime,
        isConnected: result.isConnected,
        apiReachable: result.apiReachable 
      });

      return result;
    } catch (error: any) {
      logger.error('Network diagnostics failed', { error });
      result.error = error.message || 'Diagnostics failed';
      return result;
    }
  }

  static async testAPIHealth(): Promise<boolean> {
    try {
      logger.network('Testing API health');
      
      // Test authentication endpoint with HEAD - 405 is expected
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}authentication`, {
        method: 'HEAD',
        timeout: 5000
      });
      
      logger.network('API health check: OK', { status: response.status });
      return true;
    } catch (error: any) {
      // 405 Method Not Allowed is expected and indicates API is working
      if (error.response?.status === 405 || error.status === 405) {
        logger.network('API health check: OK (405 expected)', { status: 405 });
        return true;
      }
      
      logger.network('API health check: FAILED', { 
        error: error.message,
        status: error.response?.status || error.status
      });
      return false;
    }
  }

  static logEnvironmentInfo() {
    logger.info('Environment info', {
      apiUrl: process.env.EXPO_PUBLIC_API_URL,
      isDev: __DEV__,
      userAgent: navigator.userAgent,
    });
  }
}

export default NetworkDiagnosticsHelper;