-- Seed comprehensive knowledge base articles for all platform modules
INSERT INTO knowledge_base_articles (title, content, category, excerpt, tags, is_featured, status, organization_id) VALUES

-- Dashboard & Analytics Module Articles
('Setting up your TITANIS™ Dashboard', 
'Learn how to configure your executive dashboard with custom widgets, KPIs, and real-time monitoring. This comprehensive guide covers widget placement, data source configuration, and creating role-based views for different stakeholders.

## Getting Started
1. Navigate to the Dashboard module from the main sidebar
2. Click "Customize Dashboard" in the top-right corner
3. Select from available widgets: Risk Heatmap, Compliance Score, Recent Incidents, Policy Status
4. Drag and drop widgets to arrange your optimal layout

## Widget Configuration
- **Risk Heatmap**: Configure risk tolerance levels and color coding
- **Compliance Score**: Select frameworks and set target percentages  
- **Metrics Grid**: Choose key performance indicators to track
- **Recent Activity**: Filter by module and time range

## Role-Based Views
Create customized dashboards for different user roles:
- **Executive View**: High-level KPIs and trend analysis
- **Manager View**: Operational metrics and team performance
- **Analyst View**: Detailed data and drill-down capabilities

## Best Practices
- Start with 4-6 widgets for optimal performance
- Use consistent color schemes across widgets
- Set appropriate refresh intervals for real-time data
- Create saved layouts for different meeting types',
'Getting Started', 'Master dashboard configuration with custom widgets, KPIs, and role-based views for optimal GRC monitoring and reporting.', 
ARRAY['dashboard', 'setup', 'widgets', 'configuration'], true, 'published', NULL),

('Understanding GRC Metrics and KPIs', 
'Comprehensive guide to interpreting and leveraging key performance indicators within the TITANIS™ platform for effective governance, risk, and compliance management.

## Core GRC Metrics

### Risk Metrics
- **Risk Score**: Calculated using Impact × Likelihood formula
- **Risk Velocity**: Rate of change in risk levels over time
- **Mitigation Effectiveness**: Percentage of successfully mitigated risks
- **Risk Tolerance Adherence**: Alignment with organizational risk appetite

### Compliance Metrics
- **Control Effectiveness**: Percentage of controls operating effectively
- **Compliance Coverage**: Scope of regulatory requirements addressed
- **Evidence Collection Rate**: Percentage of required evidence collected
- **Audit Readiness Score**: Overall preparedness for regulatory audits

### Operational Metrics
- **Policy Acknowledgment Rate**: Staff compliance with policy training
- **Incident Response Time**: Average time from detection to resolution
- **Vendor Risk Score**: Aggregate risk assessment across vendor portfolio
- **Training Completion Rate**: Percentage of required training completed

## Interpreting Dashboard Indicators

### Color Coding System
- **Green (0-30)**: Low risk, optimal performance
- **Yellow (31-70)**: Medium risk, attention required  
- **Red (71-100)**: High risk, immediate action needed

### Trend Analysis
- **Upward Trends**: Improving performance or increasing risk
- **Downward Trends**: Declining performance or decreasing risk
- **Flat Trends**: Stable conditions requiring monitoring

## Benchmarking and Targets
Set realistic targets based on:
- Industry standards and peer comparisons
- Regulatory requirements and expectations
- Historical performance and improvement trends
- Organizational risk tolerance and capacity',
'Analytics', 'Learn to interpret key GRC metrics, KPIs, and dashboard indicators for data-driven decision making and performance optimization.', 
ARRAY['metrics', 'kpi', 'analytics', 'performance'], true, 'published', NULL),

-- Risk Management Module Articles
('Risk Assessment Framework Setup', 
'Complete guide to configuring risk assessment frameworks including NIST, ISO 31000, and COSO within the TITANIS™ platform.

## Supported Frameworks

### NIST Cybersecurity Framework
- **Identify**: Asset management, governance, risk assessment
- **Protect**: Access control, awareness training, data security
- **Detect**: Anomaly detection, continuous monitoring
- **Respond**: Response planning, communications, analysis
- **Recover**: Recovery planning, improvements, communications

### ISO 31000 Risk Management
- **Principles**: Value creation, integration, structured approach
- **Framework**: Leadership, design, implementation, evaluation
- **Process**: Communication, scope establishment, assessment, treatment

### COSO Enterprise Risk Management
- **Governance & Culture**: Board oversight, operating structures
- **Strategy & Objective-Setting**: Risk appetite, strategic alignment
- **Performance**: Risk identification, assessment, prioritization
- **Review & Revision**: Substantial change assessment, performance review
- **Information & Communication**: Risk information, reporting

## Framework Configuration Steps

1. **Select Primary Framework**
   - Navigate to Risk Management > Settings
   - Choose your organization''s primary risk framework
   - Configure framework-specific risk categories

2. **Define Risk Categories**
   - Strategic risks (market, competitive, reputation)
   - Operational risks (process, technology, human resources)
   - Financial risks (credit, market, liquidity)
   - Compliance risks (regulatory, legal, contractual)

3. **Set Risk Appetite and Tolerance**
   - Define acceptable risk levels for each category
   - Establish escalation thresholds
   - Configure automated alerts and notifications

4. **Configure Risk Scoring**
   - Set impact scales (1-5 or 1-10)
   - Define likelihood scales with probability ranges
   - Customize risk heat map color schemes

## Integration with Other Modules
- Link compliance requirements to risk categories
- Connect incident types to risk classifications
- Align policy frameworks with risk management approach',
'Risk Management', 'Step-by-step guide to configuring risk assessment frameworks (NIST, ISO 31000, COSO) with scoring, categories, and integration.', 
ARRAY['risk', 'framework', 'nist', 'iso', 'coso', 'setup'], true, 'published', NULL),

