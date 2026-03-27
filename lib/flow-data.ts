"use client"

import type { Node } from "@/components/flows/visual-flow-builder"

export interface FlowData {
  id: string
  name: string
  description: string
  status: "active" | "paused"
  lastModified: string
  nodes: Node[]
}

export const flowsData: FlowData[] = [
  {
    id: "1",
    name: "Sincronización de Clientes CRM",
    description: "Sincroniza automáticamente los clientes desde el CRM a la base de datos",
    status: "active",
    lastModified: "Hace 2 horas",
    nodes: [
      {
        id: "n1-1",
        type: "trigger",
        label: "Webhook CRM",
        x: 50,
        y: 10,
        color: "bg-primary",
        description: "Se activa cuando hay un nuevo cliente en el CRM",
        config: { triggerType: "webhook", webhookUrl: "https://api.crm.com/webhook/clients" }
      },
      {
        id: "n1-2",
        type: "action",
        label: "Validar Datos",
        x: 50,
        y: 25,
        color: "bg-secondary",
        description: "Valida que los datos del cliente estén completos",
        config: { actionType: "transform", transformCode: "validate(data.email, data.name)" }
      },
      {
        id: "n1-3",
        type: "condition",
        label: "Cliente Existe?",
        x: 50,
        y: 40,
        color: "bg-yellow-500",
        description: "Verifica si el cliente ya existe en la base de datos",
        config: { field: "n1-2.result.exists", operator: "equals", value: "true" }
      },
      {
        id: "n1-4",
        type: "action",
        label: "Actualizar Cliente",
        x: 30,
        y: 55,
        color: "bg-secondary",
        description: "Actualiza los datos del cliente existente",
        config: { 
          actionType: "database", 
          dbOperation: "update", 
          tableName: "customers",
          whereClause: "id = {{trigger.body.customerId}}",
          dbCredentialId: "cred-3"
        }
      },
      {
        id: "n1-5",
        type: "action",
        label: "Crear Cliente",
        x: 70,
        y: 55,
        color: "bg-secondary",
        description: "Crea un nuevo registro de cliente",
        config: { 
          actionType: "database", 
          dbOperation: "insert", 
          tableName: "customers",
          dbCredentialId: "cred-3"
        }
      },
      {
        id: "n1-6",
        type: "action",
        label: "Sincronizar Historial",
        x: 50,
        y: 70,
        color: "bg-secondary",
        description: "Sincroniza el historial de compras del cliente",
        config: { actionType: "http", httpMethod: "POST", endpoint: "https://api.interno.com/sync-history" }
      },
      {
        id: "n1-7",
        type: "output",
        label: "Notificar Ventas",
        x: 30,
        y: 85,
        color: "bg-green-500",
        description: "Envía notificación al equipo de ventas",
        config: { outputType: "email", recipients: "ventas@empresa.com", format: "json" }
      },
      {
        id: "n1-8",
        type: "output",
        label: "Log Auditoría",
        x: 70,
        y: 85,
        color: "bg-green-500",
        description: "Registra la operación en el log de auditoría",
        config: { outputType: "database", format: "json" }
      }
    ]
  },
  {
    id: "2",
    name: "Procesamiento de Facturas",
    description: "Procesa y valida facturas entrantes automáticamente",
    status: "active",
    lastModified: "Hace 1 día",
    nodes: [
      {
        id: "n2-1",
        type: "trigger",
        label: "Email Factura",
        x: 50,
        y: 8,
        color: "bg-primary",
        description: "Se activa cuando llega un email con factura adjunta",
        config: { triggerType: "email", subjectFilter: "Factura", emailCredentialId: "1" }
      },
      {
        id: "n2-2",
        type: "action",
        label: "Extraer Adjuntos",
        x: 50,
        y: 18,
        color: "bg-secondary",
        description: "Extrae los archivos PDF adjuntos del email",
        config: { actionType: "transform", transformCode: "extractAttachments(email, 'pdf')" }
      },
      {
        id: "n2-3",
        type: "action",
        label: "OCR Documento",
        x: 50,
        y: 28,
        color: "bg-secondary",
        description: "Aplica OCR para extraer texto del PDF",
        config: { actionType: "http", httpMethod: "POST", endpoint: "https://api.ocr.com/extract" }
      },
      {
        id: "n2-4",
        type: "action",
        label: "Extraer Datos",
        x: 50,
        y: 38,
        color: "bg-secondary",
        description: "Extrae datos estructurados de la factura",
        config: { actionType: "transform", transformCode: "parseInvoice(ocrText)" }
      },
      {
        id: "n2-5",
        type: "condition",
        label: "Factura Válida?",
        x: 50,
        y: 48,
        color: "bg-yellow-500",
        description: "Verifica que la factura tenga todos los campos requeridos",
        config: { field: "invoice.isValid", operator: "equals", value: "true" }
      },
      {
        id: "n2-6",
        type: "action",
        label: "Validar NIT",
        x: 30,
        y: 58,
        color: "bg-secondary",
        description: "Valida el NIT del proveedor con la DIAN",
        config: { actionType: "http", httpMethod: "GET", endpoint: "https://api.dian.gov.co/validate" }
      },
      {
        id: "n2-7",
        type: "action",
        label: "Marcar Revisión",
        x: 70,
        y: 58,
        color: "bg-secondary",
        description: "Marca la factura para revisión manual",
        config: { actionType: "database", dbOperation: "update", tableName: "invoices" }
      },
      {
        id: "n2-8",
        type: "action",
        label: "Guardar BD",
        x: 30,
        y: 68,
        color: "bg-secondary",
        description: "Guarda la factura validada en la base de datos",
        config: { actionType: "database", dbOperation: "insert", tableName: "invoices" }
      },
      {
        id: "n2-9",
        type: "action",
        label: "Generar Asiento",
        x: 30,
        y: 78,
        color: "bg-secondary",
        description: "Genera el asiento contable automáticamente",
        config: { actionType: "http", httpMethod: "POST", endpoint: "https://api.contabilidad.com/asientos" }
      },
      {
        id: "n2-10",
        type: "output",
        label: "Notificar Contabilidad",
        x: 30,
        y: 88,
        color: "bg-green-500",
        description: "Notifica al equipo de contabilidad",
        config: { outputType: "email", recipients: "contabilidad@empresa.com", format: "json" }
      },
      {
        id: "n2-11",
        type: "output",
        label: "Notificar Error",
        x: 70,
        y: 78,
        color: "bg-green-500",
        description: "Notifica cuando hay errores en la factura",
        config: { outputType: "notification", format: "json" }
      },
      {
        id: "n2-12",
        type: "output",
        label: "Webhook ERP",
        x: 50,
        y: 95,
        color: "bg-green-500",
        description: "Envía datos al ERP externo",
        config: { outputType: "webhook", destinationUrl: "https://erp.empresa.com/invoices", format: "json" }
      }
    ]
  },
  {
    id: "3",
    name: "Notificaciones de Pedidos",
    description: "Envía notificaciones cuando se reciben nuevos pedidos",
    status: "paused",
    lastModified: "Hace 3 días",
    nodes: [
      {
        id: "n3-1",
        type: "trigger",
        label: "Nuevo Pedido",
        x: 50,
        y: 10,
        color: "bg-primary",
        description: "Se activa cuando hay un nuevo pedido en el sistema",
        config: { triggerType: "database", dbTable: "orders", dbEvent: "INSERT" }
      },
      {
        id: "n3-2",
        type: "action",
        label: "Obtener Cliente",
        x: 50,
        y: 28,
        color: "bg-secondary",
        description: "Obtiene los datos del cliente del pedido",
        config: { actionType: "database", dbOperation: "select", tableName: "customers" }
      },
      {
        id: "n3-3",
        type: "condition",
        label: "Cliente VIP?",
        x: 50,
        y: 46,
        color: "bg-yellow-500",
        description: "Verifica si el cliente es VIP",
        config: { field: "customer.tier", operator: "equals", value: "VIP" }
      },
      {
        id: "n3-4",
        type: "output",
        label: "SMS VIP",
        x: 30,
        y: 64,
        color: "bg-green-500",
        description: "Envía SMS personalizado a cliente VIP",
        config: { outputType: "notification", format: "text" }
      },
      {
        id: "n3-5",
        type: "output",
        label: "Email Estándar",
        x: 70,
        y: 64,
        color: "bg-green-500",
        description: "Envía email de confirmación estándar",
        config: { outputType: "email", recipients: "{{customer.email}}", format: "json" }
      },
      {
        id: "n3-6",
        type: "output",
        label: "Notificar Almacén",
        x: 50,
        y: 82,
        color: "bg-green-500",
        description: "Notifica al almacén para preparar el pedido",
        config: { outputType: "webhook", destinationUrl: "https://almacen.interno/prepare", format: "json" }
      }
    ]
  },
  {
    id: "4",
    name: "Backup Automático de Datos",
    description: "Realiza copias de seguridad de la base de datos cada 24 horas",
    status: "active",
    lastModified: "Hace 1 hora",
    nodes: [
      {
        id: "n4-1",
        type: "trigger",
        label: "Cron Diario",
        x: 50,
        y: 12,
        color: "bg-primary",
        description: "Se ejecuta todos los días a las 2:00 AM",
        config: { triggerType: "schedule", cronExpression: "0 2 * * *" }
      },
      {
        id: "n4-2",
        type: "action",
        label: "Exportar BD",
        x: 50,
        y: 32,
        color: "bg-secondary",
        description: "Exporta todas las tablas de la base de datos",
        config: { actionType: "database", dbOperation: "select", tableName: "*" }
      },
      {
        id: "n4-3",
        type: "action",
        label: "Comprimir Datos",
        x: 50,
        y: 52,
        color: "bg-secondary",
        description: "Comprime los datos en formato ZIP",
        config: { actionType: "transform", transformCode: "compress(data, 'zip')" }
      },
      {
        id: "n4-4",
        type: "action",
        label: "Subir a S3",
        x: 50,
        y: 72,
        color: "bg-secondary",
        description: "Sube el backup a Amazon S3",
        config: { actionType: "http", httpMethod: "PUT", endpoint: "https://s3.amazonaws.com/backups" }
      },
      {
        id: "n4-5",
        type: "output",
        label: "Notificar Admin",
        x: 50,
        y: 92,
        color: "bg-green-500",
        description: "Envía reporte de backup al administrador",
        config: { outputType: "email", recipients: "admin@empresa.com", format: "json" }
      }
    ]
  },
  {
    id: "5",
    name: "Generación de Reportes Mensuales",
    description: "Genera y envía reportes mensuales a los administradores",
    status: "active",
    lastModified: "Hace 5 días",
    nodes: [
      {
        id: "n5-1",
        type: "trigger",
        label: "Primer Día Mes",
        x: 50,
        y: 8,
        color: "bg-primary",
        description: "Se ejecuta el primer día de cada mes",
        config: { triggerType: "schedule", cronExpression: "0 8 1 * *" }
      },
      {
        id: "n5-2",
        type: "action",
        label: "Consultar Ventas",
        x: 30,
        y: 22,
        color: "bg-secondary",
        description: "Obtiene datos de ventas del mes anterior",
        config: { actionType: "database", dbOperation: "select", tableName: "sales" }
      },
      {
        id: "n5-3",
        type: "action",
        label: "Consultar Gastos",
        x: 70,
        y: 22,
        color: "bg-secondary",
        description: "Obtiene datos de gastos del mes anterior",
        config: { actionType: "database", dbOperation: "select", tableName: "expenses" }
      },
      {
        id: "n5-4",
        type: "action",
        label: "Calcular KPIs",
        x: 50,
        y: 36,
        color: "bg-secondary",
        description: "Calcula indicadores clave de rendimiento",
        config: { actionType: "transform", transformCode: "calculateKPIs(sales, expenses)" }
      },
      {
        id: "n5-5",
        type: "action",
        label: "Generar Gráficos",
        x: 50,
        y: 50,
        color: "bg-secondary",
        description: "Genera gráficos para el reporte",
        config: { actionType: "http", httpMethod: "POST", endpoint: "https://api.charts.com/generate" }
      },
      {
        id: "n5-6",
        type: "action",
        label: "Crear PDF",
        x: 50,
        y: 64,
        color: "bg-secondary",
        description: "Genera el documento PDF del reporte",
        config: { actionType: "http", httpMethod: "POST", endpoint: "https://api.pdf.com/create" }
      },
      {
        id: "n5-7",
        type: "action",
        label: "Guardar Reporte",
        x: 30,
        y: 78,
        color: "bg-secondary",
        description: "Guarda el reporte en la base de datos",
        config: { actionType: "database", dbOperation: "insert", tableName: "reports" }
      },
      {
        id: "n5-8",
        type: "output",
        label: "Email Gerencia",
        x: 50,
        y: 92,
        color: "bg-green-500",
        description: "Envía el reporte a la gerencia",
        config: { outputType: "email", recipients: "gerencia@empresa.com", format: "json" }
      },
      {
        id: "n5-9",
        type: "output",
        label: "Publicar Dashboard",
        x: 70,
        y: 78,
        color: "bg-green-500",
        description: "Actualiza el dashboard ejecutivo",
        config: { outputType: "webhook", destinationUrl: "https://dashboard.interno/update", format: "json" }
      },
      {
        id: "n5-10",
        type: "output",
        label: "Archivar S3",
        x: 30,
        y: 92,
        color: "bg-green-500",
        description: "Archiva el reporte en S3",
        config: { outputType: "webhook", destinationUrl: "https://s3.amazonaws.com/reports", format: "json" }
      }
    ]
  },
  {
    id: "6",
    name: "Actualización de Inventario",
    description: "Actualiza el inventario en tiempo real desde múltiples fuentes",
    status: "active",
    lastModified: "Hace 30 minutos",
    nodes: [
      {
        id: "n6-1",
        type: "trigger",
        label: "Webhook Tienda",
        x: 25,
        y: 8,
        color: "bg-primary",
        description: "Recibe actualizaciones de la tienda online",
        config: { triggerType: "webhook", webhookUrl: "https://api.interno/webhook/store" }
      },
      {
        id: "n6-2",
        type: "trigger",
        label: "Webhook POS",
        x: 50,
        y: 8,
        color: "bg-primary",
        description: "Recibe actualizaciones del punto de venta",
        config: { triggerType: "webhook", webhookUrl: "https://api.interno/webhook/pos" }
      },
      {
        id: "n6-3",
        type: "trigger",
        label: "Webhook Almacén",
        x: 75,
        y: 8,
        color: "bg-primary",
        description: "Recibe actualizaciones del almacén",
        config: { triggerType: "webhook", webhookUrl: "https://api.interno/webhook/warehouse" }
      },
      {
        id: "n6-4",
        type: "action",
        label: "Normalizar Datos",
        x: 50,
        y: 20,
        color: "bg-secondary",
        description: "Normaliza los datos de diferentes fuentes",
        config: { actionType: "transform", transformCode: "normalizeInventory(source, data)" }
      },
      {
        id: "n6-5",
        type: "action",
        label: "Validar Stock",
        x: 50,
        y: 32,
        color: "bg-secondary",
        description: "Valida que las cantidades sean correctas",
        config: { actionType: "transform", transformCode: "validateStock(data)" }
      },
      {
        id: "n6-6",
        type: "condition",
        label: "Stock Bajo?",
        x: 50,
        y: 44,
        color: "bg-yellow-500",
        description: "Verifica si el stock está por debajo del mínimo",
        config: { field: "product.stock", operator: "less", value: "10" }
      },
      {
        id: "n6-7",
        type: "action",
        label: "Actualizar BD",
        x: 70,
        y: 56,
        color: "bg-secondary",
        description: "Actualiza el inventario en la base de datos",
        config: { actionType: "database", dbOperation: "update", tableName: "inventory" }
      },
      {
        id: "n6-8",
        type: "action",
        label: "Crear Alerta",
        x: 30,
        y: 56,
        color: "bg-secondary",
        description: "Crea alerta de stock bajo",
        config: { actionType: "database", dbOperation: "insert", tableName: "alerts" }
      },
      {
        id: "n6-9",
        type: "action",
        label: "Generar Orden",
        x: 30,
        y: 68,
        color: "bg-secondary",
        description: "Genera orden de compra automática",
        config: { actionType: "http", httpMethod: "POST", endpoint: "https://api.proveedores.com/orders" }
      },
      {
        id: "n6-10",
        type: "output",
        label: "Notificar Compras",
        x: 30,
        y: 80,
        color: "bg-green-500",
        description: "Notifica al departamento de compras",
        config: { outputType: "email", recipients: "compras@empresa.com", format: "json" }
      },
      {
        id: "n6-11",
        type: "output",
        label: "Sync Tienda",
        x: 55,
        y: 68,
        color: "bg-green-500",
        description: "Sincroniza inventario con la tienda online",
        config: { outputType: "webhook", destinationUrl: "https://tienda.com/api/inventory", format: "json" }
      },
      {
        id: "n6-12",
        type: "output",
        label: "Sync Marketplace",
        x: 75,
        y: 68,
        color: "bg-green-500",
        description: "Sincroniza con marketplaces externos",
        config: { outputType: "webhook", destinationUrl: "https://api.marketplace.com/inventory", format: "json" }
      },
      {
        id: "n6-13",
        type: "action",
        label: "Actualizar Cache",
        x: 65,
        y: 80,
        color: "bg-secondary",
        description: "Actualiza la caché de inventario",
        config: { actionType: "http", httpMethod: "POST", endpoint: "https://api.cache.interno/refresh" }
      },
      {
        id: "n6-14",
        type: "output",
        label: "Log Cambios",
        x: 50,
        y: 92,
        color: "bg-green-500",
        description: "Registra todos los cambios de inventario",
        config: { outputType: "database", format: "json" }
      },
      {
        id: "n6-15",
        type: "output",
        label: "Dashboard Update",
        x: 75,
        y: 92,
        color: "bg-green-500",
        description: "Actualiza dashboard de inventario",
        config: { outputType: "webhook", destinationUrl: "https://dashboard.interno/inventory", format: "json" }
      }
    ]
  },
  {
    id: "7",
    name: "Envío de Emails Marketing",
    description: "Envía campañas de email marketing segmentadas",
    status: "active",
    lastModified: "Hace 2 días",
    nodes: [
      {
        id: "n7-1",
        type: "trigger",
        label: "Iniciar Campaña",
        x: 50,
        y: 8,
        color: "bg-primary",
        description: "Se activa cuando se programa una campaña",
        config: { triggerType: "webhook", webhookUrl: "https://api.marketing/campaigns/start" }
      },
      {
        id: "n7-2",
        type: "action",
        label: "Cargar Segmento",
        x: 50,
        y: 20,
        color: "bg-secondary",
        description: "Carga la lista de contactos del segmento",
        config: { actionType: "database", dbOperation: "select", tableName: "contacts" }
      },
      {
        id: "n7-3",
        type: "action",
        label: "Filtrar Activos",
        x: 50,
        y: 32,
        color: "bg-secondary",
        description: "Filtra solo contactos activos y suscritos",
        config: { actionType: "transform", transformCode: "filterActive(contacts)" }
      },
      {
        id: "n7-4",
        type: "action",
        label: "Cargar Template",
        x: 50,
        y: 44,
        color: "bg-secondary",
        description: "Carga la plantilla de email de la campaña",
        config: { actionType: "database", dbOperation: "select", tableName: "email_templates" }
      },
      {
        id: "n7-5",
        type: "action",
        label: "Personalizar",
        x: 50,
        y: 56,
        color: "bg-secondary",
        description: "Personaliza el contenido para cada contacto",
        config: { actionType: "transform", transformCode: "personalize(template, contact)" }
      },
      {
        id: "n7-6",
        type: "output",
        label: "Enviar Email",
        x: 50,
        y: 68,
        color: "bg-green-500",
        description: "Envía el email personalizado",
        config: { outputType: "email", emailCredentialId: "1", format: "json" }
      },
      {
        id: "n7-7",
        type: "action",
        label: "Registrar Envío",
        x: 30,
        y: 80,
        color: "bg-secondary",
        description: "Registra el envío en la base de datos",
        config: { actionType: "database", dbOperation: "insert", tableName: "email_logs" }
      },
      {
        id: "n7-8",
        type: "action",
        label: "Actualizar Stats",
        x: 70,
        y: 80,
        color: "bg-secondary",
        description: "Actualiza estadísticas de la campaña",
        config: { actionType: "database", dbOperation: "update", tableName: "campaigns" }
      },
      {
        id: "n7-9",
        type: "output",
        label: "Notificar Marketing",
        x: 50,
        y: 92,
        color: "bg-green-500",
        description: "Notifica al equipo cuando termina la campaña",
        config: { outputType: "notification", format: "json" }
      }
    ]
  },
  {
    id: "8",
    name: "Validación de Pagos",
    description: "Valida y procesa pagos de múltiples pasarelas",
    status: "active",
    lastModified: "Hace 4 horas",
    nodes: [
      {
        id: "n8-1",
        type: "trigger",
        label: "Webhook Stripe",
        x: 25,
        y: 8,
        color: "bg-primary",
        description: "Recibe eventos de pago de Stripe",
        config: { triggerType: "webhook", webhookUrl: "https://api.interno/webhook/stripe" }
      },
      {
        id: "n8-2",
        type: "trigger",
        label: "Webhook PayPal",
        x: 50,
        y: 8,
        color: "bg-primary",
        description: "Recibe eventos de pago de PayPal",
        config: { triggerType: "webhook", webhookUrl: "https://api.interno/webhook/paypal" }
      },
      {
        id: "n8-3",
        type: "trigger",
        label: "Webhook MercadoPago",
        x: 75,
        y: 8,
        color: "bg-primary",
        description: "Recibe eventos de pago de MercadoPago",
        config: { triggerType: "webhook", webhookUrl: "https://api.interno/webhook/mercadopago" }
      },
      {
        id: "n8-4",
        type: "action",
        label: "Normalizar Pago",
        x: 50,
        y: 20,
        color: "bg-secondary",
        description: "Normaliza los datos de pago de diferentes pasarelas",
        config: { actionType: "transform", transformCode: "normalizePayment(gateway, data)" }
      },
      {
        id: "n8-5",
        type: "condition",
        label: "Pago Exitoso?",
        x: 50,
        y: 32,
        color: "bg-yellow-500",
        description: "Verifica si el pago fue exitoso",
        config: { field: "payment.status", operator: "equals", value: "success" }
      },
      {
        id: "n8-6",
        type: "action",
        label: "Verificar Fraude",
        x: 35,
        y: 44,
        color: "bg-secondary",
        description: "Ejecuta verificación anti-fraude",
        config: { actionType: "http", httpMethod: "POST", endpoint: "https://api.antifraud.com/check" }
      },
      {
        id: "n8-7",
        type: "action",
        label: "Registrar Fallo",
        x: 70,
        y: 44,
        color: "bg-secondary",
        description: "Registra el pago fallido",
        config: { actionType: "database", dbOperation: "insert", tableName: "failed_payments" }
      },
      {
        id: "n8-8",
        type: "condition",
        label: "Es Fraude?",
        x: 35,
        y: 56,
        color: "bg-yellow-500",
        description: "Verifica si el pago es sospechoso",
        config: { field: "fraud.score", operator: "greater", value: "80" }
      },
      {
        id: "n8-9",
        type: "action",
        label: "Bloquear Pago",
        x: 20,
        y: 68,
        color: "bg-secondary",
        description: "Bloquea y marca el pago como fraudulento",
        config: { actionType: "http", httpMethod: "POST", endpoint: "https://api.pasarela/refund" }
      },
      {
        id: "n8-10",
        type: "action",
        label: "Confirmar Pago",
        x: 50,
        y: 68,
        color: "bg-secondary",
        description: "Confirma y registra el pago exitoso",
        config: { actionType: "database", dbOperation: "insert", tableName: "payments" }
      },
      {
        id: "n8-11",
        type: "output",
        label: "Email Confirmación",
        x: 50,
        y: 80,
        color: "bg-green-500",
        description: "Envía email de confirmación al cliente",
        config: { outputType: "email", recipients: "{{customer.email}}", format: "json" }
      }
    ]
  }
]

export function getFlowById(id: string): FlowData | undefined {
  return flowsData.find(flow => flow.id === id)
}

export function getEmptyFlow(id: string, name: string, description: string): FlowData {
  return {
    id,
    name,
    description,
    status: "paused",
    lastModified: "Ahora",
    nodes: []
  }
}
