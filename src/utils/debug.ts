// Debug utility for development
export class Debug {
  private static isEnabled = process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_DEBUG === 'true'

  static log(message: string, data?: any) {
    if (this.isEnabled) {
      console.log(`[DEBUG] ${message}`, data || '')
    }
  }

  static error(message: string, error?: any) {
    if (this.isEnabled) {
      console.error(`[DEBUG ERROR] ${message}`, error || '')
    }
  }

  static warn(message: string, data?: any) {
    if (this.isEnabled) {
      console.warn(`[DEBUG WARN] ${message}`, data || '')
    }
  }

  static table(data: any) {
    if (this.isEnabled && console.table) {
      console.table(data)
    }
  }

  static group(label: string, callback: () => void) {
    if (this.isEnabled) {
      console.group(label)
      callback()
      console.groupEnd()
    }
  }
}