/**
 * ============================================================================
 * QUERIES DE BASE DE DATOS
 * ============================================================================
 * Este archivo contiene todas las consultas SQL del sistema organizadas
 * por funcionalidad. Todas las funciones son asíncronas y manejan errores
 * retornando arrays vacíos en caso de fallo.
 * 
 * Categorías de funciones:
 * - Departamentos: Obtener departamentos según permisos del usuario
 * - Años/Bolsas: Consultas de años disponibles por departamento
 * - Inversiones: CRUD y consultas de inversiones
 * - Presupuestos: CRUD y consultas de presupuestos  
 * - Proveedores: Gestión y búsqueda de proveedores
 * - Usuarios: Consultas de usuarios y verificaciones de acceso
 */

'use server'

import { pool } from '../api/sql/sql.js';

// ============================================================================
// FUNCIONES DE DEPARTAMENTOS
// ============================================================================

/**
 * OBTENER DEPARTAMENTOS DEL USUARIO
 * Retorna departamentos según los permisos del usuario
 * 
 * @param {number} idUser - ID del usuario
 * @param {boolean} viewAll - Si true, obtiene todos los departamentos (para admins/contables)
 * @returns {Array} - Lista de departamentos {id, nombre}
 */
export async function getDepartamentos(idUser, viewAll = false) {
    try {
        if (viewAll) {
            // Admins y contables ven todos los departamentos
            const [result] = await pool.query(`SELECT d.id, d.nombre FROM Departamento AS d `);
            return result;
        }
        // Usuarios normales solo ven sus departamentos asignados
        const [result] = await pool.query(`SELECT d.id, d.nombre FROM Departamento AS d
        JOIN bbdd.Departamento_Usuario AS du ON du.idDepartamento_FK = d.id
        JOIN bbdd.Usuario AS u ON u.id = du.idUsuario_FK
        WHERE u.id = ?`, [idUser]);
        return result;
    } catch (error) {
        return [[]];
    }
}

/**
 * SELECCIONAR DEPARTAMENTO ESPECÍFICO
 * Obtiene los datos de un departamento por su ID
 * 
 * @param {number} id - ID del departamento
 * @returns {Array} - Datos del departamento {id, nombre}
 */
export async function seletDepatamento(id) {
    try {
        const [result] = await pool.query(`SELECT d.id, d.nombre FROM Departamento AS d WHERE d.id = ?`, [id]);
        return result;
    } catch (error) {
        return [];
    }
}

// ============================================================================
// FUNCIONES DE AÑOS Y BOLSAS PRESUPUESTARIAS
// ============================================================================

/**
 * OBTENER AÑOS DISPONIBLES PARA DEPARTAMENTO
 * Retorna los años que tienen bolsas presupuestarias para un departamento
 * 
 * @param {number} id - ID del departamento
 * @returns {Array} - Lista de años {id, ANO}
 */
export async function getAnos(id) {
    try {
        const [result] = await pool.query(`SELECT b.id, b.ANO FROM bbdd.Bolsa AS b 
        JOIN bbdd.Inversion AS i ON i.idBolsa_FK = b.id
        JOIN bbdd.Departamento AS d1 ON d1.id = i.idDepartamento_FK
        WHERE d1.id = ?
        ORDER BY b.ANO DESC`, [id]);
        return result;
    } catch (error) {
        return [];
    }
}

/**
 * OBTENER AÑOS CON INVERSIONES
 * Años que tienen inversiones para un departamento específico
 * 
 * @param {number} id - ID del departamento
 * @returns {Array} - Lista de años con inversiones {id, ANO}
 */
export async function getAnosInversion(id) {
    try {
        const [result] = await pool.query(`SELECT b.id, b.ANO FROM bbdd.Bolsa AS b 
        JOIN bbdd.Inversion AS i ON i.idBolsa_FK = b.id
        JOIN bbdd.Departamento AS d ON d.id = i.idDepartamento_FK
        WHERE d.id = ?
        ORDER BY b.ANO DESC`, [id]);
        return result;
    } catch (error) {
        return [];
    }
}

/**
 * OBTENER AÑOS CON PRESUPUESTOS
 * Años que tienen presupuestos para un departamento específico
 * 
 * @param {number} id - ID del departamento
 * @returns {Array} - Lista de años con presupuestos {id, ANO}
 */
