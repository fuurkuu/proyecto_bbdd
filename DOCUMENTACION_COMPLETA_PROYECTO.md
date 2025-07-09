# 📋 DOCUMENTACIÓN COMPLETA DEL PROYECTO BD

## 🏗️ ARQUITECTURA GENERAL

Este es un sistema de gestión empresarial desarrollado con **Next.js 15**, **React 19** y **MySQL**. Implementa un sistema completo de autenticación, autorización y gestión de recursos empresariales (compras, inversiones, presupuestos, proveedores).

### 🔧 Tecnologías Principales
- **Frontend**: Next.js 15.2.4 con React 19
- **Estilizado**: TailwindCSS 4
- **Base de Datos**: MySQL 8.0.40 
- **Autenticación**: NextAuth.js 4.24.11 con Google OAuth
- **Iconos**: Heroicons, Lucide React, React Icons
- **Gráficos**: Chart.js 4.4.9
- **Notificaciones**: React Hot Toast
- **Manejo de Archivos**: Formidable

---

## 📂 ESTRUCTURA DEL PROYECTO

```
proyecto_bd/
├── src/
│   ├── middleware.js                    # Middleware de seguridad global
│   └── app/
│       ├── layout.js                    # Layout principal de la aplicación
│       ├── page.js                      # Página raíz (redirección a login)
│       ├── globals.css                  # Estilos globales
│       ├── metadata.js                  # Metadatos SEO
│       ├── not-found.js                 # Página 404
│       ├── api/                         # APIs del backend
│       ├── components/                  # Componentes reutilizables
│       ├── functions/                   # Funciones utilitarias
│       ├── login/                       # Sistema de autenticación
│       ├── inicio/                      # Dashboard principal
│       ├── admin/                       # Panel de administración
│       ├── compra/                      # Gestión de compras
│       ├── inversion/                   # Gestión de inversiones
│       ├── presupuesto/                 # Gestión de presupuestos
│       ├── proveedor/                   # Gestión de proveedores
│       ├── perfil/                      # Perfil de usuario
│       ├── editarInversion/            # Edición de inversiones
│       ├── editarPresupuesto/          # Edición de presupuestos
│       └── prueba/                      # Componentes de prueba
├── public/                              # Archivos estáticos
├── proyectoBBDD.sql                     # Schema de base de datos
├── package.json                         # Dependencias del proyecto
└── README.md                            # Documentación básica
```

---

## 🔐 SISTEMA DE AUTENTICACIÓN Y AUTORIZACIÓN

### 🛡️ Middleware de Seguridad (`src/middleware.js`)

**Función Principal**: Controla el acceso a todas las rutas ANTES de que se procesen.

#### Características:
- **Autenticación Global**: Verifica si el usuario está autenticado
- **Control de Permisos**: Maneja permisos según tipo de usuario
- **Protección de APIs**: Controla acceso a endpoints según permisos
- **Redirección Automática**: Envía usuarios no autorizados al login

#### Tipos de Protección:
1. **Rutas de Administrador** (`/admin/*`):
   - Solo usuarios con `isAdmin: true`
   - Redirección a `/inicio` si no es admin

2. **APIs de Modificación** (create, update, delete):
   - Requiere permisos de admin O permisos de escritura (`permisos.w`)
   - Respuesta 403 si no tiene permisos

3. **APIs de Admin** (`/api/*/admin/*`):
   - Solo administradores
   - Respuesta 403 para no-admins

#### Rutas Protegidas:
```javascript
[
  '/inicio/:path*',           // Dashboard principal
  '/inversion/:path*',        // Gestión de inversiones
  '/compra/:path*',          // Gestión de compras
  '/presupuesto/:path*',     // Gestión de presupuestos
  '/proveedor/:path*',       // Gestión de proveedores
  '/admin/:path*',           // Área de administración
  '/api/:path*',             // Todas las APIs
]
```

### 🔑 Configuración de NextAuth (`src/app/api/auth/[...nextauth]/options.js`)

#### Proveedor de Autenticación:
- **Google OAuth**: Único método de login
- **Configuración**:
  - `prompt: "consent"`: Siempre pedir consentimiento
  - `access_type: "offline"`: Tokens de actualización
  - `response_type: "code"`: Flujo seguro de autorización

#### Callbacks Críticos:

**1. SignIn Callback**:
```javascript
async signIn({ user, account, profile }) {
  // 1. Buscar usuario en BD por email
  // 2. Rechazar si no existe en BD
  // 3. Obtener permisos desde BD
  // 4. Mapear permisos a objeto user
  // 5. Verificar si es administrador
}
```

**2. JWT Callback**:
```javascript
async jwt({ token, user }) {
  // Almacena datos del usuario en token JWT
  // Incluye: id, cargo, isAdmin, permisos
}
```

**3. Session Callback**:
```javascript
async session({ session, token }) {
  // Transfiere datos del token a la sesión
  // Actualiza permisos desde BD en cada acceso
}
```

#### Sistema de Permisos:
```javascript
permisos: {
  r: boolean,  // Lectura
  w: boolean,  // Escritura  
  c: boolean   // Contable
}
isAdmin: boolean  // Administrador (acceso total)
```

---

## 🏠 LAYOUT Y ESTRUCTURA VISUAL

### 📐 Layout Principal (`src/app/layout.js`)

**Componentes del Layout**:

1. **SessionProvider**: Envuelve toda la app para contexto de autenticación
2. **Layout Condicional**:
   - **Simple**: Para login/404 (sin navegación)
   - **Completo**: Para páginas autenticadas

3. **Estructura Completa**:
   ```jsx
   <div className="flex flex-row min-h-screen">
     <Nav />                    // Navegación lateral
     <div className="w-full flex flex-col">
       <ProfileHeader />        // Header con perfil
       <div className="contenido-principal">
         {children}             // Contenido de página
       </div>
       <Footer />               // Pie de página
     </div>
   </div>
   ```

#### Características Visuales:
- **Fuentes**: Geist Sans, Geist Mono, Inter
- **Fondo Decorativo**: Logo con opacidad + degradado azul
- **Responsivo**: Diseño adaptable a diferentes pantallas
- **Z-Index**: Contenido principal sobre fondo decorativo

### 🧭 Página Principal (`src/app/page.js`)

**Función**: Redirección automática desde raíz (`/`) hacia `/login`

---

## 🔧 FUNCIONES UTILITARIAS

### 🛠️ Funciones Core (`src/app/functions/functions.js`)

#### 1. `getIdUser()` - Obtener Usuario Autenticado
```javascript
// Retorna: [idUsuario, esAdmin, tienePermisosContables]
// Uso: En la mayoría de páginas para verificar autenticación
```

#### 2. `getReadOnly()` - Verificar Permisos de Escritura
```javascript
// Solo permite: Admins O usuarios con permisos.w
// Redirecciona a /inicio si no tiene permisos
```

#### 3. `isAdmin()` - Verificar Administrador
```javascript
// Solo permite: Usuarios con isAdmin: true
// Retorna: ID del usuario administrador
```

#### 4. `getSession()` - Obtener Sesión Completa
```javascript
// Retorna: Objeto de sesión completo con todos los datos
```

#### 5. `isVerificacion(id)` - Verificar Acceso a Departamento
```javascript
// Admins/Contables: Acceso a todos los departamentos
// Usuarios normales: Solo a departamentos asignados
// Retorna: boolean indicando acceso
```

#### 6. `chartData(data)` - Procesar Datos para Gráficos
```javascript
// Convierte datos de BD en formato para Chart.js
// Agrupa importes por mes del año
// Retorna: {labels: [...meses], values: [...importes]}
```

### 🗄️ Queries de Base de Datos (`src/app/functions/querys.js`)

#### Funciones de Departamentos:
- `getDepartamentos(idUser, viewAll)`: Obtener departamentos del usuario
- `seletDepatamento(id)`: Seleccionar departamento específico
- `getDepartamentosUser(iduser, idDepartamento)`: Verificar acceso a departamento

#### Funciones de Años/Bolsas:
- `getAnos(id)`: Obtener años disponibles para departamento
- `getAnosInversion(id)`: Años con inversiones
- `getAnosPresupuesto(id)`: Años con presupuestos

#### Funciones de Inversiones:
- `seletInversion(idDepartamento, ano)`: Obtener inversión por departamento/año
- `selectCompraInversion(ano)`: Obtener compras de inversión por año
- `getInversion(id)`: Obtener detalles de inversión específica