-- Compliance Tracking Module Articles
('Compliance Framework Configuration Guide', 
'Comprehensive guide to setting up and managing compliance frameworks including SOX, GDPR, HIPAA, and ISO 27001 in TITANIS™.

## Supported Compliance Frameworks

### SOX (Sarbanes-Oxley Act)
- **Section 302**: CEO/CFO certifications
- **Section 404**: Internal control over financial reporting
- **Section 409**: Real-time disclosure requirements
- **Control Testing**: Automated testing schedules and evidence collection

### GDPR (General Data Protection Regulation)
- **Data Processing Principles**: Lawfulness, fairness, transparency
- **Individual Rights**: Access, rectification, erasure, portability
- **Data Protection Impact Assessments**: Automated DPIA workflows
- **Breach Notification**: 72-hour reporting requirements

### HIPAA (Health Insurance Portability and Accountability Act)
- **Privacy Rule**: PHI protection and patient rights
- **Security Rule**: Administrative, physical, technical safeguards
- **Breach Notification Rule**: Incident reporting and disclosure
- **Business Associate Agreements**: Third-party compliance management

### ISO 27001 Information Security Management
- **Information Security Policy**: Governance and leadership
- **Risk Management**: Information security risk assessment
- **Asset Management**: Information asset classification
- **Access Control**: User access management and monitoring

## Framework Setup Process

1. **Initial Configuration**
   - Navigate to Compliance > Framework Management
   - Select applicable frameworks for your organization
   - Configure jurisdiction-specific requirements

2. **Control Mapping**
   - Map controls to business processes
   - Assign control owners and testers
   - Set testing frequencies and methodologies

3. **Evidence Management**
   - Configure automated evidence collection
   - Set retention policies and archival rules
   - Establish review and approval workflows

4. **Monitoring and Reporting**
   - Set up automated compliance scoring
   - Configure executive dashboards
   - Schedule regulatory reports and notifications

## Best Practices
- Start with core requirements before adding optional controls
- Align control testing with business cycles
- Integrate with existing risk management processes
- Maintain clear documentation and audit trails',
'Compliance', 'Complete setup guide for major compliance frameworks (SOX, GDPR, HIPAA, ISO 27001) with control mapping and evidence management.', 
ARRAY['compliance', 'sox', 'gdpr', 'hipaa', 'iso27001', 'frameworks'], true, 'published', NULL),

-- Policy Management Module Articles
('Policy Lifecycle Management', 
'Master the complete policy lifecycle from creation through retirement using TITANIS™ policy management capabilities.

## Policy Lifecycle Stages

### 1. Policy Creation and Development
- **Template Selection**: Choose from industry-standard templates
- **Content Development**: Collaborative authoring with version control
- **Stakeholder Review**: Automated review workflows and feedback collection
- **Legal and Compliance Review**: Specialized review processes for regulatory alignment

### 2. Approval and Authorization
- **Approval Workflows**: Multi-level approval processes with escalation
- **Electronic Signatures**: Secure digital approval and sign-off
- **Board Approval**: Special workflows for board-level policy approval
- **Regulatory Approval**: External approval tracking and documentation

### 3. Publication and Distribution
- **Publication Control**: Staged rollout and publication scheduling
- **Distribution Lists**: Role-based and department-specific distribution
- **Acknowledgment Tracking**: Employee acknowledgment and understanding verification
- **Training Integration**: Link policies to required training programs

### 4. Monitoring and Compliance
- **Compliance Tracking**: Monitor adherence through various data sources
- **Exception Management**: Handle policy violations and exceptions
- **Effectiveness Monitoring**: Track policy performance and outcomes
- **Incident Correlation**: Link policy violations to incident management

### 5. Review and Updates
- **Scheduled Reviews**: Automated review cycles based on risk and regulation
- **Change Management**: Version control and impact assessment
- **Stakeholder Feedback**: Continuous improvement through user feedback
- **Regulatory Updates**: Monitor regulatory changes affecting policies

### 6. Retirement and Archival
- **Sunset Procedures**: Planned policy retirement processes
- **Archival Management**: Historical policy preservation for compliance
- **Knowledge Transfer**: Capture institutional knowledge before retirement
- **Compliance Documentation**: Maintain records for regulatory requirements

## Policy Types and Templates

### Corporate Governance Policies
- Code of Conduct and Ethics
- Conflict of Interest Policy
- Whistleblower Protection Policy
- Board Charter and Committee Charters

### Information Security Policies
- Information Security Policy
- Acceptable Use Policy
- Data Classification and Handling
- Incident Response Policy

### Human Resources Policies
- Employee Handbook
- Anti-Harassment and Discrimination
- Remote Work Policy
- Professional Development Policy

### Financial and Accounting Policies
- Financial Controls Policy
- Expense Reimbursement Policy
- Procurement and Vendor Management
- Anti-Fraud Policy

## Implementation Best Practices
- Establish clear ownership and accountability
- Use plain language and avoid technical jargon
- Include specific procedures and requirements
- Regular communication and training
- Monitor compliance through multiple channels
- Maintain current and accessible policy repository',
'Policy Management', 'Complete guide to managing policy lifecycles from creation to retirement with templates, workflows, and compliance tracking.', 
ARRAY['policy', 'lifecycle', 'templates', 'compliance', 'workflows'], true, 'published', NULL),

-- Audit Management Module Articles
('Audit Planning and Execution Workflows', 
'Comprehensive guide to planning, executing, and managing audits within the TITANIS™ platform for maximum efficiency and effectiveness.

## Audit Planning Process

### 1. Risk-Based Audit Planning
- **Risk Assessment Integration**: Leverage risk management data for audit prioritization
- **Audit Universe Development**: Comprehensive inventory of auditable entities
- **Resource Allocation**: Optimal allocation of audit resources based on risk and impact
- **Regulatory Requirements**: Ensure compliance with mandatory audit requirements

### 2. Audit Scheduling and Calendar Management
- **Annual Audit Plan**: Strategic planning with board approval
- **Quarterly Scheduling**: Detailed resource allocation and timeline management
- **Conflict Resolution**: Manage competing priorities and resource constraints
- **Stakeholder Communication**: Clear communication of audit schedules and expectations

### 3. Audit Team Assignment
- **Competency Mapping**: Match auditor skills to audit requirements
- **Independence Verification**: Ensure auditor independence and objectivity
- **Training Requirements**: Verify current training and certification status
- **Workload Balancing**: Distribute audit work across team members

## Audit Execution Workflows

### 1. Audit Initiation
- **Notification Process**: Formal audit notification to business units
- **Planning Meeting**: Kick-off meetings with stakeholders
- **Resource Coordination**: Coordinate access to systems, documents, and personnel
- **Timeline Confirmation**: Confirm audit timeline and key milestones

### 2. Fieldwork and Testing
- **Testing Procedures**: Standardized testing methodologies and sampling
- **Evidence Collection**: Systematic collection and documentation of audit evidence
- **Working Papers**: Standardized working paper templates and review processes
- **Issue Identification**: Real-time issue identification and escalation

### 3. Review and Quality Assurance
- **Supervisor Review**: Multi-level review of audit work and conclusions
- **Quality Control**: Standardized quality control procedures
- **Documentation Review**: Comprehensive review of working papers and evidence
- **Draft Report Preparation**: Collaborative report writing and review

## Audit Reporting and Follow-Up

### 1. Report Development
- **Finding Documentation**: Structured finding documentation with evidence links
- **Risk Assessment**: Impact and likelihood assessment for each finding
- **Recommendation Development**: Actionable recommendations with clear timelines
- **Management Response**: Formal management response and action plan

### 2. Report Review and Approval
- **Internal Review**: Multi-level internal review and approval process
- **Management Review**: Business unit management review and response
- **Executive Review**: Senior leadership review and approval
- **Board Reporting**: Summary reporting to audit committee and board

### 3. Follow-Up and Monitoring
- **Action Plan Tracking**: Monitor implementation of agreed actions
- **Progress Reporting**: Regular progress updates to stakeholders
- **Re-audit Planning**: Schedule follow-up audits based on risk and findings
- **Lessons Learned**: Capture insights for future audit improvement

## Collaboration Features
- **Real-time Collaboration**: Team collaboration on audit work and documentation
- **Stakeholder Portal**: Business unit access to audit status and documents
- **Communication Hub**: Centralized communication and document sharing
- **Mobile Access**: Field audit capabilities through mobile applications

## Performance Metrics
- **Audit Cycle Time**: Monitor time from planning to report issuance
- **Finding Resolution**: Track finding resolution rates and timelines
- **Stakeholder Satisfaction**: Regular feedback from audit clients
- **Value Added**: Measure value-added activities and business impact',
'Audit Management', 'Complete guide to audit planning, execution, and follow-up with workflows, templates, and performance tracking.', 
ARRAY['audit', 'planning', 'execution', 'workflows', 'reporting'], true, 'published', NULL),

