import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import { join } from 'path';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

export async function POST(request) {
  try {
    // Verificar la sesión del usuario
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Obtener el nombre del archivo del cuerpo de la solicitud
    const { filename } = await request.json();

    if (!filename) {
      return NextResponse.json({ error: 'Nombre de archivo no proporcionado' }, { status: 400 });
    }

    // Validar que el nombre de archivo es seguro (evitar vulnerabilidades de path traversal)
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return NextResponse.json({ error: 'Nombre de archivo no válido' }, { status: 400 });
    }

    // Construir la ruta al archivo
    const filePath = join(process.cwd(), 'public', 'uploads', 'pdfs', filename);

    try {
      // Verificar si el archivo existe
      await fs.access(filePath);
      
      // Eliminar el archivo
      await fs.unlink(filePath);
      
      return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
      if (error.code === 'ENOENT') {
        return NextResponse.json({ error: 'Archivo no encontrado' }, { status: 404 });
      }
      console.error('Error al eliminar el archivo:', error);
      return NextResponse.json({ error: 'Error al eliminar el archivo' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error interno del servidor:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 