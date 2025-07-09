import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import { join } from 'path';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

export async function GET(request) {
  try {
    // Verificar sesión del usuario
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Obtener el nombre del archivo de los parámetros de consulta
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');

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
      
      // Redireccionar a la URL pública del archivo
      // Esto funciona porque los archivos en la carpeta 'public' son accesibles directamente
      const publicUrl = `/uploads/pdfs/${filename}`;
      
      return NextResponse.redirect(new URL(publicUrl, request.url));
    } catch (error) {
      if (error.code === 'ENOENT') {
        return NextResponse.json({ error: 'Archivo no encontrado' }, { status: 404 });
      }
      throw error;
    }
  } catch (error) {
    console.error('Error al acceder al PDF:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 