-- Incident Management Module Articles
('Incident Response Framework Setup', 
'Establish comprehensive incident response capabilities with classification, escalation, and recovery procedures in TITANIS™.

## Incident Response Framework Components

### 1. Incident Classification System
- **Severity Levels**: Critical, High, Medium, Low impact classification
- **Incident Types**: Security, operational, compliance, financial incidents
- **Urgency Matrix**: Impact vs. urgency prioritization framework
- **Escalation Triggers**: Automatic escalation based on severity and time

### 2. Response Team Structure
- **Incident Commander**: Overall incident response leadership
- **Technical Teams**: Specialized response teams by incident type
- **Communication Lead**: Internal and external communication coordination
- **Legal and Compliance**: Regulatory and legal impact assessment

### 3. Communication Protocols
- **Internal Communication**: Stakeholder notification procedures
- **External Communication**: Customer, vendor, and regulatory communication
- **Media Relations**: Public relations and media response procedures
- **Documentation Standards**: Consistent incident documentation requirements

## Incident Response Procedures

### 1. Detection and Analysis
- **Detection Methods**: Automated monitoring, user reports, third-party notifications
- **Initial Assessment**: Rapid impact and scope assessment
- **Classification**: Incident type and severity determination
- **Team Activation**: Response team notification and activation

### 2. Containment and Investigation
- **Immediate Containment**: Stop or limit incident impact
- **Evidence Preservation**: Forensic evidence collection and preservation
- **Root Cause Analysis**: Systematic investigation of underlying causes
- **Impact Assessment**: Comprehensive impact evaluation

### 3. Recovery and Restoration
- **Recovery Planning**: Detailed recovery and restoration procedures
- **Business Continuity**: Maintain critical business operations
- **System Restoration**: Technical system recovery and validation
- **Monitoring**: Post-incident monitoring and validation

### 4. Post-Incident Activities
- **Lessons Learned**: Comprehensive post-incident review
- **Process Improvement**: Update procedures based on lessons learned
- **Training Updates**: Enhance training based on incident experience
- **Stakeholder Communication**: Final communication and closure

## Integration with Other Modules

### Risk Management Integration
- **Risk Updates**: Update risk assessments based on incidents
- **Control Effectiveness**: Evaluate control failures and improvements
- **Risk Appetite**: Assess incidents against risk tolerance
- **Mitigation Planning**: Develop risk mitigation from incident insights

### Compliance Integration
- **Regulatory Reporting**: Automated regulatory incident reporting
- **Compliance Impact**: Assess compliance implications of incidents
- **Evidence Management**: Link incident evidence to compliance requirements
- **Audit Coordination**: Coordinate with audit activities

### Policy Management Integration
- **Policy Violations**: Track and manage policy violation incidents
- **Policy Updates**: Update policies based on incident learnings
- **Training Requirements**: Identify training needs from incidents
- **Communication Procedures**: Align with organizational communication policies

## Performance Monitoring
- **Response Time Metrics**: Time to detection, containment, resolution
- **Impact Metrics**: Financial, operational, and reputational impact
- **Process Effectiveness**: Incident handling process performance
- **Trend Analysis**: Incident trend identification and analysis

## Automation and Technology
- **Automated Detection**: Integration with monitoring and alerting systems
- **Workflow Automation**: Automated workflow and task management
- **Communication Automation**: Automated stakeholder notification
- **Reporting Automation**: Automated incident reporting and dashboards',
'Incident Management', 'Complete incident response framework with classification, procedures, team structure, and integration across GRC modules.', 
ARRAY['incident', 'response', 'framework', 'classification', 'procedures'], true, 'published', NULL),

