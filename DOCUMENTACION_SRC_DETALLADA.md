# 📄 DOCUMENTACIÓN DETALLADA - ARCHIVOS ESPECÍFICOS

## 🔧 ARCHIVOS PRINCIPALES Y SUS FUNCIONES

### 🛡️ `src/middleware.js`
```javascript
// Middleware de Next.js que intercepta TODAS las peticiones
export async function middleware(request) {
  // Lógica de autenticación y permisos
}
```

**Funciones Clave**:
- `verificarAutenticacion()`: Comprueba si el usuario tiene sesión válida
- `verificarPermisos()`: Valida permisos según la ruta accedida
- `redirectionManager()`: Maneja redirecciones automáticas
- **Rutas Protegidas**: `/admin/*`, `/api/*`, `/inicio/*`, etc.
- **Excepciones**: `/login`, `/`, archivos estáticos

---

### 🎨 `src/app/globals.css`
**Variables CSS Institucionales**:
```css
:root {
  --primary: #DB1515;        /* Rojo principal Salesianos */
  --secondary: #2C3E8C;      /* Azul institucional */
  --accent: #FBB80E;         /* Amarillo de acento */
}
```

**Clases Utilitarias**:
- `.salesian-card`: Tarjetas estándar con sombras
- `.salesian-button`: Botones con gradiente institucional
- `.salesian-input`: Campos de entrada con focus personalizado
- `.salesian-header`: Títulos con línea inferior roja

---

### 📊 `src/app/metadata.js`
```javascript
export const metadata = {
  title: "Sistema de Gestión - Salesianos Zaragoza",
  description: "Plataforma de gestión interna",
  // ... más configuraciones SEO
}
```

---

### 📐 `src/app/layout.js`
**Estructura Principal**:
```jsx
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <SessionProvider>
          <NavConditional />
          <main>{children}</main>
        </SessionProvider>
      </body>
    </html>
  )
}
```

**Componentes Integrados**:
- `NavConditional`: Navegación que aparece/desaparece según autenticación
- `SessionProvider`: Proveedor de contexto de NextAuth

---

## 🔌 APIS DETALLADAS

### 🔐 `src/app/api/auth/[...nextauth]/options.js`
**Configuración de Proveedores**:
```javascript
providers: [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  })
]
```

**Callbacks Principales**:
- `signIn()`: Verifica si el email existe en BD antes de permitir login
- `jwt()`: Añade datos del usuario al token JWT
- `session()`: Transfiere datos del token a la sesión

### 💾 `src/app/api/sql/sql.js`
**Pool de Conexiones MySQL**:
```javascript
export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // ... configuraciones de pool
});
```

**Características**:
- Reconexión automática
- Manejo de errores de conexión
- Pool de conexiones para mejor rendimiento

### 📝 `src/app/api/comentarios/[idOrden]/route.js`
**Endpoints**:
- `GET`: Obtener comentarios de una orden específica
- `POST`: Crear nuevo comentario
- `PUT`: Actualizar comentario existente
- `DELETE`: Eliminar comentario

---

## 🧩 COMPONENTES PRINCIPALES

### 🧭 `src/app/components/nav/nav.js`
**Menú Dinámico**:
```javascript
const menuItems = [
  { path: "/inicio", label: "Inicio", icon: "Home" },
  { path: "/compra", label: "Compras", icon: "ShoppingCart", permission: "w" },
  { path: "/admin", label: "Admin", icon: "Settings", admin: true }
];
```

**Características**:
- Menú que se adapta a permisos del usuario
- Iconos con Lucide React
- Estado activo visual
- Responsive colapsable

### 👑 `src/app/components/nav/admin.js`
**Navegación Específica de Admin**:
- Gestión de usuarios
- Configuración de departamentos
- Herramientas de administración

### 🎛️ `src/app/components/interativo/desplegable.js`
**Selector de Años con URL**:
```javascript
const handleSearch = (e) => {
  const newQuery = e.target.value;
  const params = new URLSearchParams();
  params.set("an", newQuery);
  router.replace(`?${params.toString()}`);
}
```

### ⚠️ `src/app/components/interativo/Error.js`
**Componentes de Error**:
- `ErrorInicio`: Error general con botones de recuperación
- `ErrorProveedorEditar`: Error específico para proveedores
- `ErrorTabla`: Estado vacío para tablas sin datos

---

## ⚙️ FUNCIONES UTILITARIAS

### 🔑 `src/app/functions/functions.js`
**Funciones de Autenticación**:

#### `getIdUser()`
```javascript
export async function getIdUser() {
  const session = await getServerSession(authOptions);
  return [session.user.id, session.user.isAdmin, session.user.permisos.c];
}
```

#### `getReadOnly()`
```javascript
export async function getReadOnly() {
  const session = await getServerSession(authOptions);
  if (!(session.user.isAdmin || session.user.permisos.w)) {
    redirect("/inicio");
  }
}
```

#### `isVerificacion(id)`
```javascript
export async function isVerificacion(id) {
  // Verifica si el usuario tiene acceso al departamento específico
  const departamentos = await getDepartamentosUser(session.user.id, id);
  return departamentos.length > 0;
}
```

### 📊 `src/app/functions/querys.js`
**Consultas Principales**:

#### Gestión de Departamentos
```javascript
export async function getDepartamentos(idUser, isAdmin) {
  // SQL query para obtener departamentos según permisos
}
```

#### Gestión de Órdenes
```javascript
export async function getOrdenes(idDepartamento, year) {
  // SQL query para obtener órdenes filtradas
}
```

#### Gestión de Proveedores
```javascript
export async function getProveedores() {
  // SQL query para obtener listado de proveedores
}
```

---

## 🏁 PÁGINAS PRINCIPALES

### 🏠 `src/app/inicio/page.js`
**Lógica de Inicio**:
```javascript
export default async function Inicio() {
  const session = await getIdUser();
  const departamentos = await getDepartamentos(session[0], session[1]);
  
  if (departamentos.length === 1) {
    redirect(`/inicio/${departamentos[0].id}`);
  }
  
  return <DepartamentosInicio departamentos={departamentos} />;
}
```

### 🎯 `src/app/inicio/[...slug]/page.js`
**Dashboard por Departamento**:
- Recibe parámetro dinámico del departamento
- Verifica permisos de acceso
- Muestra métricas y estadísticas específicas

### 🏢 `src/app/inicio/components/departamentos.js`
**Selector de Departamentos**:
- Grid de tarjetas por departamento
- Links navegación
- Información de cada departamento

### 📱 `src/app/inicio/components/card.js`
**Tarjetas de Métricas**:
- Componente reutilizable para mostrar estadísticas
- Iconos y colores temáticos
- Animaciones de hover

---

## 🔐 SISTEMA DE AUTENTICACIÓN

### 📝 `src/app/login/page.js`
**Página de Login Completa**:

#### Estados Manejados:
- `isLoading`: Estado de carga durante autenticación
- `error`: Mensajes de error específicos
- `showAlert`: Control de alertas visuales

#### Manejo de Errores:
```javascript
const errorMessages = {
  "AccessDenied": "Email no registrado en el sistema",
  "Verification": "Error de verificación",
  "CredentialsSignin": "Credenciales incorrectas"
};
```

#### Flujo de Autenticación:
1. Usuario hace clic en "Iniciar con Google"
2. Redirección a Google OAuth
3. Callback a NextAuth
4. Verificación en base de datos
5. Creación de sesión o rechazo

---

## 🎨 COMPONENTES VISUALES

### 📄 `src/app/components/PDFModal.js`
**Modal de PDFs**:
- Visualización de documentos generados
- Botones de descarga
- Responsive design

### 🔍 `src/app/not-found.js`
**Página 404**:
- Diseño personalizado con branding
- Opciones de navegación
- Mensaje friendly para usuarios

---

## 🛡️ MIDDLEWARE AVANZADO

### Rutas Protegidas:
```javascript
const protectedRoutes = [
  '/admin',     // Solo administradores
  '/api',       // APIs autenticadas
  '/inicio',    // Usuarios logueados
  '/compra',    // Permisos de escritura
  '/proveedor'  // Permisos de lectura
];
```

### Lógica de Permisos:
1. **Administradores**: Acceso total
2. **Usuarios con Escritura**: Pueden crear/modificar
3. **Usuarios con Lectura**: Solo visualización
4. **Usuarios Contables**: Acceso a reportes financieros

---

## 📊 FLUJO DE DATOS

### 1. Autenticación:
`Google OAuth → NextAuth → Verificación BD → Creación Sesión`

### 2. Navegación:
`Middleware → Verificación Permisos → Renderizado Página`

### 3. APIs:
`Request → Autenticación → Autorización → BD → Response`

### 4. Estados:
`Loading → Success/Error → UI Update`

Esta documentación proporciona una visión completa y detallada de cada componente del sistema, facilitando el mantenimiento y desarrollo futuro. 