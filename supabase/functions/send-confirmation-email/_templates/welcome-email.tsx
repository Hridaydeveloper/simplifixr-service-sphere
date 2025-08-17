import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Button as EmailButton,
  Section,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface WelcomeEmailProps {
  fullName: string
  confirmationUrl: string
}

export const WelcomeEmail = ({
  fullName,
  confirmationUrl,
}: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Welcome to Simplifixr - Please confirm your email</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={headerTitle}>Welcome to Simplifixr!</Heading>
          <Text style={headerSubtitle}>Your trusted service marketplace</Text>
        </Section>
        
        <Section style={content}>
          <Text style={greeting}>Hi {fullName}! 👋</Text>
          
          <Text style={paragraph}>
            Thank you for joining Simplifixr! We're excited to have you on board. To get 
            started and secure your account, please confirm your email address by 
            clicking the button below.
          </Text>
          
          <Section style={buttonContainer}>
            <EmailButton
              style={button}
              href={confirmationUrl}
            >
              Confirm My Email Address
            </EmailButton>
          </Section>
          
          <Section style={helpSection}>
            <Text style={helpText}>
              <strong>Need help?</strong> If the button doesn't work, copy and paste this link into your 
              browser:
            </Text>
            
            <Text style={linkText}>
              {confirmationUrl}
            </Text>
          </Section>
          
          <Text style={securityNote}>
            If you didn't create an account with Simplifixr, you can safely ignore this email. This 
            confirmation link will expire in 24 hours for security.
          </Text>
          
          <Text style={footer}>
            <strong>Best regards,</strong><br />
            The Simplifixr Team
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default WelcomeEmail

const main = {
  backgroundColor: '#f8fafc',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  padding: '20px',
}

const container = {
  margin: '0 auto',
  padding: '0',
  width: '600px',
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
}

const header = {
  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
  padding: '40px 40px 32px',
  textAlign: 'center' as const,
}

const headerTitle = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: 'bold',
  lineHeight: '1.2',
  margin: '0 0 8px',
}

const headerSubtitle = {
  color: '#ffffff',
  fontSize: '16px',
  lineHeight: '1.4',
  margin: '0',
  opacity: 0.95,
}

const content = {
  padding: '40px',
  backgroundColor: '#ffffff',
}

const greeting = {
  color: '#1f2937',
  fontSize: '22px',
  fontWeight: '700',
  lineHeight: '1.3',
  margin: '0 0 24px',
}

const paragraph = {
  color: '#4b5563',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 32px',
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0 40px',
}

const button = {
  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '16px 32px',
  border: 'none',
  cursor: 'pointer',
  boxShadow: '0 2px 4px rgba(16, 185, 129, 0.2)',
  transition: 'all 0.2s ease',
}

const helpSection = {
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
  border: '1px solid #e5e7eb',
}

const helpText = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0 0 12px',
}

const linkText = {
  color: '#10B981',
  fontSize: '13px',
  lineHeight: '1.5',
  margin: '0',
  wordBreak: 'break-all' as const,
  backgroundColor: '#f0fdf4',
  padding: '12px',
  borderRadius: '6px',
  border: '1px solid #bbf7d0',
}

const securityNote = {
  color: '#9ca3af',
  fontSize: '13px',
  lineHeight: '1.5',
  margin: '24px 0 0',
  fontStyle: 'italic',
}

const footer = {
  color: '#6b7280',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '32px 0 0',
  borderTop: '1px solid #e5e7eb',
  paddingTop: '24px',
}