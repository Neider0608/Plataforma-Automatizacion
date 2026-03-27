"use client"

// Store global de credenciales para usar en toda la aplicación
export type CredentialType = "email" | "database" | "api" | "oauth" | "ftp" | "ssh"

export interface Credential {
  id: string
  name: string
  type: CredentialType
  provider?: string
  status: "active" | "expired" | "pending"
  createdAt: string
  lastUsed?: string
  config: Record<string, any>
}

// Credenciales de ejemplo
export const defaultCredentials: Credential[] = [
  {
    id: "cred-1",
    name: "Gmail - Ventas",
    type: "email",
    provider: "gmail",
    status: "active",
    createdAt: "2024-01-15",
    lastUsed: "Hace 5 minutos",
    config: {
      email: "ventas@empresa.com",
      authType: "oauth",
      scopes: ["read", "send"],
    },
  },
  {
    id: "cred-2",
    name: "Outlook - Soporte",
    type: "email",
    provider: "outlook",
    status: "active",
    createdAt: "2024-01-10",
    lastUsed: "Hace 2 horas",
    config: {
      email: "soporte@empresa.com",
      authType: "oauth",
      scopes: ["read", "send"],
    },
  },
  {
    id: "cred-3",
    name: "PostgreSQL - Producción",
    type: "database",
    provider: "postgresql",
    status: "active",
    createdAt: "2024-01-05",
    lastUsed: "Hace 1 minuto",
    config: {
      host: "db.empresa.com",
      port: 5432,
      database: "produccion",
      ssl: true,
      sslMode: "require",
    },
  },
  {
    id: "cred-4",
    name: "MySQL - Reportes",
    type: "database",
    provider: "mysql",
    status: "active",
    createdAt: "2024-01-08",
    lastUsed: "Hace 30 minutos",
    config: {
      host: "mysql.empresa.com",
      port: 3306,
      database: "reportes",
      ssl: true,
    },
  },
  {
    id: "cred-5",
    name: "API Stripe",
    type: "api",
    provider: "stripe",
    status: "active",
    createdAt: "2024-01-12",
    lastUsed: "Hace 10 minutos",
    config: {
      authType: "bearer",
      keyPrefix: "sk_live_",
    },
  },
  {
    id: "cred-6",
    name: "API Twilio",
    type: "api",
    provider: "twilio",
    status: "active",
    createdAt: "2024-01-14",
    lastUsed: "Hace 1 hora",
    config: {
      authType: "basic",
      accountSid: "AC...",
    },
  },
  {
    id: "cred-7",
    name: "Servidor IMAP Personalizado",
    type: "email",
    provider: "imap",
    status: "active",
    createdAt: "2024-01-18",
    config: {
      imapHost: "imap.miservidor.com",
      imapPort: 993,
      smtpHost: "smtp.miservidor.com",
      smtpPort: 587,
      ssl: true,
    },
  },
]

// Función para obtener credenciales por tipo
export function getCredentialsByType(type: CredentialType): Credential[] {
  return defaultCredentials.filter((c) => c.type === type && c.status === "active")
}

// Función para obtener una credencial por ID
export function getCredentialById(id: string): Credential | undefined {
  return defaultCredentials.find((c) => c.id === id)
}

// Proveedores de email soportados
export const emailProviders = [
  {
    id: "gmail",
    name: "Gmail",
    icon: "/icons/gmail.svg",
    color: "bg-red-500",
    authType: "oauth",
    description: "Conectar con cuenta de Google",
    oauthConfig: {
      authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
      scopes: ["https://www.googleapis.com/auth/gmail.readonly", "https://www.googleapis.com/auth/gmail.send"],
      requiresClientId: true,
    },
  },
  {
    id: "outlook",
    name: "Outlook / Office 365",
    icon: "/icons/outlook.svg",
    color: "bg-blue-500",
    authType: "oauth",
    description: "Conectar con cuenta de Microsoft",
    oauthConfig: {
      authUrl: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
      scopes: ["https://graph.microsoft.com/Mail.Read", "https://graph.microsoft.com/Mail.Send"],
      requiresClientId: true,
    },
  },
  {
    id: "yahoo",
    name: "Yahoo Mail",
    icon: "/icons/yahoo.svg",
    color: "bg-purple-500",
    authType: "oauth",
    description: "Conectar con cuenta de Yahoo",
    oauthConfig: {
      authUrl: "https://api.login.yahoo.com/oauth2/request_auth",
      scopes: ["mail-r", "mail-w"],
      requiresClientId: true,
    },
  },
  {
    id: "imap",
    name: "IMAP / SMTP",
    icon: null,
    color: "bg-gray-500",
    authType: "credentials",
    description: "Configuración manual de servidor",
    imapConfig: {
      requiresHost: true,
      requiresPort: true,
      requiresUsername: true,
      requiresPassword: true,
      supportsSSL: true,
      supportsTLS: true,
    },
  },
]

// Proveedores de base de datos soportados
export const databaseProviders = [
  {
    id: "postgresql",
    name: "PostgreSQL",
    icon: "/icons/postgres.svg",
    color: "bg-blue-600",
    defaultPort: 5432,
    supportsSSL: true,
    sslModes: ["disable", "allow", "prefer", "require", "verify-ca", "verify-full"],
  },
  {
    id: "mysql",
    name: "MySQL",
    icon: "/icons/mysql.svg",
    color: "bg-orange-500",
    defaultPort: 3306,
    supportsSSL: true,
    sslModes: ["disabled", "preferred", "required"],
  },
  {
    id: "mariadb",
    name: "MariaDB",
    icon: "/icons/mariadb.svg",
    color: "bg-teal-500",
    defaultPort: 3306,
    supportsSSL: true,
  },
  {
    id: "mongodb",
    name: "MongoDB",
    icon: "/icons/mongodb.svg",
    color: "bg-green-600",
    defaultPort: 27017,
    supportsSSL: true,
    connectionStringFormat: "mongodb+srv://",
  },
  {
    id: "sqlserver",
    name: "SQL Server",
    icon: "/icons/sqlserver.svg",
    color: "bg-red-600",
    defaultPort: 1433,
    supportsSSL: true,
  },
  {
    id: "oracle",
    name: "Oracle",
    icon: "/icons/oracle.svg",
    color: "bg-red-700",
    defaultPort: 1521,
    supportsSSL: true,
  },
  {
    id: "sqlite",
    name: "SQLite",
    icon: "/icons/sqlite.svg",
    color: "bg-blue-400",
    isFileBasedl: true,
  },
]

// Tipos de autenticación HTTP
export const httpAuthTypes = [
  { id: "none", name: "Sin autenticación", description: "Petición pública sin credenciales" },
  { id: "bearer", name: "Bearer Token", description: "Token JWT o similar en header Authorization" },
  { id: "basic", name: "Basic Auth", description: "Usuario y contraseña codificados en Base64" },
  { id: "apikey", name: "API Key", description: "Clave de API en header o query param" },
  { id: "oauth2", name: "OAuth 2.0", description: "Autenticación con tokens OAuth" },
  { id: "digest", name: "Digest Auth", description: "Autenticación HTTP Digest" },
  { id: "ntlm", name: "NTLM", description: "Autenticación Windows NTLM" },
  { id: "aws", name: "AWS Signature", description: "AWS Signature Version 4" },
]