export async function getAnosPresupuesto(id) {
    try {
        const [result] = await pool.query(`SELECT b.id, b.ANO FROM bbdd.Bolsa AS b 
        JOIN bbdd.Presupuesto AS p ON p.idBolsa_FK = b.id
        JOIN bbdd.Departamento AS d ON d.id = p.idDepartamento_FK
        WHERE d.id = ?
        ORDER BY b.ANO DESC`, [id]);
        return result;
    } catch (error) {
        return [];
    }
}

// ============================================================================
// FUNCIONES DE BÚSQUEDA DE DEPARTAMENTOS POR BOLSA
// ============================================================================

/**
 * OBTENER DEPARTAMENTO DE INVERSIÓN POR BOLSA
 * Encuentra qué departamento tiene una inversión en una bolsa específica
 * 
 * @param {number} id - ID de la bolsa
 * @returns {number} - ID del departamento
 */
export async function seletDepatamentoInversion(id) {
    try {
        const [result] = await pool.query(`SELECT d1.id FROM bbdd.Bolsa AS b1 
            JOIN bbdd.Inversion AS i1 ON i1.idBolsa_FK = b1.id 
            JOIN bbdd.Departamento AS d1 ON d1.id = i1.idDepartamento_FK WHERE b1.id =?`, [id]);
        return result[0].id;
    } catch (error) {
        return [];
    }
}

/**
 * OBTENER DEPARTAMENTO DE PRESUPUESTO POR BOLSA
 * Encuentra qué departamento tiene un presupuesto en una bolsa específica
 * 
 * @param {number} id - ID de la bolsa
 * @returns {number} - ID del departamento
 */
export async function seletDepatamentoPresupuesto(id) {
    try {
        const [result] = await pool.query(`SELECT d1.id FROM bbdd.Bolsa AS b1 
            JOIN bbdd.Presupuesto AS p ON p.idBolsa_FK = b1.id 
            JOIN bbdd.Departamento AS d1 ON d1.id = p.idDepartamento_FK WHERE b1.id =?`, [id]);
        return result[0].id;
    } catch (error) {
        return [];
    }
}

// ============================================================================
// FUNCIONES DE CONSULTA DE PRESUPUESTOS E INVERSIONES
// ============================================================================

/**
 * OBTENER PRESUPUESTO DE DEPARTAMENTO POR AÑO
 * Consulta el presupuesto asignado y gastado de un departamento en un año específico
 * 
 * @param {number} idDepartamento - ID del departamento
 * @param {number} ano - Año del presupuesto
 * @returns {Array} - Datos del presupuesto {id, dinero, ano, total}
 */
export async function seletPresupuesto(idDepartamento, ano) {
    try {
        const [result] = await pool.query(`SELECT b.id, b.dinero, b.ano,COALESCE(SUM(oc1.importe), 0) AS total
    FROM bbdd.Bolsa AS b
    JOIN bbdd.Presupuesto AS p ON p.idBolsa_FK = b.id
    JOIN bbdd.Departamento AS d2 ON d2.id = p.idDepartamento_FK
    LEFT JOIN bbdd.Compra_Presupuesto AS cp ON cp.idPresupuesto_FK = p.id
    LEFT JOIN bbdd.Orden_Compra AS oc1 ON oc1.id = cp.idOrden_Compra_FK
    WHERE d2.id = ? AND b.ano = ?
    GROUP BY b.id, b.dinero, b.ano`, [idDepartamento, ano]);
        return result;
    } catch (error) {
        return [];
    }
}

/**
 * OBTENER INVERSIÓN DE DEPARTAMENTO POR AÑO
 * Consulta la inversión asignada y gastada de un departamento en un año específico
 * 
 * @param {number} idDepartamento - ID del departamento
 * @param {number} ano - Año de la inversión
 * @returns {Array} - Datos de la inversión {id, dinero, ano, total}
 */
export async function seletInversion(idDepartamento, ano) {
    try {
        const [result] = await pool.query(`SELECT b.id, b.dinero, b.ano,COALESCE(SUM(oc2.importe), 0) AS total
FROM bbdd.Bolsa AS b
    JOIN bbdd.Inversion AS i ON i.idBolsa_FK = b.id
    JOIN bbdd.Departamento AS d1 ON d1.id = i.idDepartamento_FK
    LEFT JOIN bbdd.Compra_Inversion AS ci ON ci.idInversion_FK = i.id
    LEFT JOIN bbdd.Orden_Compra AS oc2 ON oc2.id = ci.idOrden_Compra_FK
WHERE d1.id = ? AND b.ano = ?
GROUP BY b.id, b.dinero, b.ano`, [idDepartamento, ano]);
        return result;
    } catch (error) {
        return [];
    }
}

