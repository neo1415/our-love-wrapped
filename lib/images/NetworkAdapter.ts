/**
 * Network connection information
 */
interface NetworkInfo {
  effectiveType: '4g' | '3g' | '2g' | 'slow-2g' | 'unknown';
  downlink?: number; // Mbps
  rtt?: number; // Round-trip time in ms
  saveData?: boolean;
}

/**
 * Adapts image loading strategy based on network conditions
 */
export class NetworkAdapter {
  private connection: NetworkInfo | null = null;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.detectConnection();
    this.setupListeners();
  }

  /**
   * Detect current network connection
   */
  private detectConnection(): void {
    // @ts-ignore - Network Information API
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    if (conn) {
      this.connection = {
        effectiveType: conn.effectiveType || 'unknown',
        downlink: conn.downlink,
        rtt: conn.rtt,
        saveData: conn.saveData,
      };

      console.log('📡 Network detected:', this.connection);
    } else {
      // Fallback if Network Information API not available
      this.connection = {
        effectiveType: 'unknown',
      };
      console.log('📡 Network Information API not available, using defaults');
    }
  }

  /**
   * Set up listeners for network changes
   */
  private setupListeners(): void {
    // @ts-ignore - Network Information API
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    if (conn) {
      conn.addEventListener('change', () => {
        console.log('📡 Network changed');
        this.detectConnection();
        this.notifyListeners();
      });
    }
  }

  /**
   * Notify all listeners of network change
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener());
  }

  /**
   * Add a listener for network changes
   */
  onChange(callback: () => void): () => void {
    this.listeners.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback);
    };
  }

  /**
   * Get optimal preload distance based on connection
   */
  getPreloadDistance(): number {
    if (!this.connection) return 3;

    // If user has data saver enabled, be conservative
    if (this.connection.saveData) {
      console.log('📡 Data saver enabled, reducing preload distance');
      return 1;
    }

    switch (this.connection.effectiveType) {
      case '4g':
        return 5; // Aggressive preloading on fast connection
      case '3g':
        return 3; // Moderate preloading
      case '2g':
      case 'slow-2g':
        return 1; // Minimal preloading on slow connection
      default:
        return 3; // Default moderate preloading
    }
  }

  /**
   * Get optimal image quality based on connection
   */
  getImageQuality(): 'high' | 'medium' | 'low' {
    if (!this.connection) return 'high';

    // If user has data saver enabled, use lower quality
    if (this.connection.saveData) {
      return 'low';
    }

    // Use downlink speed if available
    if (this.connection.downlink !== undefined) {
      if (this.connection.downlink > 5) return 'high';
      if (this.connection.downlink > 1.5) return 'medium';
      return 'low';
    }

    // Fall back to effective type
    switch (this.connection.effectiveType) {
      case '4g':
        return 'high';
      case '3g':
        return 'medium';
      case '2g':
      case 'slow-2g':
        return 'low';
      default:
        return 'high';
    }
  }

  /**
   * Should we use progressive loading?
   */
  shouldUseProgressiveLoading(): boolean {
    if (!this.connection) return true;

    // Always use progressive loading except on very fast connections
    return this.connection.effectiveType !== '4g' || this.connection.saveData === true;
  }

  /**
   * Get connection info for debugging
   */
  getConnectionInfo(): NetworkInfo | null {
    return this.connection;
  }

  /**
   * Is the connection slow?
   */
  isSlowConnection(): boolean {
    if (!this.connection) return false;

    return (
      this.connection.effectiveType === '2g' ||
      this.connection.effectiveType === 'slow-2g' ||
      this.connection.saveData === true ||
      (this.connection.downlink !== undefined && this.connection.downlink < 1.5)
    );
  }

  /**
   * Is the connection fast?
   */
  isFastConnection(): boolean {
    if (!this.connection) return true; // Assume fast if unknown

    return (
      this.connection.effectiveType === '4g' &&
      this.connection.saveData !== true &&
      (this.connection.downlink === undefined || this.connection.downlink > 5)
    );
  }
}

// Singleton instance
let networkAdapterInstance: NetworkAdapter | null = null;

export function getNetworkAdapter(): NetworkAdapter {
  if (!networkAdapterInstance) {
    networkAdapterInstance = new NetworkAdapter();
  }
  return networkAdapterInstance;
}
