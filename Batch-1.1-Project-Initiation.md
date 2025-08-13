# Batch 1.1 – Project Initiation

This file captures decisions, sign-offs, and resource readiness for Batch 1.1 per `Execution_Plan.md`.

## 1.1.1 Confirm project requirements and architecture

- **Project objective**: Deploy a cannabis product ordering dashboard with a static frontend, Excel-driven data, and email-based order notifications.
- **Proposed architecture (from plan)**:
  - **Frontend**: HTML/CSS/JavaScript using Tailwind CSS utilities
  - **Data source**: `data/LiveMenu.xlsx` converted to JSON at build time via Node.js + SheetJS (`xlsx`)
  - **Backend**: PHP 8.x endpoint (`orderSubmit.php`) using PHPMailer over SMTP
  - **CI/CD & Hosting**: GitHub repository + IONOS Deploy Now (staging via `dev`, production via `main`)
  - **Secrets**: Environment variables for SMTP credentials (no secrets in repo)
  - **Security**: Honeypot spam check, deny access to `.xlsx` and `.log` via `.htaccess`
  - **Domain & TLS**: Custom domain on IONOS with auto Let's Encrypt TLS

- **Assumptions/notes**:
  - English-only interface (per plan)
  - Email notifications sent to a business-owned inbox
  - Optional server-side logging to `data/orders.log`

- **Decisions to confirm (fill in)**:
  - Frontend stack (Tailwind, vanilla JS): [x] Approved | [ ] Changes requested
  - Backend language (PHP 8.x) + PHPMailer: [x] Approved | [ ] Changes requested
  - Build step (Node LTS + SheetJS): [x] Approved | [ ] Changes requested
  - Hosting (IONOS Deploy Now): [x] Approved | [ ] Changes requested
  - Branching (main=prod, dev=staging): [x] Approved | [ ] Changes requested

- **Stakeholders & roles** (names/emails):
  - Project Manager: 
  - Technical Lead: 
  - Front-End Developer: 
  - Back-End Developer: 
  - DevOps Engineer: 
  - Security Engineer: 
  - Business Owner (sign-off authority): David (david@vindativa.com)

### Sign-off
- I confirm the requirements and architecture above.
  - Name (Business Owner): David (david@vindativa.com)
  - Date: 2025-08-13
  - Signature/Approval (email or doc link): Approved via chat by david@vindativa.com

---

## 1.1.2 Prepare project accounts and resources

- **IONOS Deploy Now account**
  - Account email/owner: david@vindativa.com
  - Plan supports PHP + staging: [x] Yes [ ] No (action: upgrade)
  - Access verified: [x] Yes [ ] Pending

- **Custom domain**
  - Desired domain (e.g., `orders.example.com`): vindativa.com
  - Registrar: 
  - DNS control confirmed: [x] Yes [ ] Pending

- **SMTP email account/service**
  - Provider (e.g., IONOS mail, Gmail, SendGrid, etc.): (to be provided)
  - From address (e.g., `orders@domain.com`): (to be provided)
  - SMTP Host:  
  - SMTP Port:  
  - Username:  
  - Password:  
  - Security: [ ] STARTTLS (587) [ ] SMTPS (465)
  - Test email sent/verified: [ ] Yes [x] Pending

- **Secrets handling & sharing**
  - Secret storage (GitHub Actions Secrets + IONOS env): [ ] Planned [ ] Configured
  - Sharing method with team (password manager/secure channel): 
  - Access provided to required roles: [ ] PM [ ] TL [ ] Dev [ ] DevOps [ ] Security

### Verification checklist
- IONOS account accessible and suitable for PHP + staging: [x] Verified
- Domain registered and under control: [x] Verified
- SMTP credentials validated by a test email: [ ] Verified

### Rollback guidance
- If any resource is not ready, pause development tasks and resolve account/domain/SMTP setup first. Use temporary test SMTP (e.g., Mailtrap) if production SMTP is delayed.

---

## Meeting minutes (template)
- Date/Time: 
- Attendees: 
- Agenda: Requirements review; Architecture confirmation; Accounts & resources
- Notes / Decisions:
  - 
- Action items:
  - Owner:  | Task:  | Due: 
  - Owner:  | Task:  | Due: 

---

## Next actions (post Batch 1.1)
- Create GitHub repo and initial structure (Batch 1.2)
- Proceed with local environment setup (Node LTS, PHP 8.x)