-- Vendor Management Module Articles
('Vendor Risk Assessment and Management', 
'Comprehensive vendor lifecycle management including risk assessment, due diligence, and ongoing monitoring within TITANIS™.

## Vendor Lifecycle Management

### 1. Vendor Onboarding and Due Diligence
- **Initial Screening**: Basic vendor qualification and screening criteria
- **Risk Assessment**: Comprehensive vendor risk evaluation methodology
- **Due Diligence**: Financial, operational, and security due diligence procedures
- **Contract Negotiation**: Risk-informed contract terms and conditions

### 2. Ongoing Monitoring and Assessment
- **Performance Monitoring**: Service level agreement monitoring and reporting
- **Risk Reassessment**: Periodic risk assessment updates and reviews
- **Compliance Monitoring**: Regulatory and contractual compliance verification
- **Relationship Management**: Vendor relationship optimization and issue resolution

### 3. Vendor Performance Management
- **Scorecard Development**: Comprehensive vendor performance scorecards
- **Benchmarking**: Vendor performance comparison and benchmarking
- **Improvement Plans**: Vendor performance improvement initiatives
- **Contract Optimization**: Contract renegotiation and optimization

## Risk Assessment Framework

### 1. Risk Categories
- **Financial Risk**: Financial stability, credit worthiness, insurance coverage
- **Operational Risk**: Service delivery, business continuity, scalability
- **Security Risk**: Cybersecurity, data protection, physical security
- **Compliance Risk**: Regulatory compliance, certifications, audit results

### 2. Assessment Methodology
- **Quantitative Assessment**: Financial metrics, performance indicators, security scores
- **Qualitative Assessment**: Management quality, reputation, strategic alignment
- **Third-Party Assessments**: Credit reports, security certifications, audit reports
- **Continuous Monitoring**: Real-time risk indicator monitoring and alerting

### 3. Risk Scoring and Classification
- **Risk Score Calculation**: Weighted risk factor scoring methodology
- **Risk Classification**: High, medium, low risk vendor classification
- **Risk Tolerance**: Organizational risk appetite for vendor relationships
- **Escalation Procedures**: Risk threshold escalation and approval processes

## Vendor Categories and Management

### 1. Critical Vendors
- **Definition**: Vendors with significant impact on business operations
- **Enhanced Due Diligence**: Comprehensive assessment and approval process
- **Ongoing Monitoring**: Frequent monitoring and assessment updates
- **Business Continuity**: Continuity planning and alternative vendor identification

### 2. Strategic Vendors
- **Definition**: Long-term strategic partnerships and alliances
- **Relationship Management**: Executive-level relationship management
- **Performance Optimization**: Collaborative performance improvement initiatives
- **Innovation Partnership**: Joint innovation and development opportunities

### 3. Transactional Vendors
- **Definition**: Standard commercial vendors with limited business impact
- **Streamlined Process**: Efficient onboarding and management procedures
- **Automated Monitoring**: Automated performance and compliance monitoring
- **Cost Optimization**: Cost management and optimization initiatives

## Compliance and Regulatory Management

### 1. Regulatory Requirements
- **Industry Regulations**: Sector-specific vendor management requirements
- **Data Protection**: GDPR, CCPA, and other data protection compliance
- **Financial Regulations**: SOX, banking, and financial services requirements
- **Security Standards**: ISO 27001, SOC 2, and other security certifications

### 2. Contract Management
- **Standard Terms**: Standardized contract terms and risk allocation
- **Risk Transfer**: Insurance, indemnification, and liability management
- **Compliance Clauses**: Regulatory compliance and audit rights
- **Termination Rights**: Contract termination and transition planning

### 3. Audit and Assessment
- **Vendor Audits**: On-site and remote vendor audit procedures
- **Assessment Reports**: Standardized vendor assessment reporting
- **Remediation Planning**: Vendor issue remediation and improvement planning
- **Certification Management**: Vendor certification tracking and renewal

## Technology Integration
- **Vendor Portal**: Self-service vendor portal for information updates
- **API Integration**: System integration for automated data exchange
- **Document Management**: Centralized vendor document repository
- **Workflow Automation**: Automated vendor management workflows

## Reporting and Analytics
- **Vendor Dashboards**: Real-time vendor performance and risk dashboards
- **Risk Reporting**: Vendor risk reporting and trend analysis
- **Performance Reports**: Vendor performance reporting and scorecards
- **Executive Reporting**: Executive-level vendor portfolio reporting',
'Vendor Management', 'Complete vendor lifecycle management with risk assessment, due diligence, monitoring, and compliance procedures.', 
ARRAY['vendor', 'risk', 'assessment', 'management', 'compliance'], true, 'published', NULL),

-- Troubleshooting Articles
('Login and Authentication Troubleshooting', 
'Resolve common login and authentication issues including password resets, account lockouts, and two-factor authentication problems.

## Common Authentication Issues

### 1. Password Reset Problems
**Issue**: Unable to reset password or reset email not received
**Solutions**:
- Check spam/junk folders for password reset email
- Verify correct email address is being used
- Ensure email domain is not blocking automated emails
- Contact system administrator if corporate email filtering is blocking messages
- Try alternative email address if multiple emails are associated with account

**Issue**: Password reset link expired or invalid
**Solutions**:
- Request new password reset link (links expire after 24 hours)
- Ensure you''re clicking the most recent reset link
- Copy and paste the full URL if clicking doesn''t work
- Clear browser cache and cookies before attempting reset

### 2. Account Lockout Issues
**Issue**: Account locked after multiple failed login attempts
**Solutions**:
- Wait for automatic unlock period (typically 15-30 minutes)
- Contact system administrator for immediate unlock
- Review account security settings and update if necessary
- Enable two-factor authentication to enhance security

**Issue**: Account disabled or suspended
**Solutions**:
- Contact system administrator or IT support
- Verify employment status and access requirements
- Check for any compliance or security policy violations
- Request account reactivation through proper channels

### 3. Two-Factor Authentication (2FA) Problems
**Issue**: 2FA code not working or expired
**Solutions**:
- Ensure device clock is synchronized (2FA codes are time-sensitive)
- Wait for new code generation (codes refresh every 30 seconds)
- Try backup codes if primary method fails
- Re-sync authenticator app with system

**Issue**: Lost access to 2FA device
**Solutions**:
- Use backup authentication codes saved during setup
- Contact system administrator for 2FA reset
- Verify identity through alternative verification methods
- Set up new 2FA device after identity verification

### 4. Browser-Related Issues
**Issue**: Login page not loading or displaying incorrectly
**Solutions**:
- Clear browser cache and cookies
- Disable browser extensions temporarily
- Try incognito/private browsing mode
- Update browser to latest version
- Try alternative browser (Chrome, Firefox, Safari, Edge)

**Issue**: "Session expired" messages
**Solutions**:
- Log out completely and log back in
- Clear browser cookies for the site
- Check system clock accuracy
- Avoid using multiple browser tabs for the same session

## Single Sign-On (SSO) Troubleshooting

### SAML Authentication Issues
**Issue**: SSO redirect loop or authentication failure
**Solutions**:
- Clear browser cache and cookies
- Verify SAML configuration with IT administrator
- Check identity provider status and availability
- Try accessing through direct login instead of SSO

**Issue**: User not found in SSO system
**Solutions**:
- Verify user account exists in identity provider
- Check user group memberships and permissions
- Confirm proper user attribute mapping
- Contact IT administrator for account provisioning

### Active Directory Integration
**Issue**: Domain authentication not working
**Solutions**:
- Verify network connectivity to domain controllers
- Check domain credentials and account status
- Confirm computer is joined to correct domain
- Try manual credential entry instead of integrated authentication

## Mobile App Authentication

### Mobile App Login Issues
**Issue**: Unable to login through mobile app
**Solutions**:
- Update mobile app to latest version
- Check internet connectivity (WiFi/cellular)
- Restart mobile app completely
- Clear app cache and data (Android) or reinstall (iOS)
- Verify mobile device date/time settings

**Issue**: Fingerprint/Face ID not working
**Solutions**:
- Verify biometric authentication is enabled in device settings
- Re-register fingerprints or face ID in device settings
- Fall back to PIN/password authentication
- Check app permissions for biometric access

## Advanced Troubleshooting

### Network and Connectivity Issues
- Verify internet connectivity and DNS resolution
- Check firewall and proxy settings
- Test from different network (mobile hotspot)
- Contact network administrator for corporate restrictions

### Certificate and Security Issues
- Check for SSL certificate errors in browser
- Verify system date and time accuracy
- Update browser security settings
- Contact IT support for certificate trust issues

## When to Contact Support
- Multiple failed troubleshooting attempts
- Suspected security breach or unauthorized access
- Need for account provisioning or role changes
- System-wide authentication problems affecting multiple users

Contact Information:
- **US Support**: +1-832-613-0619
- **UK/EU Support**: +44 2037251643
- **Email Support**: support@titanideconsulting.com
- **KJ Advisor GPTs**: https://www.titanideconsulting.com/solutions/digital-products/kj-advisor',
'Troubleshooting', 'Comprehensive troubleshooting guide for login, authentication, SSO, 2FA, and mobile access issues with step-by-step solutions.', 
ARRAY['troubleshooting', 'login', 'authentication', '2fa', 'sso'], true, 'published', NULL),

