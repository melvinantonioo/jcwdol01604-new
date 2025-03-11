export const fetchGeolocation = async (location: string, region: string): Promise<[number, number] | null> => {
    try {
        console.log("🔎 Mencari lokasi untuk:", location, region);

        const API_KEY = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY;
        if (!API_KEY) throw new Error("❌ API Key OpenCageData tidak ditemukan!");

        const response = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location + ', ' + region)}&key=${API_KEY}`
        );

        const data = await response.json();

        console.log("📍 Data Geocoding API:", data);

        if (data.results.length > 0) {
            const lat: number = data.results[0].geometry.lat;
            const lon: number = data.results[0].geometry.lng;

            console.log("✅ Koordinat Properti:", lat, lon);
            return [lat, lon]; // ✅ Pastikan tipe datanya `[number, number]`
        } else {
            console.warn("⚠️ Lokasi tidak ditemukan untuk:", location, region);
            return null;
        }
    } catch (error) {
        console.error("❌ Gagal mendapatkan koordinat:", error);
        return null;
    }
};