#### Funciones de Presupuestos:
- `seletPresupuesto(idDepartamento, ano)`: Obtener presupuesto por departamento/año
- `selectCompraPresupuesto(ano)`: Obtener compras de presupuesto por año

#### Funciones de Proveedores:
- `getProveedores(id, name, departamento, viewAll)`: Buscar proveedores con filtros
- `selectProveedores()`: Obtener todos los proveedores
- `getProveedorById(id)`: Obtener proveedor específico
- `getDepartamentosProveedores(id, viewAll)`: Departamentos de proveedor

#### Funciones de Usuarios:
- `getUsuario(id)`: Obtener información de usuario
- `getBolsaUserInversion(iduser, idBolsa)`: Verificar acceso a bolsa de inversión
- `getBolsaUserPresupuesto(iduser, idBolsa)`: Verificar acceso a bolsa de presupuesto

---

## 🗃️ ESTRUCTURA DE BASE DE DATOS

### 📊 Entidades Principales:

#### 1. **Usuario**
```sql
id, nombre, email, cargo
```
- Usuarios del sistema que se autentican con Google
- Relacionados con departamentos y permisos

#### 2. **Departamento** 
```sql
id, nombre
```
- Unidades organizacionales de la empresa
- Usuarios asignados a departamentos específicos

#### 3. **Bolsa**
```sql
id, dinero, ano
```
- Contenedor de presupuesto anual
- Base para inversiones y presupuestos

#### 4. **Inversion**
```sql
id, idBolsa_FK, idDepartamento_FK, cod_inversion
```
- Inversiones de departamentos por año
- Relacionadas con órdenes de compra

#### 5. **Presupuesto**
```sql
id, idBolsa_FK, idDepartamento_FK
```
- Presupuestos de departamentos por año
- Relacionados con órdenes de compra

#### 6. **Orden_Compra**
```sql
id, cod_compra, cantidad, es_inventariable, importe, fecha, observacion, idProveedor_FK
```
- Órdenes de compra del sistema
- Pueden ser de inversión o presupuesto

#### 7. **Proveedor**
```sql
id, nombre, telefono, email, direccion
```
- Proveedores de la empresa
- Relacionados con departamentos

#### 8. **Factura**
```sql
id, ruta, fecha, idOrden_Compra_FK
```
- Archivos PDF de facturas
- Asociadas a órdenes de compra

### 🔗 Relaciones Principales:

#### Tablas de Relación:
- **Departamento_Usuario**: Usuarios asignados a departamentos
- **Proveedor_Departamento**: Proveedores por departamento
- **Compra_Inversion**: Órdenes de compra de inversión
- **Compra_Presupuesto**: Órdenes de compra de presupuesto
- **Permiso_Usuario**: Permisos asignados a usuarios
- **Comentario_Orden**: Comentarios en órdenes de compra

#### Sistema de Permisos:
```sql
Permiso: id, tipo
-- Tipos: "Lectura", "Escritura", "Contable", "Administrador"

Permiso_Usuario: idUsuario_FK, idPermiso_FK
-- Asignación de permisos a usuarios
```

---

## 📱 COMPONENTES Y PÁGINAS

### 🔐 Sistema de Login (`src/app/login/`)

#### Características:
- **Autenticación con Google**: Único método de acceso
- **Verificación en BD**: Usuario debe existir en base de datos
- **Página de Error**: Manejo de errores de autenticación
- **Redirección**: Automática a `/inicio` tras login exitoso

### 🏠 Dashboard Principal (`src/app/inicio/`)

#### Funcionalidades:
- **Resumen de Datos**: Gráficos y estadísticas
- **Navegación Rápida**: Acceso a módulos principales
- **Información de Usuario**: Datos de sesión actual

### 👥 Panel de Administración (`src/app/admin/`)

#### Acceso: Solo administradores (`isAdmin: true`)

#### Funcionalidades:
- **Gestión de Usuarios**: CRUD completo
- **Gestión de Departamentos**: Crear/editar/eliminar
- **Asignación de Permisos**: Control de accesos
- **Configuración del Sistema**: Parámetros globales

### 💰 Gestión de Inversiones (`src/app/inversion/`)

#### Características:
- **Visualización por Año**: Filtrado por períodos
- **Control de Presupuesto**: Seguimiento de gastos vs presupuesto
- **Órdenes de Compra**: Creación y gestión
- **Reportes**: Gráficos y exportaciones

