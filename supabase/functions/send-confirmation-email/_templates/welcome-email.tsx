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
          
          <Text style={helpText}>
            Need help? If the button doesn't work, copy and paste this link into your 
            browser:
          </Text>
          
          <Text style={linkText}>
            {confirmationUrl}
          </Text>
          
          <Text style={footer}>
            Best regards,<br />
            The Simplifixr Team
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default WelcomeEmail

const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  width: '580px',
}

const header = {
  backgroundColor: '#10B981',
  borderRadius: '8px 8px 0 0',
  padding: '32px 40px',
  textAlign: 'center' as const,
}

const headerTitle = {
  color: '#ffffff',
  fontSize: '32px',
  fontWeight: 'bold',
  lineHeight: '1.3',
  margin: '0 0 8px',
}

const headerSubtitle = {
  color: '#ffffff',
  fontSize: '18px',
  lineHeight: '1.4',
  margin: '0',
  opacity: 0.9,
}

const content = {
  padding: '40px',
  backgroundColor: '#ffffff',
  borderRadius: '0 0 8px 8px',
  border: '1px solid #f0f0f0',
}

const greeting = {
  color: '#333333',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '1.3',
  margin: '0 0 24px',
}

const paragraph = {
  color: '#555555',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 32px',
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const button = {
  backgroundColor: '#10B981',
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
}

const helpText = {
  color: '#888888',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '32px 0 16px',
}

const linkText = {
  color: '#10B981',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0 0 32px',
  wordBreak: 'break-all' as const,
}

const footer = {
  color: '#888888',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '32px 0 0',
}