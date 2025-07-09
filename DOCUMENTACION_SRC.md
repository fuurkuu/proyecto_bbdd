# 📋 DOCUMENTACIÓN COMPLETA DEL DIRECTORIO SRC

## 🏗️ Estructura General

La carpeta `src` es el directorio principal del código fuente de la aplicación Next.js. Contiene toda la lógica de negocio, componentes, páginas y configuraciones del sistema de gestión Salesianos.

```
src/
├── middleware.js          # 🛡️ Middleware de autenticación y permisos
└── app/                   # 📱 Directorio principal de la aplicación Next.js 13+
    ├── globals.css        # 🎨 Estilos globales CSS
    ├── metadata.js        # 📊 Metadatos SEO de la aplicación
    ├── not-found.js       # 🔍 Página 404 personalizada
    ├── page.js            # 🏠 Página principal (redirección a login)
    ├── layout.js          # 📐 Layout principal con navegación
    ├── favicon.ico        # 🔸 Icono de la aplicación
    ├── api/               # 🔌 Rutas de API
    ├── components/        # 🧩 Componentes reutilizables
    ├── functions/         # ⚙️ Funciones utilitarias
    ├── admin/             # 👑 Panel de administración
    ├── inicio/            # 🏁 Páginas de inicio
    ├── login/             # 🔐 Sistema de autenticación
    ├── compra/            # 💰 Gestión de compras
    ├── proveedor/         # 🏪 Gestión de proveedores
    ├── presupuesto/       # 📈 Gestión de presupuestos
    ├── inversion/         # 💎 Gestión de inversiones
    ├── editarPresupuesto/ # ✏️ Edición de presupuestos
    ├── editarInversion/   # ✏️ Edición de inversiones
    ├── perfil/            # 👤 Perfil de usuario
    └── prueba/            # 🧪 Páginas de testing
```

---

## 📁 ARCHIVOS PRINCIPALES DE LA RAÍZ

### 🛡️ `middleware.js`
**Propósito**: Sistema de seguridad y control de acceso
- **Función**: Intercepta todas las peticiones HTTP para verificar autenticación y permisos
- **Características**:
  - Verificación de sesiones de usuario
  - Control de permisos por ruta (admin, escritura, lectura)
  - Protección de páginas y APIs
  - Redirecciones automáticas según el tipo de usuario
  - Manejo de diferentes niveles de acceso

---

## 📱 DIRECTORIO APP/

### 🎨 Archivos de Configuración Global

#### `globals.css`
**Propósito**: Hoja de estilos principal
- **Contenido**:
  - Variables CSS personalizadas con colores institucionales
  - Configuración de tema claro/oscuro
  - Scrollbars personalizados
  - Clases utilitarias reutilizables
  - Integración con TailwindCSS

#### `metadata.js`
**Propósito**: Configuración SEO y metadatos
- **Función**: Define título, descripción, favicon y meta tags
- **Uso**: Aplicado automáticamente en todas las páginas

#### `layout.js`
**Propósito**: Layout principal de la aplicación
- **Características**:
  - Estructura base de todas las páginas
  - Navegación lateral dinámica según permisos
  - Gestión de sesiones con NextAuth
  - Responsive design

#### `page.js`
**Propósito**: Página de entrada principal
- **Función**: Redirige automáticamente al login para usuarios no autenticados

#### `not-found.js`
**Propósito**: Página de error 404
- **Características**:
  - Diseño personalizado con branding institucional
  - Opciones de navegación para recuperación

---

## 🔌 DIRECTORIO API/

### Estructura de APIs REST

#### `api/auth/`
**Propósito**: Sistema de autenticación
- **`[...nextauth]/route.js`**: Manejador de rutas dinámicas NextAuth
- **`[...nextauth]/options.js`**: Configuración completa de autenticación

#### `api/sql/`
**Propósito**: Conexión a base de datos
- **Contenido**: Pool de conexiones MySQL y configuración

#### `api/comentarios/`
**Propósito**: Sistema de comentarios
- **Endpoints**: CRUD para comentarios asociados a órdenes

#### `api/proveedores/`
**Propósito**: Gestión de proveedores
- **Endpoints**: Listado, creación, actualización y eliminación

#### `api/orden/`
**Propósito**: Gestión de órdenes de compra
- **Endpoints**: CRUD completo para órdenes

#### `api/departamento/`
**Propósito**: Gestión de departamentos
- **Endpoints**: Listado y administración de departamentos

#### `api/usuario/`
**Propósito**: Gestión de usuarios
- **Endpoints**: CRUD de usuarios y asignación de permisos

#### `api/pdf/`
**Propósito**: Generación de documentos PDF
- **Función**: Creación de reportes y facturas en PDF

#### `api/bolsa/`
**Propósito**: Gestión de bolsa de horas/recursos
- **Endpoints**: Control de recursos asignados

#### `api/proveedor/`
**Propósito**: API específica de proveedores individuales
- **Endpoints**: Operaciones sobre proveedores específicos

