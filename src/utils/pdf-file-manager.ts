import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { BookIllustration, ComicPage, BookSummary } from '@/models/illustration-models';

export class PdfFileManager {
  private uploadsDir: string;

  constructor() {
    // Caminho para a pasta uploads no public do Next.js
    this.uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  }

  async ensureUploadsDir() {
    try {
      await fs.access(this.uploadsDir);
    } catch {
      await fs.mkdir(this.uploadsDir, { recursive: true });
    }
  }

  async downloadImage(imageUrl: string): Promise<Buffer> {
    const response = await fetch(imageUrl);
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  async appendIllustrationsToPdf(
    originalPdfPath: string,
    illustrations: BookIllustration[]
  ): Promise<string> {
    await this.ensureUploadsDir();

    // Carregar o PDF original
    const originalPdfBytes = await fs.readFile(originalPdfPath);
    const pdfDoc = await PDFDocument.load(originalPdfBytes);

    // Ordenar ilustrações por página
    const sortedIllustrations = [...illustrations].sort((a, b) => a.pageNumber - b.pageNumber);

    // Inserir ilustrações após as páginas correspondentes
    let insertOffset = 0;
    for (const illustration of sortedIllustrations) {
      // Baixar a imagem
      const imageBuffer = await this.downloadImage(illustration.imageUrl);
      
      // Converter para PNG se necessário
      const pngBuffer = await sharp(imageBuffer)
        .png()
        .toBuffer();

      // Adicionar imagem ao PDF
      const image = await pdfDoc.embedPng(pngBuffer);
      
      // Criar nova página para a ilustração
      const page = pdfDoc.insertPage(illustration.pageNumber + insertOffset);
      
      // Dimensões da página
      const { width, height } = page.getSize();
      
      // Calcular dimensões da imagem mantendo proporção
      const imgAspectRatio = image.width / image.height;
      const pageAspectRatio = width / height;
      
      let imgWidth, imgHeight;
      if (imgAspectRatio > pageAspectRatio) {
        imgWidth = width * 0.9;
        imgHeight = imgWidth / imgAspectRatio;
      } else {
        imgHeight = height * 0.9;
        imgWidth = imgHeight * imgAspectRatio;
      }
      
      // Centralizar imagem
      const x = (width - imgWidth) / 2;
      const y = (height - imgHeight) / 2;
      
      // Desenhar imagem
      page.drawImage(image, {
        x,
        y,
        width: imgWidth,
        height: imgHeight,
      });

      // Adicionar descrição da ilustração
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      page.drawText(`Ilustração: ${illustration.description}`, {
        x: 50,
        y: 30,
        size: 10,
        font,
        color: rgb(0, 0, 0),
      });

      insertOffset++;
    }

    // Salvar PDF ilustrado
    const pdfBytes = await pdfDoc.save();
    const filename = `illustrated_${Date.now()}_${path.basename(originalPdfPath)}`;
    const outputPath = path.join(this.uploadsDir, filename);
    
    await fs.writeFile(outputPath, pdfBytes);
    
    return `/uploads/${filename}`;
  }

  async createComicPdf(comicPages: ComicPage[]): Promise<string> {
    await this.ensureUploadsDir();

    // Criar novo documento PDF
    const pdfDoc = await PDFDocument.create();
    
    for (const comicPage of comicPages) {
      // Baixar a imagem da página
      const imageBuffer = await this.downloadImage(comicPage.imageUrl);
      
      // Converter para PNG
      const pngBuffer = await sharp(imageBuffer)
        .png()
        .toBuffer();

      // Adicionar imagem ao PDF
      const image = await pdfDoc.embedPng(pngBuffer);
      
      // Criar página com tamanho de HQ (geralmente mais alta que larga)
      const page = pdfDoc.addPage([image.width, image.height]);
      
      // Desenhar a imagem ocupando toda a página
      page.drawImage(image, {
        x: 0,
        y: 0,
        width: image.width,
        height: image.height,
      });

      // Adicionar número da página
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      page.drawText(`Página ${comicPage.pageNumber}`, {
        x: 10,
        y: 10,
        size: 12,
        font,
        color: rgb(0.5, 0.5, 0.5),
      });
    }

    // Salvar PDF do gibi
    const pdfBytes = await pdfDoc.save();
    const filename = `comic_${Date.now()}.pdf`;
    const outputPath = path.join(this.uploadsDir, filename);
    
    await fs.writeFile(outputPath, pdfBytes);
    
    return `/uploads/${filename}`;
  }

  async saveSummaryAsPdf(summary: BookSummary): Promise<string> {
    await this.ensureUploadsDir();

    // Criar novo documento PDF
    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage();
    
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    let yPosition = height - 50;
    const lineHeight = 20;
    const margin = 50;
    const maxWidth = width - (2 * margin);

    // Título
    page.drawText(summary.title, {
      x: margin,
      y: yPosition,
      size: 24,
      font: boldFont,
      color: rgb(0, 0, 0),
    });
    yPosition -= lineHeight * 2;

    // Informações do documento
    page.drawText(`Total de páginas: ${summary.totalPages}`, {
      x: margin,
      y: yPosition,
      size: 12,
      font,
      color: rgb(0.3, 0.3, 0.3),
    });
    yPosition -= lineHeight * 2;

    // Resumo
    page.drawText('RESUMO', {
      x: margin,
      y: yPosition,
      size: 16,
      font: boldFont,
      color: rgb(0, 0, 0),
    });
    yPosition -= lineHeight;

    // Quebrar texto do resumo em linhas
    const words = summary.summary.split(' ');
    let currentLine = '';
    
    for (const word of words) {
      const testLine = currentLine + word + ' ';
      const textWidth = font.widthOfTextAtSize(testLine, 12);
      
      if (textWidth > maxWidth) {
        page.drawText(currentLine.trim(), {
          x: margin,
          y: yPosition,
          size: 12,
          font,
          color: rgb(0, 0, 0),
        });
        yPosition -= lineHeight;
        currentLine = word + ' ';
        
        // Adicionar nova página se necessário
        if (yPosition < margin) {
          const newPage = pdfDoc.addPage();
          page = newPage;
          yPosition = height - margin;
        }
      } else {
        currentLine = testLine;
      }
    }
    
    // Desenhar última linha
    if (currentLine.trim()) {
      page.drawText(currentLine.trim(), {
        x: margin,
        y: yPosition,
        size: 12,
        font,
        color: rgb(0, 0, 0),
      });
      yPosition -= lineHeight * 2;
    }

    // Pontos-chave
    page.drawText('PONTOS-CHAVE', {
      x: margin,
      y: yPosition,
      size: 16,
      font: boldFont,
      color: rgb(0, 0, 0),
    });
    yPosition -= lineHeight;

    for (const point of summary.keyPoints) {
      page.drawText(`• ${point}`, {
        x: margin,
        y: yPosition,
        size: 12,
        font,
        color: rgb(0, 0, 0),
      });
      yPosition -= lineHeight;
      
      if (yPosition < margin) {
        const newPage = pdfDoc.addPage();
        page = newPage;
        yPosition = height - margin;
      }
    }

    // Salvar PDF do resumo
    const pdfBytes = await pdfDoc.save();
    const filename = `summary_${Date.now()}.pdf`;
    const outputPath = path.join(this.uploadsDir, filename);
    
    await fs.writeFile(outputPath, pdfBytes);
    
    return `/uploads/${filename}`;
  }

  async saveSummaryAsMarkdown(summary: BookSummary): Promise<string> {
    await this.ensureUploadsDir();

    const markdown = `# ${summary.title}

**Total de páginas:** ${summary.totalPages}

## Resumo

${summary.summary}

## Pontos-Chave

${summary.keyPoints.map(point => `- ${point}`).join('\n')}

---

*Resumo gerado automaticamente em ${new Date().toLocaleDateString('pt-BR')}*
`;

    const filename = `summary_${Date.now()}.md`;
    const outputPath = path.join(this.uploadsDir, filename);
    
    await fs.writeFile(outputPath, markdown);
    
    return `/uploads/${filename}`;
  }
}