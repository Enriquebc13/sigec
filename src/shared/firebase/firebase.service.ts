import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { v4 as uuid } from 'uuid';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private bucket: any;

  onModuleInit() {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID || 'tu-proyecto-id',
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
        }),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'tu-proyecto.appspot.com',
      });
    }
    this.bucket = admin.storage().bucket();
  }

  /**
   * Sube un archivo a Firebase Storage y devuelve la URL pública.
   */
  async uploadFile(file: Express.Multer.File, folder = 'properties'): Promise<string> {
    const fileName = `${folder}/${uuid()}-${file.originalname}`;
    const fileUpload = this.bucket.file(fileName);

    await fileUpload.save(file.buffer, {
      metadata: { contentType: file.mimetype },
    });

    await fileUpload.makePublic();

    return `https://storage.googleapis.com/${this.bucket.name}/${fileName}`;
  }

  /**
   * Elimina un archivo de Firebase Storage a partir de su URL pública.
   */
  async deleteFile(fileUrl: string): Promise<void> {
    const filePath = fileUrl.split(`${this.bucket.name}/`)[1];
    if (!filePath) return;
    await this.bucket
      .file(filePath)
      .delete()
      .catch(() => null);
  }
}