('Performance and Data Issues Troubleshooting', 
'Resolve common performance problems, data synchronization issues, and system optimization within the TITANIS™ platform.

## Performance Optimization

### 1. Slow Page Loading
**Common Causes and Solutions**:

**Large Dataset Display**
- Symptoms: Dashboards or reports taking excessive time to load
- Solutions:
  - Apply date range filters to reduce data volume
  - Use pagination for large result sets
  - Enable data caching for frequently accessed reports
  - Consider scheduled report generation for complex analytics

**Browser Performance Issues**
- Symptoms: General sluggishness, unresponsive interface
- Solutions:
  - Close unnecessary browser tabs and applications
  - Clear browser cache and temporary files
  - Disable unnecessary browser extensions
  - Increase browser memory allocation if available
  - Restart browser and try again

**Network Connectivity Problems**
- Symptoms: Intermittent loading, timeouts, connection errors
- Solutions:
  - Test internet connection speed and stability
  - Switch to wired connection if using WiFi
  - Try different DNS servers (8.8.8.8, 1.1.1.1)
  - Contact network administrator for corporate network issues

### 2. Dashboard and Widget Performance
**Issue**: Widgets not updating or displaying "Loading..." indefinitely
**Solutions**:
- Refresh individual widgets using the refresh button
- Check data source connectivity and permissions
- Verify date ranges and filters are valid
- Clear widget cache through dashboard settings
- Contact support if specific widgets consistently fail

**Issue**: Real-time data not updating
**Solutions**:
- Verify WebSocket connection in browser developer tools
- Check firewall settings for WebSocket traffic
- Refresh browser connection to re-establish real-time updates
- Switch to manual refresh mode if real-time updates fail

## Data Synchronization Issues

### 1. Import/Export Problems
**Issue**: Data import failures or partial imports
**Solutions**:
- Verify file format matches template requirements
- Check for invalid characters or formatting in data
- Ensure file size is within system limits
- Validate required fields are populated
- Review import log for specific error messages

**Issue**: Export functionality not working
**Solutions**:
- Check browser pop-up blocker settings
- Verify sufficient permissions for export operations
- Try alternative export formats (CSV, Excel, PDF)
- Clear browser download cache
- Contact administrator for export permission verification

### 2. API Integration Issues
**Issue**: Third-party system data not synchronizing
**Solutions**:
- Verify API credentials and authentication tokens
- Check API endpoint availability and status
- Review API rate limits and usage quotas
- Validate data mapping configuration
- Test connection using API testing tools

**Issue**: Scheduled synchronization failures
**Solutions**:
- Review synchronization logs for error details
- Verify system availability during scheduled times
- Check for data format changes in source systems
- Update authentication credentials if expired
- Adjust synchronization frequency if rate limited

## Browser Compatibility and Setup

### 1. Supported Browsers and Settings
**Recommended Browsers**:
- Chrome (version 90+)
- Firefox (version 88+)
- Safari (version 14+)
- Edge (version 90+)

**Required Browser Settings**:
- JavaScript enabled
- Cookies enabled for the domain
- Pop-up blocker disabled for the site
- Third-party cookies allowed
- Local storage enabled

### 2. Browser-Specific Issues
**Chrome Issues**:
- Disable aggressive ad blockers
- Check site permissions and notifications
- Clear browsing data for specific time range
- Reset Chrome settings if problems persist

**Firefox Issues**:
- Verify Enhanced Tracking Protection settings
- Check add-ons and extensions compatibility
- Clear Firefox cache and cookies
- Try Firefox Safe Mode for troubleshooting

**Safari Issues**:
- Enable JavaScript and block pop-ups appropriately
- Check Intelligent Tracking Prevention settings
- Clear Safari cache and website data
- Verify cross-site tracking settings

## Mobile Performance Optimization

### 1. Mobile App Performance
**Issue**: Slow app performance on mobile devices
**Solutions**:
- Close background apps to free memory
- Restart mobile device periodically
- Update app to latest version
- Clear app cache and data
- Check available device storage space

**Issue**: Offline synchronization problems
**Solutions**:
- Verify offline mode is enabled in app settings
- Check data synchronization settings
- Ensure adequate local storage space
- Force manual synchronization when online
- Review conflict resolution settings

### 2. Mobile Network Issues
**Issue**: Poor performance on cellular networks
**Solutions**:
- Switch to WiFi when available
- Enable data compression in app settings
- Reduce real-time update frequency
- Use cached data for frequently accessed information
- Download reports for offline viewing

## Advanced Performance Troubleshooting

### 1. Database Performance
**Issue**: Slow query performance affecting reports
**Solutions**:
- Optimize report filters and date ranges
- Use summary reports instead of detailed data
- Schedule complex reports during off-peak hours
- Contact support for database optimization
- Consider data archival for old records

### 2. System Resource Monitoring
**Tools for Performance Monitoring**:
- Browser Developer Tools (F12) for network analysis
- System Task Manager for memory and CPU usage
- Network monitoring tools for connectivity issues
- Performance profiling for detailed analysis

**Key Performance Indicators to Monitor**:
- Page load times (should be under 3 seconds)
- API response times (should be under 1 second)
- Memory usage (should not exceed 80% of available)
- Network latency (should be under 100ms for local networks)

## Escalation Procedures
When to contact technical support:
- Persistent performance issues after troubleshooting
- System-wide performance degradation
- Data corruption or synchronization failures
- API integration problems requiring server-side investigation

Contact Information:
- **US Support**: +1-832-613-0619
- **UK/EU Support**: +44 2037251643
- **Email Support**: support@titanideconsulting.com
- **Technical Documentation**: Access through Help menu
- **KJ Advisor GPTs**: https://www.titanideconsulting.com/solutions/digital-products/kj-advisor',
'Troubleshooting', 'Complete guide to resolving performance issues, data synchronization problems, and browser optimization for optimal platform experience.', 
ARRAY['troubleshooting', 'performance', 'data', 'browser', 'optimization'], true, 'published', NULL),

