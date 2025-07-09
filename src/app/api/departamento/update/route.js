import { NextResponse } from 'next/server';
import { pool } from '@/app/api/sql/sql.js';

export async function POST(request) {
  try {
    const { id, name } = await request.json();
    if (!id || !name || name.trim() === '') {
      return NextResponse.json({ error: 'ID y nombre requeridos' }, { status: 400 });
    }
    const [result] = await pool.query('UPDATE Departamento SET nombre = ? WHERE id = ?', [name, id]);
    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Departamento no encontrado' }, { status: 404 });
    }
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar departamento' }, { status: 500 });
  }
} 