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
   */
  async deleteFile(fileUrl: string): Promise<void> {
    const publicId = this.extractPublicId(fileUrl);
    if (!publicId) return;
    await cloudinary.uploader.destroy(publicId).catch(() => null);
  }

  private extractPublicId(url: string): string | null {
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/);
    return match ? match[1] : null;
  }
}
