
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