### 💼 Gestión de Presupuestos (`src/app/presupuesto/`)

#### Funcionalidades:
- **Planificación Anual**: Asignación de presupuestos
- **Seguimiento de Gastos**: Control en tiempo real
- **Alertas de Límites**: Notificaciones de sobregiro
- **Historial**: Comparativas entre años

### 🛒 Gestión de Compras (`src/app/compra/`)

#### Características:
- **Órdenes de Compra**: Creación y seguimiento
- **Facturas PDF**: Subida y gestión de documentos
- **Inventariables/No Inventariables**: Clasificación automática
- **Comentarios**: Sistema de notas por orden

### 🏢 Gestión de Proveedores (`src/app/proveedor/`)

#### Funcionalidades:
- **CRUD de Proveedores**: Gestión completa
- **Asignación por Departamento**: Control de acceso
- **Historial de Compras**: Órdenes por proveedor
- **Datos de Contacto**: Información completa

---

## 🔌 APIS DEL SISTEMA

### 📁 Estructura de APIs (`src/app/api/`)

#### Módulos Principales:
- `auth/`: Configuración de NextAuth
- `usuario/`: Gestión de usuarios
- `departamento/`: CRUD de departamentos
- `proveedor/`: Gestión de proveedores
- `proveedores/`: Búsqueda y listado
- `orden/`: Órdenes de compra
- `bolsa/`: Gestión de bolsas presupuestarias
- `pdf/`: Manejo de archivos PDF
- `sql/`: Conexión a base de datos
- `comentarios/`: Sistema de comentarios

#### Patrones de API:
1. **GET**: Obtener datos (requiere autenticación)
2. **POST**: Crear recursos (requiere permisos de escritura)
3. **PUT**: Actualizar recursos (requiere permisos de escritura)
4. **DELETE**: Eliminar recursos (requiere permisos de administrador)

### 🔗 Conexión a Base de Datos (`src/app/api/sql/sql.js`)

#### Configuración MySQL:
```javascript
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
```

---

## 🎨 COMPONENTES REUTILIZABLES

### 🧭 Navegación (`src/app/components/nav/`)

#### Características:
- **Menú Lateral**: Navegación principal
- **Permisos Dinámicos**: Elementos según rol de usuario
- **Estado Activo**: Indicador de página actual
- **Responsive**: Adaptable a móviles

### 👤 Header de Perfil (`src/app/components/profile/`)

#### Funcionalidades:
- **Información de Usuario**: Nombre, email, cargo
- **Botón de Logout**: Cierre de sesión
- **Indicadores**: Estado de conexión y permisos

### 📄 Modal PDF (`src/app/components/PDFModal.js`)

#### Características:
- **Visualización**: PDFs embebidos
- **Descarga**: Opción de descarga directa
- **Responsivo**: Adaptable a diferentes pantallas
- **Navegación**: Múltiples documentos

### 🦶 Footer (`src/app/components/footer/`)

#### Contenido:
- **Información de la Empresa**: Datos corporativos
- **Enlaces Útiles**: Navegación secundaria
- **Copyright**: Información legal

---

## 🔧 CONFIGURACIÓN Y DEPLOYMENT

### ⚙️ Variables de Entorno

#### Requeridas:
```env
# Base de Datos
DB_HOST=localhost
DB_USER=usuario
DB_PASSWORD=contraseña
DB_NAME=bbdd

# NextAuth
NEXTAUTH_SECRET=clave_secreta_segura
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=id_cliente_google
GOOGLE_CLIENT_SECRET=secreto_cliente_google
```

### 📦 Scripts de Desarrollo

```json
{
  "dev": "next dev",        // Desarrollo local
  "build": "next build",    // Construcción para producción
  "start": "next start",    // Servidor de producción
  "lint": "next lint"       // Verificación de código
}
```

### 🐳 Estructura de Deployment

#### Requisitos:
1. **Node.js 18+**: Runtime de JavaScript
2. **MySQL 8.0+**: Base de datos
3. **SSL Certificate**: Para HTTPS en producción
4. **Domain**: Para Google OAuth callbacks

---

## 🔒 SEGURIDAD Y BUENAS PRÁCTICAS