('Workflow and Approval Issues Troubleshooting', 
'Diagnose and resolve workflow problems, approval delays, notification failures, and user permission issues within TITANIS™.

## Workflow Management Issues

### 1. Stuck Approval Workflows
**Issue**: Approvals not progressing through workflow stages
**Diagnosis Steps**:
- Check current workflow status in the approval dashboard
- Verify approver availability and active status
- Review workflow configuration for bottlenecks
- Check for missing or invalid approval criteria

**Common Solutions**:
- **Approver Unavailable**: Assign alternate approver or escalate to supervisor
- **Invalid Criteria**: Update workflow rules to match current requirements
- **System Delays**: Manually advance workflow after verification
- **Configuration Errors**: Review and correct workflow setup with administrator

**Issue**: Workflows reverting to previous stages unexpectedly
**Solutions**:
- Review audit trail for rejection reasons
- Check for automated validation failures
- Verify required documentation is complete
- Contact workflow administrator for configuration review

### 2. Approval Notification Problems
**Issue**: Approvers not receiving notification emails
**Diagnosis**:
- Verify email addresses are current in user profiles
- Check spam/junk folders for approval notifications
- Review email delivery logs in system administration
- Test email connectivity with other system notifications

**Solutions**:
- Update email addresses in user profiles
- Add system email domain to safe senders list
- Configure email client rules to prioritize approval notifications
- Enable in-app notifications as backup to email
- Contact IT support for email delivery investigation

**Issue**: Excessive or duplicate approval notifications
**Solutions**:
- Review notification frequency settings in user preferences
- Check for duplicate approval assignments
- Verify workflow configuration for notification triggers
- Adjust notification preferences to reduce frequency

## User Permission and Access Issues

### 1. Insufficient Permissions
**Issue**: Users unable to access required functions or data
**Diagnosis Steps**:
- Review user role assignments and permissions
- Check module-specific access controls
- Verify organization and department assignments
- Review recent permission changes or updates

**Solutions**:
- Request permission updates from system administrator
- Verify correct role assignment for job function
- Check temporary access restrictions or suspensions
- Review and update user profile information

**Issue**: Users seeing unauthorized data or functions
**Solutions**:
- Immediately report potential security issue to administrator
- Review and audit user permission assignments
- Implement principle of least privilege access
- Update role-based access control configuration

### 2. Role-Based Access Control Issues
**Issue**: Role permissions not working as expected
**Solutions**:
- Review role definition and assigned permissions
- Check for conflicting permission assignments
- Verify inheritance rules for hierarchical permissions
- Test permissions in controlled environment before deploying

**Issue**: New employees not receiving appropriate access
**Solutions**:
- Implement standardized onboarding workflow
- Create role templates for common job functions
- Automate permission assignment based on department and role
- Establish regular access review and certification process

## Notification and Communication Issues

### 1. System Notification Problems
**Issue**: Important system notifications not being received
**Diagnosis**:
- Check user notification preferences and settings
- Verify system notification configuration
- Review notification delivery logs
- Test different notification channels (email, in-app, SMS)

**Solutions**:
- Update notification preferences to include critical alerts
- Configure multiple notification channels for redundancy
- Set up escalation rules for unacknowledged notifications
- Review and adjust notification frequency and timing

**Issue**: Notification overload affecting user productivity
**Solutions**:
- Implement intelligent notification filtering
- Allow users to customize notification categories
- Use digest notifications for non-urgent updates
- Implement "do not disturb" periods for focused work

### 2. Collaboration and Communication Workflow
**Issue**: Poor communication during approval processes
**Solutions**:
- Implement commenting and feedback systems within workflows
- Create standardized communication templates
- Set up automated status updates for stakeholders
- Enable real-time collaboration tools for complex approvals

**Issue**: Lack of visibility into approval status
**Solutions**:
- Create approval dashboard for managers and stakeholders
- Implement automated progress reporting
- Enable approval tracking and history viewing
- Set up escalation alerts for overdue approvals

## Integration and System Workflow Issues

### 1. Third-Party System Integration
**Issue**: Workflow integration with external systems failing
**Diagnosis**:
- Check API connectivity and authentication
- Review integration logs for error messages
- Verify data format compatibility
- Test integration endpoints independently

**Solutions**:
- Update authentication credentials for external systems
- Modify data mapping to match current system requirements
- Implement error handling and retry mechanisms
- Contact vendor support for integration assistance

**Issue**: Data synchronization affecting workflow progression
**Solutions**:
- Implement data validation checks before workflow initiation
- Create manual override options for data quality issues
- Set up automated data cleansing processes
- Establish data quality monitoring and alerting

### 2. Automated Workflow Processing
**Issue**: Automated rules not executing properly
**Solutions**:
- Review and test workflow rule logic
- Check for data conditions that prevent rule execution
- Verify system resources and processing capacity
- Update rules to handle edge cases and exceptions

**Issue**: Workflow performance degradation
**Solutions**:
- Optimize workflow rules and decision logic
- Implement parallel processing where appropriate
- Archive completed workflows to improve performance
- Scale system resources to handle increased workflow volume

## Best Practices for Workflow Management

### 1. Workflow Design Principles
- Keep workflows simple and intuitive
- Minimize required approval stages
- Implement clear escalation procedures
- Provide visibility into workflow status
- Enable mobile access for approvals

### 2. Monitoring and Optimization
- Regular review of workflow performance metrics
- User feedback collection and incorporation
- Continuous improvement of approval processes
- Training and support for workflow users

### 3. Documentation and Training
- Maintain current workflow documentation
- Provide user training on approval processes
- Create quick reference guides for common issues
- Establish help desk procedures for workflow support

## Escalation and Support Procedures
When to escalate workflow issues:
- System-wide workflow failures
- Security concerns with approval processes
- Integration problems affecting business operations
- Performance issues impacting productivity

**Contact Information**:
- **US Support**: +1-832-613-0619
- **UK/EU Support**: +44 2037251643
- **Email Support**: support@titanideconsulting.com
- **Workflow Administrator**: Available through internal support portal
- **KJ Advisor GPTs**: https://www.titanideconsulting.com/solutions/digital-products/kj-advisor

**Support Documentation**:
- Workflow Configuration Guide
- User Permission Management
- Notification Setup and Troubleshooting
- Integration and API Documentation',
'Troubleshooting', 'Comprehensive troubleshooting for workflow issues, approval delays, notifications, and user permissions with solutions and escalation procedures.', 
ARRAY['troubleshooting', 'workflow', 'approvals', 'notifications', 'permissions'], true, 'published', NULL);

