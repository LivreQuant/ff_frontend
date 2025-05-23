import { LogLevel } from '../utils/enhanced-logger';

interface AppConfig {
    apiBaseUrl: string;
    wsBaseUrl: string;
    environment: 'development' | 'production' | 'test';
    logLevel?: LogLevel;
    // New connection security configuration
    secureSockets: boolean;
    reconnection: {
        initialDelayMs: number;
        maxDelayMs: number;
        jitterFactor: number;
        maxAttempts: number;
    };
}

const getConfig = (): AppConfig => {
    const env = process.env.REACT_APP_ENV || process.env.NODE_ENV || 'development';
    
    // Determine base URLs dynamically based on security
    const isSecure = env === 'production' || process.env.REACT_APP_SECURE_SOCKETS === 'true';
    const apiProtocol = isSecure ? 'https' : 'http';
    const wsProtocol = isSecure ? 'wss' : 'ws';
    
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || `${apiProtocol}://trading.local/api`;
    const wsBaseUrl = process.env.REACT_APP_WS_BASE_URL || `${wsProtocol}://trading.local/ws`;

    let config: AppConfig;
    switch (env) {
        case 'production':
            config = {
                apiBaseUrl,
                wsBaseUrl,
                environment: 'production',
                logLevel: LogLevel.WARN,
                secureSockets: true,
                reconnection: {
                    initialDelayMs: 1000,
                    maxDelayMs: 30000,
                    jitterFactor: 0.3,
                    maxAttempts: 10
                }
            };
            break;
        default: // development
            config = {
                apiBaseUrl,
                wsBaseUrl,
                environment: 'development',
                logLevel: LogLevel.DEBUG,
                secureSockets: false,
                reconnection: {
                    initialDelayMs: 1000,
                    maxDelayMs: 10000,
                    jitterFactor: 0.5,
                    maxAttempts: 5
                }
            };
            break;
    }    
    
    console.log(`Configuration loaded for env: ${config.environment}`);
    console.log(`Secure Sockets: ${config.secureSockets}`);
    return config;
};

export const config = getConfig();