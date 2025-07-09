import { NextResponse } from 'next/server';
import { join } from 'path';
import { promises as fs } from 'fs';
import { formidable } from 'formidable';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

export const config = {
  api: {
    bodyParser: false,
  },
};

// Parsea el cuerpo de la petición como un stream para formidable
async function parseFormData(request) {
  const formData = await request.formData();
  const uploadDir = join(process.cwd(), 'public', 'uploads', 'pdfs');
  
  try {
    await fs.access(uploadDir);
  } catch (error) {
    await fs.mkdir(uploadDir, { recursive: true });
  }
  
  // Convierte formData a un archivo real en el sistema
  const file = formData.get('pdf');
  const itemId = formData.get('itemId');
  
  if (!file || typeof file === 'string') {
    throw new Error('No se encontró archivo PDF válido');
  }
  
  // Verificar que el archivo es un PDF
  if (!file.type || !file.type.includes('pdf')) {
    throw new Error('El archivo debe ser un PDF');
  }
  
  const buffer = Buffer.from(await file.arrayBuffer());
  const timestamp = new Date().getTime();
  const originalFilename = file.name;
  const newFilename = `${itemId}_${timestamp}_${originalFilename}`;
  const filePath = join(uploadDir, newFilename);
  
  await fs.writeFile(filePath, buffer);
  
  return {
    success: true,
    file: {
      filepath: filePath,
      newFilename,
      originalFilename,
      mimetype: file.type
    },
    itemId
  };
}

export async function POST(request) {
  try {
    // Verificar la sesión del usuario
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    try {
      // Parsear los datos del formulario usando FormData nativo
      const result = await parseFormData(request);
      
      return NextResponse.json(
        { success: true, filename: result.newFilename },
        { status: 200 }
      );
    } catch (error) {
      console.error('Error al procesar el archivo:', error);
      return NextResponse.json(
        { error: error.message || 'Error al procesar el archivo' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error interno del servidor:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 