-- Add trial-specific articles
INSERT INTO knowledge_base_articles (title, content, category, excerpt, tags, is_featured, status, organization_id) VALUES
('Getting Started with Your TITANIS™ Trial', 
'Welcome to your TITANIS™ trial! This guide will help you maximize your 14-day trial experience and explore all platform capabilities.

## What''s Included in Your Trial

### Full Platform Access
- Complete access to all GRC modules for 14 days
- Sample data and templates to explore functionality
- Guided tutorials and interactive walkthroughs
- Full reporting and analytics capabilities
- Mobile app access for iOS and Android

### Trial Limitations
- Maximum 5 user accounts
- Sample data environment (not production-ready)
- Limited data storage (500MB)
- Watermarked reports and exports
- Email-only support (no phone support during trial)

## Quick Start Checklist

### Day 1-2: Platform Orientation
- [ ] Complete the Welcome Wizard and initial setup
- [ ] Explore the main dashboard and navigation
- [ ] Review sample data across all modules
- [ ] Complete basic platform tutorials
- [ ] Set up your user profile and preferences

### Day 3-5: Module Exploration
- [ ] Configure Risk Management with sample risk scenarios
- [ ] Review Compliance frameworks and sample assessments
- [ ] Explore Policy Management templates and workflows
- [ ] Test Incident Management response procedures
- [ ] Evaluate Audit Management planning capabilities

### Day 6-10: Advanced Features
- [ ] Build custom reports using the Report Builder
- [ ] Test automated reporting and scheduling
- [ ] Explore Board Reporting capabilities
- [ ] Configure notifications and alerts
- [ ] Test mobile application functionality

### Day 11-14: Evaluation and Decision
- [ ] Review trial analytics and usage reports
- [ ] Assess integration requirements with existing systems
- [ ] Evaluate user training and adoption needs
- [ ] Calculate ROI and business case development
- [ ] Schedule demo with sales team for deployment planning

## Making the Most of Your Trial

### Data Setup Recommendations
- Use provided sample data to understand platform capabilities
- Import limited production data to test real-world scenarios
- Test data export capabilities for existing system migration
- Evaluate data quality and cleansing requirements

### User Collaboration Testing
- Invite key stakeholders to test collaboration features
- Test approval workflows with actual business processes
- Evaluate reporting and dashboard sharing capabilities
- Assess mobile access needs for field users

### Integration Evaluation
- Review available API documentation and capabilities
- Test sample integrations with development environment
- Evaluate single sign-on (SSO) requirements and setup
- Assess existing system integration complexity

## Trial Support Resources

### Self-Service Resources
- **Knowledge Base**: Comprehensive documentation and tutorials
- **Video Library**: Step-by-step instructional videos
- **Template Library**: Industry-specific templates and examples
- **FAQ Section**: Answers to common trial questions

### Guided Support
- **Welcome Webinar**: Weekly group orientation sessions
- **Email Support**: support@titanideconsulting.com for trial questions
- **Resource Center**: Downloadable guides and checklists
- **KJ Advisor GPTs**: AI-powered guidance and support

### Sales and Technical Consultation
- **Trial Extension**: Additional time if needed for evaluation
- **Custom Demo**: Tailored demonstration for specific requirements
- **Technical Consultation**: Architecture and integration planning
- **ROI Workshop**: Business case development assistance

## Conversion and Next Steps

### Trial Analytics Review
- Review your trial usage analytics and engagement metrics
- Identify most valuable features for your organization
- Assess user adoption and training requirements
- Evaluate integration and deployment complexity

### Subscription Planning
- Choose appropriate subscription tier based on user count and features
- Plan deployment timeline and user rollout strategy
- Identify training and change management requirements
- Develop data migration and integration plan

### Implementation Support
- **Professional Services**: Implementation and integration assistance
- **Training Programs**: User training and certification
- **Success Management**: Ongoing optimization and support
- **Community Access**: User community and best practices sharing

## Trial Success Metrics

### Platform Adoption Indicators
- Daily active users and engagement levels
- Module utilization across different business areas
- Report generation and dashboard usage
- Mobile application adoption rates

### Business Value Assessment
- Time savings in GRC processes
- Risk visibility and management improvements
- Compliance efficiency gains
- Audit preparation and response enhancements

### Technical Evaluation
- System performance and reliability
- Integration capability and complexity
- Data quality and migration requirements
- Security and compliance alignment

Contact your trial specialist or sales representative to discuss your experience and next steps for full implementation.',
'Getting Started', 'Maximize your 14-day TITANIS™ trial with this comprehensive guide covering setup, exploration, evaluation, and conversion planning.', 
ARRAY['trial', 'getting-started', 'evaluation', 'onboarding'], true, 'published', NULL),

