import { Injectable, OnModuleInit } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService implements OnModuleInit {
  onModuleInit() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  /**
   * Sube un archivo (buffer en memoria, viene de Multer) a Cloudinary
   * y devuelve la URL pública (secure_url).
   */
  async uploadFile(file: Express.Multer.File, folder = 'properties'): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder },
        (error, result) => {
          if (error || !result) {
            return reject(error);
          }
          resolve(result.secure_url);
        },
      );
      uploadStream.end(file.buffer);
    });
  }

  /**
   * Elimina un archivo de Cloudinary a partir de su URL pública.
   * Cloudinary necesita el "public_id" (carpeta/nombre sin extensión),
   * así que lo extraemos de la URL.
   */
  async deleteFile(fileUrl: string): Promise<void> {
    const publicId = this.extractPublicId(fileUrl);
    if (!publicId) return;
    await cloudinary.uploader.destroy(publicId).catch(() => null);
  }

  private extractPublicId(url: string): string | null {
    // Ejemplo de URL:
    // https://res.cloudinary.com/<cloud>/image/upload/v1234567890/properties/abc123.jpg
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/);
    return match ? match[1] : null;
  }
}
