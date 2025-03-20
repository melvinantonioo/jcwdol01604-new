"use client";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/AxiosInstance";

const UpdateRolePage: React.FC = () => {
    const router = useRouter();

    const handleUpdateRole = async (): Promise<void> => {
        try {
            const response = await axiosInstance.post<{ message: string }>("/role/update-role");
            alert(response.data.message);

            router.push("/login");
        } catch (error: any) {
            console.error("Error updating role:", error);
            alert(error.response?.data?.message || "Gagal memperbarui role. Silakan coba lagi.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-6 max-w-md">
                <h1 className="text-2xl font-bold mb-4 text-center">Daftar Jadi TENANT</h1>
                <p className="mb-6 text-center text-gray-600">
                    Daftarkan diri anda , dan bermitra dengan kami. Satu langkah yang mengubah tempat tinggal-mu menjadi peluang 
                </p>
                <div className="flex justify-center">
                    <button
                        onClick={handleUpdateRole}
                        className="bg-zinc-700 text-white py-2 px-4 rounded hover:bg-zinc-500"
                    >
                        Daftar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpdateRolePage;