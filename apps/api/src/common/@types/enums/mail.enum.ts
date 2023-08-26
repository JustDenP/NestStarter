import { TEmailSubject } from '../interfaces/mail.interface';

export const enum Server {
  SES = 'SES',
  SMTP = 'SMTP',
}

export const enum TemplateEngine {
  ETA = 'ETA',
  HBS = 'HBS',
}

export enum EmailTemplate {
  RESET_PASSWORD_TEMPLATE = 'reset',
  WELCOME_TEMPLATE = 'welcome',
  MAGIC_LOGIN_TEMPLATE = 'magiclogin',
  NEWSLETTER_TEMPLATE = 'newsletter',
}

export const EmailSubject: Record<TEmailSubject, string> = {
  RESET_PASSWORD: 'Reset your password',
  WELCOME: 'Welcome to the app',
  MAGIC_LOGIN: 'Login to the app',
  NEWSLETTER: 'Newsletter',
};
