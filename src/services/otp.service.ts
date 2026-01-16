import logger from '../utils/logger.util';
import config from '../config';

interface OTPRecord {
  phone: string;
  code: string;
  expiresAt: Date;
}

class OTPService {
  /**
   * Generate and send OTP (MOCK implementation)
   * In production, this would integrate with an SMS provider
   */
  async generateAndSendOTP(phone: string): Promise<string> {
    // Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + config.otp.expiryMinutes);

    logger.info(`[MOCK OTP] Generated OTP for ${phone}: ${code} (expires at ${expiresAt})`);

    // In production, this would be sent via SMS
    // For now, we just log it
    return code;
  }

  /**
   * Mock OTP validation
   * In production, this would validate against stored OTP in database
   */
  async validateOTP(phone: string, code: string): Promise<boolean> {
    // For MVP, any 6-digit code is considered valid
    // In production, we'd check against database OTP records
    const isValid = /^\d{6}$/.test(code);
    logger.info(`[MOCK OTP] Validating OTP for ${phone}: ${code} - ${isValid ? 'VALID' : 'INVALID'}`);
    return isValid;
  }
}

export default new OTPService();
