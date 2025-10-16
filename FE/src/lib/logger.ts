interface LogLevel {
  ERROR: 'error';
  WARN: 'warn';
  INFO: 'info';
  DEBUG: 'debug';
}

const LOG_LEVELS: LogLevel = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
};

type LogLevelType = LogLevel[keyof LogLevel];

interface LogEntry {
  level: LogLevelType;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
  userId?: string;
  requestId?: string;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isProduction = process.env.NODE_ENV === 'production';

  private formatLog(entry: LogEntry): string {
    const { level, message, timestamp, context, userId, requestId } = entry;
    
    let logString = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    
    if (userId) logString += ` [USER:${userId}]`;
    if (requestId) logString += ` [REQ:${requestId}]`;
    
    if (context && Object.keys(context).length > 0) {
      logString += ` [CONTEXT:${JSON.stringify(context)}]`;
    }
    
    return logString;
  }

  private log(level: LogLevelType, message: string, context?: Record<string, any>) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
    };

    const formattedLog = this.formatLog(entry);

    // Console logging for development
    if (this.isDevelopment) {
      switch (level) {
        case 'error':
          console.error(formattedLog);
          break;
        case 'warn':
          console.warn(formattedLog);
          break;
        case 'info':
          console.info(formattedLog);
          break;
        case 'debug':
          console.debug(formattedLog);
          break;
      }
    }

    // In production, you would send logs to external service
    if (this.isProduction) {
      // Example: Send to external logging service
      // await this.sendToLoggingService(entry);
    }
  }

  error(message: string, context?: Record<string, any>) {
    this.log(LOG_LEVELS.ERROR, message, context);
  }

  warn(message: string, context?: Record<string, any>) {
    this.log(LOG_LEVELS.WARN, message, context);
  }

  info(message: string, context?: Record<string, any>) {
    this.log(LOG_LEVELS.INFO, message, context);
  }

  debug(message: string, context?: Record<string, any>) {
    this.log(LOG_LEVELS.DEBUG, message, context);
  }

  // API request logging
  logApiRequest(method: string, url: string, statusCode: number, duration: number, userId?: string) {
    this.info('API Request', {
      method,
      url,
      statusCode,
      duration: `${duration}ms`,
      userId,
    });
  }

  // User action logging
  logUserAction(action: string, userId: string, details?: Record<string, any>) {
    this.info('User Action', {
      action,
      userId,
      ...details,
    });
  }

  // Error logging with context
  logError(error: Error, context?: Record<string, any>) {
    this.error(error.message, {
      stack: error.stack,
      name: error.name,
      ...context,
    });
  }
}

export const logger = new Logger();
export default logger;
