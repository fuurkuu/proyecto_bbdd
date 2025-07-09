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

    // Obtener el itemId de los parámetros de consulta
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('itemId');

    if (!itemId) {
      return NextResponse.json({ error: 'ID del elemento no proporcionado' }, { status: 400 });
    }

    // Directorio donde se almacenan los PDFs
    const pdfDir = join(process.cwd(), 'public', 'uploads', 'pdfs');
    
    try {
      // Verificar si el directorio existe
      await fs.access(pdfDir);
      
      // Leer todos los archivos en el directorio
      const files = await fs.readdir(pdfDir);
      
      // Filtrar sólo los PDFs que corresponden al itemId
      const itemPdfs = files
        .filter(filename => filename.startsWith(`${itemId}_`) && filename.toLowerCase().endsWith('.pdf'))
        .map(filename => {
          // Extraer información del nombre del archivo (formato: itemId_timestamp_originalName.pdf)
          const parts = filename.split('_');
          const timestamp = parseInt(parts[1]);
          
          return {
            id: `${itemId}_${timestamp}`,
            filename,
            uploadDate: new Date(timestamp).toISOString(),
            url: `/uploads/pdfs/${filename}`,
          };
        })
        // Ordenar por fecha de subida (más reciente primero)
        .sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
      
      return NextResponse.json({ pdfs: itemPdfs }, { status: 200 });
    } catch (error) {
      // Si el directorio no existe, devolver una lista vacía
      if (error.code === 'ENOENT') {
        return NextResponse.json({ pdfs: [] }, { status: 200 });
      }
      throw error;
    }
  } catch (error) {
    console.error('Error al listar PDFs:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 