('Demo Mode Overview and Navigation', 
'Explore TITANIS™ capabilities through our interactive demo mode with realistic scenarios and comprehensive feature demonstrations.

## Demo Mode Purpose and Benefits

### What is Demo Mode?
Demo mode provides a comprehensive, risk-free way to explore TITANIS™ capabilities using realistic data scenarios. It''s designed for:
- **Sales Presentations**: Professional demonstrations for prospects and stakeholders
- **Training and Education**: Safe environment for learning platform functionality
- **Feature Evaluation**: Comprehensive feature testing without data commitment
- **Proof of Concept**: Validation of platform capabilities for specific use cases

### Demo Mode Characteristics
- **Read-Only Environment**: Explore without making permanent changes
- **Realistic Data**: Industry-relevant scenarios and sample data
- **Full Feature Access**: Complete platform functionality demonstration
- **Guided Experience**: Built-in tutorials and explanatory content
- **Reset Capability**: Return to original state for fresh demonstrations

## Demo Scenarios Available

### Scenario 1: Financial Services Organization
**Organization Profile**: Regional bank with 500 employees
**Focus Areas**: SOX compliance, operational risk, vendor management
**Key Demonstrations**:
- Complete SOX control framework implementation
- Operational risk management including fraud prevention
- Vendor risk assessment for technology providers
- Regulatory reporting for banking compliance

### Scenario 2: Healthcare System
**Organization Profile**: Multi-location healthcare provider
**Focus Areas**: HIPAA compliance, patient safety, incident management
**Key Demonstrations**:
- HIPAA privacy and security rule implementation
- Patient safety incident tracking and analysis
- Medical device risk management
- Joint Commission audit preparation

### Scenario 3: Technology Company
**Organization Profile**: SaaS company with global operations
**Focus Areas**: ISO 27001, data privacy, security incident response
**Key Demonstrations**:
- Information security management system (ISMS)
- GDPR and CCPA privacy compliance
- Security incident response workflows
- Third-party security risk assessments

### Scenario 4: Manufacturing Enterprise
**Organization Profile**: Global manufacturing with multiple facilities
**Focus Areas**: Environmental compliance, operational safety, supply chain risk
**Key Demonstrations**:
- Environmental, health, and safety (EHS) management
- Supply chain risk assessment and monitoring
- Product quality and safety compliance
- Operational risk management across facilities

## Navigating Demo Mode

### Demo Mode Indicators
- **Demo Badge**: Clear indication of demo mode status
- **Scenario Selector**: Switch between different demo scenarios
- **Reset Options**: Return scenario to original state
- **Guided Tours**: Interactive walkthroughs of key features
- **Help Overlays**: Contextual explanations and guidance

### Demo Dashboard Features
- **Executive Summary**: High-level KPIs and performance indicators
- **Interactive Widgets**: Clickable charts and graphs with drill-down capability
- **Real-Time Simulations**: Simulated real-time data updates and alerts
- **Sample Reports**: Pre-generated reports showing typical outputs
- **Mobile Preview**: Demonstration of mobile application capabilities

## Key Features Demonstrated

### Risk Management Showcase
- **Risk Register**: Comprehensive risk inventory with heat map visualization
- **Risk Assessment**: Detailed risk evaluation methodology and scoring
- **Mitigation Planning**: Risk treatment strategies and implementation tracking
- **Reporting**: Executive risk reports and trend analysis
- **Integration**: Risk correlation with compliance and incident data

### Compliance Management Demo
- **Framework Implementation**: Multiple compliance frameworks in action
- **Control Testing**: Automated and manual control testing procedures
- **Evidence Management**: Document collection and review workflows
- **Gap Analysis**: Compliance gap identification and remediation planning
- **Audit Preparation**: Comprehensive audit readiness demonstration

### Policy Management Demonstration
- **Policy Lifecycle**: Complete policy development and approval process
- **Distribution Management**: Policy publication and acknowledgment tracking
- **Compliance Monitoring**: Policy adherence measurement and reporting
- **Update Management**: Policy revision and change management process
- **Training Integration**: Policy-related training assignment and tracking

### Incident Management Simulation
- **Incident Response**: Complete incident lifecycle from detection to closure
- **Investigation Tools**: Root cause analysis and evidence collection
- **Communication Management**: Stakeholder notification and coordination
- **Regulatory Reporting**: Automated regulatory incident reporting
- **Lessons Learned**: Post-incident analysis and process improvement

### Audit Management Preview
- **Audit Planning**: Risk-based audit planning and resource allocation
- **Execution Workflows**: Audit fieldwork and testing procedures
- **Finding Management**: Issue identification and remediation tracking
- **Reporting Capabilities**: Comprehensive audit report generation
- **Follow-up Tracking**: Recommendation implementation monitoring

### Vendor Management Exhibition
- **Vendor Assessment**: Comprehensive vendor risk evaluation process
- **Due Diligence**: Financial, operational, and security due diligence
- **Performance Monitoring**: Ongoing vendor performance measurement
- **Contract Management**: Vendor agreement tracking and renewal
- **Portfolio Analytics**: Vendor portfolio risk and performance analysis

## Interactive Demo Features

### Guided Walkthroughs
- **Welcome Tour**: Platform orientation and navigation overview
- **Module Deep Dives**: Detailed exploration of each functional area
- **Workflow Demonstrations**: End-to-end process walkthroughs
- **Reporting Showcase**: Report building and analytics capabilities
- **Integration Examples**: API and system integration demonstrations

### Self-Guided Exploration
- **Sandbox Environment**: Free exploration with realistic constraints
- **Feature Discovery**: Unguided feature exploration and testing
- **Scenario Switching**: Compare different industry scenarios
- **Custom Scenarios**: Limited ability to modify demo parameters
- **Performance Testing**: Evaluate system responsiveness and capabilities

## Demo Mode Benefits

### For Sales and Marketing
- **Professional Presentations**: Polished demonstration environment
- **Scenario Flexibility**: Industry-specific demonstrations
- **Feature Highlighting**: Emphasize key differentiators and capabilities
- **Customer Engagement**: Interactive exploration and discussion
- **Proof Points**: Realistic data supporting value propositions

### For Evaluation and Training
- **Risk-Free Learning**: Explore without fear of breaking anything
- **Realistic Experience**: Understand actual platform behavior
- **Feature Comparison**: Evaluate against requirements and alternatives
- **User Acceptance**: Test user interface and experience
- **Training Preparation**: Prepare for actual implementation training

## Converting from Demo to Trial/Subscription

### Next Steps Options
- **Start Free Trial**: Convert to 14-day full-access trial
- **Schedule Consultation**: Discuss specific requirements and implementation
- **Request Custom Demo**: Tailored demonstration with your data scenarios
- **Download Resources**: Access additional documentation and materials
- **Contact Sales**: Direct connection with sales team for pricing and planning

### Information Capture
- **Demo Feedback**: Capture user experience and feature feedback
- **Requirement Assessment**: Document specific needs and requirements
- **Timeline Planning**: Understand implementation timeline preferences
- **Budget Discussion**: Preliminary budget and investment planning
- **Technical Requirements**: Assess integration and technical needs

Demo mode provides a comprehensive, risk-free way to understand TITANIS™ capabilities and evaluate fit for your organization''s specific GRC requirements.',
'Getting Started', 'Complete guide to navigating demo mode with realistic scenarios, interactive features, and comprehensive platform demonstrations.', 
ARRAY['demo', 'navigation', 'scenarios', 'evaluation'], true, 'published', NULL);