// ============================================================================
// FUNCIONES DE COMPRAS Y ÓRDENES
// ============================================================================

/**
 * OBTENER COMPRAS DE INVERSIÓN POR AÑO
 * Lista todas las órdenes de compra de inversión de un año específico
 * 
 * @param {number} ano - Año de las compras
 * @returns {Array} - Lista de compras con detalles completos
 */
export async function selectCompraInversion(ano) {
    try {
        const [result] = await pool.query(`
        SELECT 
            oc2.id, 
            oc2.cod_compra, 
            i.cod_inversion, 
            oc2.observacion, 
            p.nombre AS proveedor, 
            oc2.cantidad, 
            DATE(oc2.fecha) AS fecha, 
            oc2.importe, 
            if(oc2.es_inventariable=1, 'Si','No') AS inventariable, 
            i.idBolsa_FK AS bolsaId  -- Usar directamente el campo de la tabla Inversion
        FROM 
            bbdd.Inversion AS i 
            JOIN bbdd.Compra_Inversion AS ci ON ci.idInversion_FK = i.id
            JOIN bbdd.Orden_Compra AS oc2 ON oc2.id = ci.idOrden_Compra_FK
            JOIN bbdd.Proveedor AS p ON p.id = oc2.idProveedor_FK
            JOIN bbdd.bolsa AS b ON b.id = i.idBolsa_FK
        WHERE 
            b.ano = ? 
        `, [ano]);
        
        // Logging para debugging (opcional)
        console.log("Datos de selectCompraInversion:", result.map(item => ({
            id: item.id,
            cod_compra: item.cod_compra,
            bolsaId: item.bolsaId
        })));
        
        return result;
    } catch (error) {
        console.error("Error en selectCompraInversion:", error);
        return [];
    }
}

/**
 * OBTENER COMPRAS DE PRESUPUESTO POR AÑO
 * Lista todas las órdenes de compra de presupuesto de un año específico
 * 
 * @param {number} ano - Año de las compras
 * @returns {Array} - Lista de compras con detalles completos
 */
export async function selectCompraPresupuesto(ano) {
    try {
        const [result] = await pool.query(`
        SELECT 
            oc2.id, 
            oc2.cod_compra, 
            oc2.observacion, 
            p.nombre AS proveedor, 
            oc2.cantidad, 
            DATE(oc2.fecha) AS fecha, 
            oc2.importe, 
            IF(oc2.es_inventariable=1, 'Si','No') AS inventariable, 
            i.idBolsa_FK AS bolsaId  -- Usar directamente el campo de la tabla Presupuesto
        FROM 
            bbdd.Presupuesto AS i 
            JOIN bbdd.Compra_Presupuesto AS ci ON ci.idPresupuesto_FK = i.id
            JOIN bbdd.Orden_Compra AS oc2 ON oc2.id = ci.idOrden_Compra_FK
            JOIN bbdd.Proveedor AS p ON p.id = oc2.idProveedor_FK
            JOIN bbdd.bolsa AS b ON b.id = i.idBolsa_FK
        WHERE 
            b.ano = ? 
        `, [ano]);
        
        // Logging para debugging (opcional)
        console.log("Datos de selectCompraPresupuesto:", result.map(item => ({
            id: item.id,
            cod_compra: item.cod_compra,
            bolsaId: item.bolsaId
        })));
        
        return result;
    } catch (error) {
        console.error("Error en selectCompraPresupuesto:", error);
        return [];
    }
}

// ============================================================================
// FUNCIONES DE PROVEEDORES
// ============================================================================

/**
 * OBTENER DEPARTAMENTOS DE PROVEEDOR
 * Lista los departamentos asociados a un proveedor específico
 * 
 * @param {number} id - ID del proveedor
 * @param {boolean} viewAll - Si true, obtiene todos los departamentos
 * @returns {Array} - Lista de departamentos del proveedor
 */
export async function getDepartamentosProveedores(id, viewAll = false) {
    try {
        if (viewAll) {
            const [result] = await pool.query(`
                SELECT d.id, d.nombre 
                FROM Departamento AS d
            `);
            return result;
        }
        
        const [result] = await pool.query(`
            SELECT d.id, d.nombre 
            FROM Departamento AS d
            JOIN bbdd.Proveedor_Departamento AS pd ON pd.idDepartamento_FK = d.id
            WHERE pd.idProveedor_FK = ?
        `, [id]);
        return result;
    } catch (error) {
        return [];
    }
}

