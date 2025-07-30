import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Section,
  Hr,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';

interface CriticalAlertEmailProps {
  alertType: string;
  userName: string;
  alertMessage: string;
  actionRequired: string;
}

export const CriticalAlertEmail = ({
  alertType,
  userName,
  alertMessage,
  actionRequired,
}: CriticalAlertEmailProps) => (
  <Html>
    <Head />
    <Preview>{`URGENT: ${alertType} - Action Required`}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Text style={logo}>👑 TITANIS™</Text>
          <Text style={urgent}>URGENT ALERT</Text>
        </Section>
        
        <Heading style={h1}>🚨 {alertType}</Heading>
        
        <Text style={greeting}>Hello {userName},</Text>
        
        <Section style={alertSection}>
          <Text style={alertTitle}>CRITICAL ALERT DETAILS:</Text>
          <Text style={alertText}>{alertMessage}</Text>
        </Section>
        
        <Section style={actionSection}>
          <Text style={actionTitle}>ACTION REQUIRED:</Text>
          <Text style={actionText}>{actionRequired}</Text>
        </Section>
        
        <Section style={buttonSection}>
          <Link href="#" style={button}>
            Take Action Now
          </Link>
        </Section>
        
        <Hr style={hr} />
        
        <Text style={footer}>
          This is a critical automated alert from the TITANIS™ Platform.
          <br />
          <strong>Immediate attention required.</strong> Contact your system administrator if you need assistance.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default CriticalAlertEmail;

const main = {
  backgroundColor: '#fef2f2',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  border: '2px solid #ef4444',
};

const header = {
  padding: '20px 30px',
  backgroundColor: '#dc2626',
  textAlign: 'center' as const,
};

const logo = {
  color: '#fbbf24',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 8px 0',
  textAlign: 'center' as const,
};

const urgent = {
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '0',
  textAlign: 'center' as const,
  textTransform: 'uppercase' as const,
  letterSpacing: '2px',
};

const h1 = {
  color: '#dc2626',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '30px 0',
  padding: '0 30px',
  textAlign: 'center' as const,
};

const greeting = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
  padding: '0 30px',
};

const alertSection = {
  backgroundColor: '#fef2f2',
  border: '2px solid #fecaca',
  borderRadius: '8px',
  margin: '24px 30px',
  padding: '20px',
};

const alertTitle = {
  color: '#dc2626',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '0 0 8px 0',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
};

const alertText = {
  color: '#7f1d1d',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0',
  fontWeight: '500',
};

const actionSection = {
  backgroundColor: '#fff7ed',
  border: '2px solid #fed7aa',
  borderRadius: '8px',
  margin: '24px 30px',
  padding: '20px',
};

const actionTitle = {
  color: '#c2410c',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '0 0 8px 0',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
};

const actionText = {
  color: '#9a3412',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0',
  fontWeight: '500',
};

const buttonSection = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#dc2626',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
  lineHeight: '1.25',
};

const hr = {
  borderColor: '#fecaca',
  margin: '32px 30px',
};

const footer = {
  color: '#7f1d1d',
  fontSize: '12px',
  lineHeight: '16px',
  padding: '0 30px',
  textAlign: 'center' as const,
};