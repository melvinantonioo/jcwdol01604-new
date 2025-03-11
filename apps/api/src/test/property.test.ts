import request from 'supertest';
import express from 'express';
import multer from 'multer';
import upload from '@/middlewares/upload';
import { createPropertyListing } from '@/controllers/create.property.controller';

const app = express();

// Middleware untuk parsing form-data sudah dilakukan oleh multer
app.post('/properties', upload.single('image'), createPropertyListing);

// Buat dummy user middleware agar req.user tersedia
app.use((req, res, next) => {
    req.user = {
        id: 1,
        role: 'TENANT',
        email: 'dummy@example.com',
        name: 'Tenant Dummy',
        
        // Tambahkan field lain jika diperlukan sesuai dengan definisi model User
    };
    next();
});

describe('POST /properties', () => {
    it('should upload image and create property listing', async () => {
        const res = await request(app)
            .post('/properties')
            .field('name', 'Test Property')
            .field('categoryId', '1')
            .field('basePrice', '100')
            .attach('image', 'tests/test-image.jpg'); // pastikan file ini ada di direktori test

        expect(res.status).toBe(201);
        expect(res.body.property).toHaveProperty('imageUrl');
    });
});