---

## 🧩 DIRECTORIO COMPONENTS/

### Componentes Reutilizables

#### `components/nav/`
**Propósito**: Componentes de navegación
- **Contenido**: Navegación lateral con menú dinámico según permisos

#### `components/interativo/`
**Propósito**: Componentes interactivos
- **`desplegable.js`**: Selector de años con sincronización URL
- **`Error.js`**: Componentes de manejo de errores

#### `components/footer/`
**Propósito**: Componentes de pie de página

#### `components/profile/`
**Propósito**: Componentes de perfil de usuario

#### `PDFModal.js`
**Propósito**: Modal para visualización de PDFs
- **Función**: Ventana modal para mostrar documentos generados

---

## ⚙️ DIRECTORIO FUNCTIONS/

### Funciones Utilitarias

#### `functions.js`
**Propósito**: Funciones auxiliares de autenticación
- **Funciones principales**:
  - `getIdUser()`: Obtener información del usuario autenticado
  - `getReadOnly()`: Verificar permisos de escritura
  - `isAdmin()`: Verificar permisos de administrador
  - `isVerificacion()`: Validar acceso a departamentos
  - `chartData()`: Procesar datos para gráficos

#### `querys.js`
**Propósito**: Consultas a base de datos
- **Función**: Contiene todas las consultas SQL organizadas por módulo
- **Contenido**: Funciones para obtener datos de órdenes, proveedores, departamentos, usuarios, etc.

---

## 🏁 DIRECTORIO INICIO/

### Páginas de Inicio

#### `page.js`
**Propósito**: Página principal post-login
- **Función**: Selección de departamentos según permisos

#### `[...slug]/`
**Propósito**: Rutas dinámicas para departamentos específicos
- **Función**: Dashboard específico por departamento

#### `components/`
**Propósito**: Componentes específicos del módulo inicio

---

## 👑 DIRECTORIO ADMIN/

### Panel de Administración

#### `layout.js`
**Propósito**: Layout específico para administración

#### `usuario/`
**Propósito**: Gestión de usuarios
- **Funciones**: CRUD de usuarios, asignación de permisos

#### `departamento/`
**Propósito**: Gestión de departamentos
- **Funciones**: Administración de departamentos y asignaciones

---

## 🔐 DIRECTORIO LOGIN/

### Sistema de Autenticación

#### `page.js`
**Propósito**: Página de inicio de sesión
- **Características**:
  - Autenticación con Google OAuth
  - Manejo de errores detallado
  - Estados de carga visual
  - Diseño responsive con branding

---

## 💰 DIRECTORIO COMPRA/

### Gestión de Compras
- **Función**: Sistema completo de gestión de órdenes de compra
- **Características**: Creación, edición, aprobación y seguimiento

---

## 🏪 DIRECTORIO PROVEEDOR/

### Gestión de Proveedores
- **Función**: Administración completa de proveedores
- **Características**: Registro, edición, historial de transacciones

---

## 📈 DIRECTORIOS PRESUPUESTO/ e INVERSION/

### Gestión Financiera
- **`presupuesto/`**: Control de presupuestos por departamento
- **`inversion/`**: Gestión de inversiones y gastos extraordinarios
- **`editarPresupuesto/`**: Edición de presupuestos existentes
- **`editarInversion/`**: Modificación de inversiones

---

## 👤 DIRECTORIO PERFIL/

### Perfil de Usuario
- **Función**: Gestión del perfil personal del usuario
- **Características**: Visualización y edición de datos personales

---

## 🧪 DIRECTORIO PRUEBA/

### Páginas de Testing
- **Función**: Páginas para testing y desarrollo
- **Uso**: Entorno de pruebas para nuevas funcionalidades

---

## 🔧 Tecnologías Utilizadas

- **Framework**: Next.js 13+ con App Router
- **Autenticación**: NextAuth.js con Google OAuth
- **Base de Datos**: MySQL con pool de conexiones
- **Estilos**: TailwindCSS + CSS personalizado
- **Iconos**: Lucide React
- **PDFs**: Generación dinámica de documentos

---

## 🛡️ Arquitectura de Seguridad

1. **Middleware**: Control de acceso en cada petición
2. **Session Management**: Gestión de sesiones con JWT
3. **Role-Based Access**: Permisos por roles (admin, escritura, lectura, contable)
4. **Department Access**: Control granular por departamento
5. **API Protection**: Todas las APIs protegidas por autenticación

---

## 🚀 Flujo de Navegación

1. **Entrada**: Usuario accede a `/`
2. **Verificación**: Middleware verifica autenticación
3. **Login**: Si no está autenticado → `/login`
4. **Inicio**: Usuario autenticado → `/inicio`
5. **Departamento**: Selección/redirección automática a departamento
6. **Dashboard**: Acceso a funcionalidades según permisos

Esta arquitectura garantiza un sistema seguro, escalable y mantenible con clara separación de responsabilidades. 