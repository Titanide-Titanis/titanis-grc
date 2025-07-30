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

interface WizardCompletionEmailProps {
  wizardType: string;
  userName: string;
  completionSummary: string;
  resultUrl: string;
}

export const WizardCompletionEmail = ({
  wizardType,
  userName,
  completionSummary,
  resultUrl,
}: WizardCompletionEmailProps) => (
  <Html>
    <Head />
    <Preview>{`${wizardType} wizard completed successfully`}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Text style={logo}>👑 TITANIS™</Text>
        </Section>
        
        <Heading style={h1}>Wizard Completed Successfully</Heading>
        
        <Text style={greeting}>Hello {userName},</Text>
        
        <Text style={text}>
          Your <strong>{wizardType}</strong> wizard has been completed successfully.
        </Text>
        
        <Section style={summarySection}>
          <Text style={summaryTitle}>Summary:</Text>
          <Text style={summaryText}>{completionSummary}</Text>
        </Section>
        
        <Section style={buttonSection}>
          <Link href={resultUrl} style={button}>
            View Results
          </Link>
        </Section>
        
        <Hr style={hr} />
        
        <Text style={footer}>
          This is an automated notification from the TITANIS™ Platform.
          <br />
          If you have any questions, please contact your system administrator.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default WizardCompletionEmail;

const main = {
  backgroundColor: '#f8fafc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const header = {
  padding: '20px 30px',
  backgroundColor: '#1e293b',
  textAlign: 'center' as const,
};

const logo = {
  color: '#fbbf24',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0',
  textAlign: 'center' as const,
};

const h1 = {
  color: '#1e293b',
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

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
  padding: '0 30px',
};

const summarySection = {
  backgroundColor: '#f1f5f9',
  borderRadius: '8px',
  margin: '24px 30px',
  padding: '20px',
};

const summaryTitle = {
  color: '#1e293b',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '0 0 8px 0',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
};

const summaryText = {
  color: '#475569',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0',
};

const buttonSection = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#fbbf24',
  borderRadius: '8px',
  color: '#1e293b',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
  lineHeight: '1.25',
};

const hr = {
  borderColor: '#e2e8f0',
  margin: '32px 30px',
};

const footer = {
  color: '#64748b',
  fontSize: '12px',
  lineHeight: '16px',
  padding: '0 30px',
  textAlign: 'center' as const,
};