/**
 * BUSCAR PROVEEDORES CON FILTROS
 * Función principal para buscar proveedores con múltiples criterios
 * 
 * @param {number} id - ID del usuario (para filtrar por departamentos asignados)
 * @param {string} name - Nombre del proveedor (búsqueda parcial)
 * @param {number} departamento - ID del departamento (filtro)
 * @param {boolean} viewAll - Si true, ve todos los proveedores (para admins)
 * @returns {Array} - Lista de proveedores que coinciden con los criterios
 */
export async function getProveedores(id, name, departamento, viewAll = false) {
    try {
        let query = `
            SELECT DISTINCT p.id, p.nombre, p.telefono, p.email, p.direccion
            FROM Proveedor AS p
        `;
        
        let whereConditions = [];
        let queryParams = [];
        
        // Si no es admin, filtrar por departamentos del usuario
        if (!viewAll && id) {
            query += `
                JOIN Proveedor_Departamento AS pd ON p.id = pd.idProveedor_FK
                JOIN Departamento_Usuario AS du ON pd.idDepartamento_FK = du.idDepartamento_FK
            `;
            whereConditions.push("du.idUsuario_FK = ?");
            queryParams.push(id);
        }
        
        // Filtro por nombre del proveedor
        if (name && name.trim() !== '') {
            whereConditions.push("p.nombre LIKE ?");
            queryParams.push(`%${name}%`);
        }
        
        // Filtro por departamento específico
        if (departamento) {
            if (!query.includes('Proveedor_Departamento')) {
                query += ` JOIN Proveedor_Departamento AS pd ON p.id = pd.idProveedor_FK`;
            }
            whereConditions.push("pd.idDepartamento_FK = ?");
            queryParams.push(departamento);
        }
        
        // Agregar condiciones WHERE si existen
        if (whereConditions.length > 0) {
            query += ` WHERE ${whereConditions.join(' AND ')}`;
        }
        
        query += ` ORDER BY p.nombre`;
        
        const [result] = await pool.query(query, queryParams);
        return result;
    } catch (error) {
        console.error('Error en getProveedores:', error);
        return [];
    }
}

/**
 * OBTENER DEPARTAMENTOS ASIGNADOS A PROVEEDOR
 * Lista completa de departamentos que pueden usar un proveedor específico
 * 
 * @param {number} id - ID del proveedor
 * @param {number} idUser - ID del usuario (para filtrar permisos)
 * @param {boolean} viewAll - Si true, ve todos los departamentos
 * @returns {Array} - Departamentos del proveedor
 */
export async function getProveedoresDepatamentos(id, idUser, viewAll = false) {
    try {
        if (viewAll) {
            const [result] = await pool.query(`
                SELECT d.id, d.nombre 
                FROM Departamento AS d
                JOIN bbdd.Proveedor_Departamento AS pd ON pd.idDepartamento_FK = d.id
                WHERE pd.idProveedor_FK = ?
            `, [id]);
            return result;
        }
        
        const [result] = await pool.query(`
            SELECT d.id, d.nombre 
            FROM Departamento AS d
            JOIN bbdd.Proveedor_Departamento AS pd ON pd.idDepartamento_FK = d.id
            JOIN bbdd.Departamento_Usuario AS du ON du.idDepartamento_FK = d.id
            WHERE pd.idProveedor_FK = ? AND du.idUsuario_FK = ?
        `, [id, idUser]);
        return result;
    } catch (error) {
        return [];
    }
}

/**
 * OBTENER DETALLES DE INVERSIÓN
 * Información completa de una inversión específica
 * 
 * @param {number} id - ID de la inversión
 * @returns {Array} - Datos de la inversión
 */
export async function getInversion(id) {
    try {
        const [result] = await pool.query(`
            SELECT 
                i.id, 
                i.cod_inversion, 
                b.dinero, 
                b.ano,
                d.nombre AS departamento_nombre,
                d.id AS departamento_id,
                COALESCE(SUM(oc.importe), 0) AS total_gastado
            FROM bbdd.Inversion AS i
            JOIN bbdd.Bolsa AS b ON b.id = i.idBolsa_FK
            JOIN bbdd.Departamento AS d ON d.id = i.idDepartamento_FK
            LEFT JOIN bbdd.Compra_Inversion AS ci ON ci.idInversion_FK = i.id
            LEFT JOIN bbdd.Orden_Compra AS oc ON oc.id = ci.idOrden_Compra_FK
            WHERE i.id = ?
            GROUP BY i.id, i.cod_inversion, b.dinero, b.ano, d.nombre, d.id
        `, [id]);
        return result;
    } catch (error) {
        console.error('Error en getInversion:', error);
        return [];
    }
}

