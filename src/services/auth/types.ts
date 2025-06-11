
export interface SignUpData {
  email: string;
  password: string;
  fullName: string;
  location?: string;
  role?: 'customer' | 'provider';
}

export interface SignInData {
  email: string;
  password: string;
}

export interface OTPVerificationData {
  contact: string;
  contactType: 'email' | 'phone';
  role: 'customer' | 'provider';
}

export interface OTPResult {
  success: boolean;
  otp?: string;
}

export interface VerifyOTPResult {
  verified: boolean;
  userExists: boolean;
  role: string;
  contact: string;
  contactType: string;
}

export interface CompleteAuthResult {
  success: boolean;
}
