import { Injectable, signal } from '@angular/core';

type Language = 'es' | 'en' | 'pt';

const translations: Record<Language, Record<string, string>> = {
  es: {
    'welcome_title': 'Bienvenido a Clínica Online',
    'login_btn': 'Iniciar Sesión',
    'register_btn': 'Registrarse',
    'login_title': 'Ingreso al Sistema',
    'login_placeholder_email': 'ej: admin@clinic.com',
    'login_placeholder_pass': 'Contraseña',
    'login_submit': 'Ingresar',
    'registration_title': 'Registro de Usuarios',
    'role_paciente': 'Paciente',
    'role_especialista': 'Especialista',
    'role_administrador': 'Administrador',
    'back_to_login': 'Volver a Login',
  },
  en: {
    'welcome_title': 'Welcome to Online Clinic',
    'login_btn': 'Log In',
    'register_btn': 'Register',
    'login_title': 'System Access',
    'login_placeholder_email': 'e.g. admin@clinic.com',
    'login_placeholder_pass': 'Password',
    'login_submit': 'Enter',
    'registration_title': 'User Registration',
    'role_paciente': 'Patient',
    'role_especialista': 'Specialist',
    'role_administrador': 'Administrator',
    'back_to_login': 'Back to Login',
  },
  pt: {
    'welcome_title': 'Bem-vindo à Clínica Online',
    'login_btn': 'Entrar',
    'register_btn': 'Registrar',
    'login_title': 'Acesso ao Sistema',
    'login_placeholder_email': 'ex: admin@clinic.com',
    'login_placeholder_pass': 'Senha',
    'login_submit': 'Entrar',
    'registration_title': 'Registro de Usuários',
    'role_paciente': 'Paciente',
    'role_especialista': 'Especialista',
    'role_administrador': 'Administrador',
    'back_to_login': 'Voltar ao Login',
  },
};

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  currentLang = signal<Language>('es');
  
  constructor() {}
  
  setLanguage(lang: Language): void {
    this.currentLang.set(lang);
  }

  translate(key: string): string {
    return translations[this.currentLang()][key] || key;
  }
}