/**
 * OBTENER TODOS LOS PROVEEDORES
 * Lista simple de todos los proveedores del sistema
 * 
 * @returns {Array} - Lista completa de proveedores
 */
export async function selectProveedores() {
    try {
        const [result] = await pool.query(`
            SELECT id, nombre, telefono, email, direccion 
            FROM Proveedor 
            ORDER BY nombre
        `);
        return result;
    } catch (error) {
        console.error('Error en selectProveedores:', error);
        return [];
    }
}

// ============================================================================
// FUNCIONES DE USUARIOS Y VERIFICACIONES DE ACCESO
// ============================================================================

/**
 * OBTENER INFORMACIÓN DE USUARIO
 * Datos básicos de un usuario específico
 * 
 * @param {number} id - ID del usuario
 * @returns {Array} - Datos del usuario
 */
export async function getUsuario(id) {
    try {
        const [result] = await pool.query(`SELECT nombre, email, cargo FROM Usuario WHERE id = ?`, [id]);
        return result;
    } catch (error) {
        return [];
    }
}

/**
 * OBTENER PROVEEDOR POR ID
 * Información detallada de un proveedor específico
 * 
 * @param {number} id - ID del proveedor
 * @returns {Array} - Datos completos del proveedor
 */
export async function getProveedorById(id) {
    try {
        const [result] = await pool.query(`
            SELECT 
                p.id, 
                p.nombre, 
                p.telefono, 
                p.email, 
                p.direccion,
                GROUP_CONCAT(d.nombre SEPARATOR ', ') AS departamentos
            FROM Proveedor p
            LEFT JOIN Proveedor_Departamento pd ON p.id = pd.idProveedor_FK
            LEFT JOIN Departamento d ON pd.idDepartamento_FK = d.id
            WHERE p.id = ?
            GROUP BY p.id, p.nombre, p.telefono, p.email, p.direccion
        `, [id]);
        return result;
    } catch (error) {
        console.error('Error en getProveedorById:', error);
        return [];
    }
}

/**
 * VERIFICAR ACCESO DE USUARIO A DEPARTAMENTO
 * Comprueba si un usuario tiene acceso a un departamento específico
 * 
 * @param {number} iduser - ID del usuario
 * @param {number} idDepartamento - ID del departamento
 * @returns {Array} - Resultado de la verificación
 */
export async function getDepartamentosUser(iduser, idDepartamento) {
    try {
        const [result] = await pool.query(`
            SELECT du.idDepartamento_FK 
            FROM Departamento_Usuario du 
            WHERE du.idUsuario_FK = ? AND du.idDepartamento_FK = ?
        `, [iduser, idDepartamento]);
        return result;
    } catch (error) {
        return [];
    }
}

/**
 * VERIFICAR ACCESO A BOLSA DE INVERSIÓN
 * Comprueba si un usuario puede acceder a una bolsa de inversión específica
 * 
 * @param {number} iduser - ID del usuario
 * @param {number} idBolsa - ID de la bolsa
 * @returns {Array} - Resultado de la verificación
 */
export async function getBolsaUserInversion(iduser, idBolsa) {
    try {
        const [result] = await pool.query(`
            SELECT i.idBolsa_FK 
            FROM Inversion i
            JOIN Departamento_Usuario du ON i.idDepartamento_FK = du.idDepartamento_FK
            WHERE du.idUsuario_FK = ? AND i.idBolsa_FK = ?
        `, [iduser, idBolsa]);
        return result;
    } catch (error) {
        return [];
    }
}

/**
 * VERIFICAR ACCESO A BOLSA DE PRESUPUESTO
 * Comprueba si un usuario puede acceder a una bolsa de presupuesto específica
 * 
 * @param {number} iduser - ID del usuario
 * @param {number} idBolsa - ID de la bolsa
 * @returns {Array} - Resultado de la verificación
 */
export async function getBolsaUserPresupuesto(iduser, idBolsa) {
    try {
        const [result] = await pool.query(`
            SELECT p.idBolsa_FK 
            FROM Presupuesto p
            JOIN Departamento_Usuario du ON p.idDepartamento_FK = du.idDepartamento_FK
            WHERE du.idUsuario_FK = ? AND p.idBolsa_FK = ?
        `, [iduser, idBolsa]);
        return result;
    } catch (error) {
        return [];
    }
}