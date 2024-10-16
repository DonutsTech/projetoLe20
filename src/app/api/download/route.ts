import { NextRequest, NextResponse } from 'next/server';
import fetch from 'node-fetch';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID do PDF não fornecido.' }, { status: 400 });
  }

  try {
    const googleDriveUrl = `https://drive.google.com/uc?export=download&id=${id}`;
    // const drive = `https://mega.nz/file/EQoUnYbD#MYtKUwamrxUIBrLQ-${id}`;

    const response = await fetch(googleDriveUrl);
    // const response = await fetch(drive);

    if (!response.ok) {
      throw new Error('Erro ao baixar o PDF');
    }

    const pdfBuffer = await response.arrayBuffer();

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
      },
    });
  } catch (error) {
    console.error('Erro ao baixar o PDF:', error);
    return NextResponse.json({ error: 'Erro ao baixar o PDF' }, { status: 500 });
  }
}
