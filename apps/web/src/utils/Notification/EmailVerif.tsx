import Swal from "sweetalert2";

/**
 * Handler untuk menampilkan alert jika user belum verifikasi email
 */
export const handleVerificationAlert = () => {
    Swal.fire({
        title: "Verifikasi Diperlukan!",
        text: "Silakan verifikasi email Anda terlebih dahulu untuk mengakses fitur ini.",
        icon: "warning",
        confirmButtonText: "OK",
    });
};