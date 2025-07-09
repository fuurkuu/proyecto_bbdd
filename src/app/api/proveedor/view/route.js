import { NextResponse } from 'next/server';
import { pool } from '@/app/functions/db';
import { getProveedores } from '@/app/functions/querys';

export async function POST(request) {
  try {
    const { id } = await request.json();
    const [result] = await getProveedores(id);


    
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear proveedor' }, { status: 500 });
  }
}
