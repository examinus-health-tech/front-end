import { Platform } from 'react-native';

interface LogContext {
  screen?: string;
  action?: string;
  userId?: string;
  userName?: string;
  email?: string;
  error?: any;
  isValidToken?: boolean;
  hasToken?: boolean;
  latency?: number;
  status?: number;
  totalTime?: number;
  isConnected?: boolean;
  apiReachable?: boolean;
  apiUrl?: string;
  isDev?: boolean;
  userAgent?: string;
  diagnostics?: any;
  extra?: Record<string, any>;
}

class DebugLogger {
  private isDev = __DEV__;
  private logs: Array<{ timestamp: Date; level: string; message: string; context?: LogContext }> = [];
  private maxLogs = 100;

  private formatMessage(level: string, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const platform = Platform.OS;
    
    let logMessage = `[${timestamp}] [${platform}] [${level}] ${message}`;
    
    if (context) {
      logMessage += ` | Context: ${JSON.stringify(context)}`;
    }
    
    return logMessage;
  }

  private addLog(level: string, message: string, context?: LogContext) {
    const logEntry = {
      timestamp: new Date(),
      level,
      message,
      context,
    };

    this.logs.push(logEntry);
    
    // Keep only the last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
  }

  info(message: string, context?: LogContext) {
    const formattedMessage = this.formatMessage('INFO', message, context);
    this.addLog('INFO', message, context);
    
    if (this.isDev) {
      console.log('ℹ️', formattedMessage);
    }
  }

  warn(message: string, context?: LogContext) {
    const formattedMessage = this.formatMessage('WARN', message, context);
    this.addLog('WARN', message, context);
    
    if (this.isDev) {
      console.warn('⚠️', formattedMessage);
    }
  }

  error(message: string, context?: LogContext) {
    const formattedMessage = this.formatMessage('ERROR', message, context);
    this.addLog('ERROR', message, context);
    
    if (this.isDev) {
      console.error('❌', formattedMessage);
    }
  }

  debug(message: string, context?: LogContext) {
    const formattedMessage = this.formatMessage('DEBUG', message, context);
    this.addLog('DEBUG', message, context);
    
    if (this.isDev) {
      console.log('🐛', formattedMessage);
    }
  }

  network(message: string, context?: LogContext) {
    const formattedMessage = this.formatMessage('NETWORK', message, context);
    this.addLog('NETWORK', message, context);
    
    if (this.isDev) {
      console.log('🌐', formattedMessage);
    }
  }

  auth(message: string, context?: LogContext) {
    const formattedMessage = this.formatMessage('AUTH', message, context);
    this.addLog('AUTH', message, context);
    
    if (this.isDev) {
      console.log('🔐', formattedMessage);
    }
  }

  // Get recent logs for debugging
  getRecentLogs(count: number = 20): string[] {
    return this.logs
      .slice(-count)
      .map(log => this.formatMessage(log.level, log.message, log.context));
  }

  // Clear all logs
  clearLogs() {
    this.logs = [];
  }

  // Export logs for debugging
  exportLogs(): string {
    return this.logs
      .map(log => this.formatMessage(log.level, log.message, log.context))
      .join('\n');
  }
}

export const logger = new DebugLogger();
export default logger;