import * as Yup from 'yup';

/**
 * 1) Step Category
 */
export const CategorySchema = Yup.object().shape({
    category: Yup.string().required('Kategori wajib dipilih'),
});

/**
 * 2) Step Location
 */
export const LocationSchema = Yup.object().shape({
    location: Yup.string().required('Lokasi wajib diisi'),
    region: Yup.string().required('Region / Provinsi wajib diisi'),
});

/**
 * 3) Step Info
 */
export const InfoSchema = Yup.object().shape({
    name: Yup.string().required('Nama properti wajib diisi'),
    description: Yup.string().required('Deskripsi wajib diisi'),
});

/**
 * 4) Step Rooms
 */
export const RoomsSchema = Yup.object().shape({
    rooms: Yup.array()
        .of(
            Yup.object().shape({
                name: Yup.string().required("Nama kamar wajib diisi"),
                price: Yup.number()
                    .min(10000, "Harga minimal Rp10.000")
                    .required("Harga wajib diisi"),
                maxGuests: Yup.number()
                    .min(1, "Minimal 1 tamu")
                    .required("Jumlah tamu wajib diisi"),
            })
        )
        .min(1, "Minimal harus ada 1 kamar"), // ✅ Pastikan setidaknya ada 1 kamar
});

/**
 * 5) Step Price
 */
export const PriceSchema = Yup.object().shape({
    basePrice: Yup.number()
        .typeError('Harga harus angka')
        .required('Harga wajib diisi')
        .min(1, 'Minimal harga 1'),
});

/**
 * 6) Step Images
 *    Misal: minimal 1 gambar
 */
export const ImagesSchema = Yup.object().shape({
    images: Yup.array()
        .min(1, 'Minimal 1 foto wajib diupload')
        .required('Foto wajib diupload'),
});

/**
 * 7) Step Review
 *    Bisa saja tidak ada field baru, sehingga tidak butuh schema khusus.
 *    Namun, untuk contoh, kita buat minimal agar validasi lulus.
 */
export const ReviewSchema = Yup.object().shape({});
