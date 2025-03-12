const FacilityAndRules = () => {
    return (
        <div className="mt-8">
            {/* Fasilitas */}
            <div className="border-b pb-4">
                <h2 className="text-xl font-semibold mb-2">Fasilitas yang ditawarkan</h2>
                <p className="text-gray-600 mb-4">
                    Setiap rumah Luxe dilengkapi dengan semua peralatan untuk memenuhi kebutuhan Anda,
                    memiliki ruang yang lapang dan memberikan privasi.
                </p>
                <ul className="grid grid-cols-2 gap-2 text-gray-700">
                    <li>🌳 Pemandangan taman</li>
                    <li>🛡️ Petugas keamanan</li>
                    <li>🏊‍♂️ Kolam renang pribadi</li>
                    <li>📶 Wifi</li>
                    <li>🅿️ Parkir gratis</li>
                    <li>🧹 Layanan kebersihan</li>
                    <li>🍹 Bartender</li>
                    <li>🍽️ Dapur</li>
                    <li>💻 Area kerja khusus</li>
                    <li>🎥 Kamera keamanan</li>
                </ul>
            </div>

            {/* Layanan Tambahan */}
            <div className="border-b pb-4 mt-4">
                <h2 className="text-xl font-semibold mb-2">Layanan tambahan</h2>
                <ul className="grid grid-cols-2 gap-2 text-gray-700">
                    <li>👨‍🍳 Chef pribadi</li>
                    <li>🛍️ Penyediaan barang keperluan</li>
                    <li>✈️ Transfer bandara</li>
                </ul>
            </div>

            {/* Hal yang Perlu Diketahui */}
            <div className="mt-4">
                <h2 className="text-xl font-semibold mb-2">Hal yang perlu diketahui</h2>
                <div className="grid grid-cols-3 gap-4 text-gray-700">
                    {/* Peraturan Rumah */}
                    <div>
                        <h3 className="font-semibold">Peraturan rumah</h3>
                        <ul>
                            <li>🕒 Check-in setelah 15.00</li>
                            <li>🕚 Check-out sebelum 11.00</li>
                            <li>👨‍👩‍👦 Maksimum 12 tamu</li>
                        </ul>
                    </div>

                    {/* Keselamatan & Properti */}
                    <div>
                        <h3 className="font-semibold">Keselamatan & Properti</h3>
                        <ul>
                            <li>🎥 Kamera keamanan luar</li>
                            <li>🏊 Kolam renang tanpa gerbang</li>
                            <li>🌊 Dekat dengan sungai/danau</li>
                        </ul>
                    </div>

                    {/* Kebijakan Pembatalan */}
                    <div>
                        <h3 className="font-semibold">Kebijakan pembatalan</h3>
                        <p>Tidak ada pengembalian dana untuk reservasi ini.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FacilityAndRules;
