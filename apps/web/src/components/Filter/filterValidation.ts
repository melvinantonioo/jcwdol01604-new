// validations/filterValidation.ts
import * as Yup from 'yup';

export const filterSchema = Yup.object().shape({
    name: Yup.string()
        .max(50, 'Nama properti maksimal 50 karakter'),
    minPrice: Yup.number()
        .typeError('Harga minimal harus berupa angka')
        .min(0, 'Harga minimal 0'),
    maxPrice: Yup.number()
        .typeError('Harga maksimal harus berupa angka')
        .min(0, 'Harga minimal 0')
        .test('maxCheck', 'Maksimal harus >= minimal', function (value) {
            const { minPrice } = this.parent;
            if (typeof value !== 'number') return true; // skip if empty
            if (typeof minPrice === 'number') {
                return value >= minPrice;
            }
            return true;
        }),
    category: Yup.string(),
    sort: Yup.string(), // 'priceAsc' | 'priceDesc' | ''
});