### 🛡️ Medidas de Seguridad:

#### 1. **Autenticación Robusta**:
- OAuth con Google (no contraseñas locales)
- Verificación de usuario en BD
- Tokens JWT seguros

#### 2. **Autorización Granular**:
- Middleware global de verificación
- Permisos por tipo de operación
- Control de acceso a departamentos

#### 3. **Protección de APIs**:
- Verificación de permisos en cada endpoint
- Respuestas de error consistentes
- Validación de datos de entrada

#### 4. **Manejo de Sesiones**:
- Duración limitada (30 días)
- Cookies seguras
- Renovación automática de permisos

### ✅ Buenas Prácticas Implementadas:

#### 1. **Código**:
- Comentarios detallados en español
- Funciones reutilizables
- Separación de responsabilidades
- Manejo de errores consistente

#### 2. **Base de Datos**:
- Consultas preparadas (prevención SQL injection)
- Índices en campos críticos
- Restricciones de integridad referencial
- Cascade deletes apropiados

#### 3. **UI/UX**:
- Diseño responsive
- Feedback visual de acciones
- Estados de carga
- Mensajes de error claros

---

## 📈 FLUJOS DE TRABAJO PRINCIPALES

### 1. 🔐 Flujo de Autenticación:
```
Usuario accede → Google OAuth → Verificación en BD → 
Obtener permisos → Crear sesión → Redirección a /inicio
```

### 2. 💰 Flujo de Creación de Inversión:
```
Seleccionar departamento → Elegir año → Verificar presupuesto →
Crear orden de compra → Subir factura → Actualizar totales
```

### 3. 🛒 Flujo de Orden de Compra:
```
Seleccionar proveedor → Llenar detalles → Asociar a inversión/presupuesto →
Guardar orden → Generar PDF → Notificar usuarios
```

### 4. 👥 Flujo de Gestión de Usuarios (Admin):
```
Crear usuario → Asignar departamentos → Configurar permisos →
Enviar invitación → Usuario hace login → Verificar acceso
```

---

## 🚀 PRÓXIMAS MEJORAS Y EXTENSIONES

### 📋 Funcionalidades Planificadas:
1. **Reportes Avanzados**: Exportación a Excel/PDF
2. **Notificaciones**: Sistema de alertas en tiempo real
3. **Audit Trail**: Registro de todas las modificaciones
4. **API REST**: Endpoints para integración externa
5. **Dashboard Ejecutivo**: Métricas y KPIs avanzados

### 🔧 Mejoras Técnicas:
1. **Cache**: Implementación de Redis
2. **CDN**: Para archivos estáticos
3. **Monitoreo**: Logs y métricas de rendimiento
4. **Testing**: Pruebas unitarias y de integración
5. **CI/CD**: Pipeline automatizado de deployment

---

## 📞 SOPORTE Y MANTENIMIENTO

### 🐛 Resolución de Problemas Comunes:

#### 1. **Error de Autenticación**:
- Verificar variables de entorno de Google
- Comprobar que el usuario existe en BD
- Revisar permisos asignados

#### 2. **Error de Base de Datos**:
- Verificar conexión a MySQL
- Comprobar estructura de tablas
- Revisar logs de consultas

#### 3. **Error de Permisos**:
- Verificar asignación en tabla Permiso_Usuario
- Comprobar middleware de autorización
- Revisar relaciones Departamento_Usuario

### 📊 Monitoreo del Sistema:
- **Logs de Aplicación**: Next.js console logs
- **Logs de BD**: MySQL query logs
- **Métricas de Usuario**: Sesiones activas
- **Rendimiento**: Tiempo de respuesta de APIs

---

## 📚 RECURSOS ADICIONALES

### 📖 Documentación de Referencia:
- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Guide](https://next-auth.js.org)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [MySQL Reference](https://dev.mysql.com/doc/)

### 🛠️ Herramientas de Desarrollo:
- **ESLint**: Linting de código
- **Prettier**: Formateo automático
- **MySQL Workbench**: Gestión de BD
- **Postman**: Testing de APIs

---

**© 2024 Sistema de Gestión Empresarial - Documentación Técnica Completa**

*Esta documentación cubre la totalidad del código y arquitectura del sistema. Para actualizaciones o consultas específicas, contactar al equipo de desarrollo.* 