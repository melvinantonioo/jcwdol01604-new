import { Request, Response } from "express";
import prisma from "@/prisma";
import { User } from "@prisma/client";


export const createBooking = async (req: Request, res: Response) => {
    try {
        const { id: userId } = req.user as User; // ID User dari token auth
        const { roomId, startDate, endDate, numRooms } = req.body;

        if (!roomId || !startDate || !endDate || !numRooms) {
            return res.status(400).json({ message: "Semua data booking harus diisi" });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (end <= start) {
            return res.status(400).json({ message: "Tanggal check-out harus lebih besar dari check-in" });
        }

        // **1️⃣ Ambil data kamar termasuk harga & kapasitas**
        const room = await prisma.room.findUnique({
            where: { id: roomId },
            include: {
                peakSeasonRates: {
                    where: {
                        OR: [
                            { startDate: { lte: start }, endDate: { gte: start } },
                            { startDate: { lte: end }, endDate: { gte: end } }
                        ]
                    }
                }
            }
        });

        if (!room) {
            return res.status(404).json({ message: "Kamar tidak ditemukan" });
        }

        // **2️⃣ Cek apakah kamar sudah dibooking untuk tanggal yang sama**
        const existingBookings = await prisma.booking.findMany({
            where: {
                roomId,
                OR: [
                    { startDate: { lt: end }, endDate: { gt: start } }, // Jika booking bertabrakan dengan tanggal yang diminta
                ],
                status: { not: "CANCELLED" }
            }
        });

        // **Hitung jumlah kamar yang sudah dibooking**
        const bookedRooms = existingBookings.length;
        const availableRooms = room.maxGuests - bookedRooms;

        if (availableRooms < numRooms) {
            return res.status(400).json({
                message: `Hanya tersedia ${availableRooms} kamar untuk tanggal ini`
            });
        }

        // **3️⃣ Hitung total harga dengan Peak Season Adjustment**
        let totalPrice = 0;
        const priceBreakdown = [];
        let currentDate = new Date(start);

        while (currentDate < end) {
            let adjustedPrice = room.price; // Default base price

            // Cek apakah ada peak season pada tanggal ini
            const peakRate = room.peakSeasonRates.find(rate =>
                currentDate >= rate.startDate && currentDate <= rate.endDate
            );

            if (peakRate) {
                if (peakRate.priceAdjustment) {
                    adjustedPrice += peakRate.priceAdjustment;
                } else if (peakRate.percentageAdjustment) {
                    adjustedPrice += (room.price * peakRate.percentageAdjustment) / 100;
                }
            }

            totalPrice += adjustedPrice * numRooms;
            priceBreakdown.push({
                date: currentDate.toISOString().split("T")[0],
                price: adjustedPrice,
                adjustment: peakRate ? (peakRate.priceAdjustment || peakRate.percentageAdjustment) : 0
            });

            currentDate.setDate(currentDate.getDate() + 1);
        }

        // **4️⃣ Buat booking & update RoomAvailability**
        const booking = await prisma.$transaction(async (tx) => {
            const newBooking = await tx.booking.create({
                data: {
                    userId,
                    roomId,
                    startDate: start,
                    endDate: end,
                    status: "WAITING_PAYMENT",
                    totalPrice
                }
            });

            // **Update RoomAvailability**
            await tx.roomAvailability.updateMany({
                where: {
                    roomId,
                    date: { gte: start, lt: end },
                },
                data: { isAvailable: false }
            });

            return newBooking;
        });

        res.status(201).json({
            message: "Booking berhasil dibuat, lanjutkan ke pembayaran",
            bookingId: booking.id,
            totalPrice,
            priceBreakdown
        });
    } catch (error) {
        console.error("Error creating booking:", error);
        res.status(500).json({ message: "Terjadi kesalahan saat membuat booking" });
    }
};






//get Booking 
export const getBookingDetails = async (req: Request, res: Response) => {
    try {
        const { bookingId } = req.params;

        const booking = await prisma.booking.findUnique({
            where: { id: parseInt(bookingId) },
            include: {
                room: {
                    include: {
                        property: {
                            select: { name: true, location: true, imageUrl: true },
                        },
                    },
                },
                user: {
                    select: { name: true, email: true },
                },
            },
        });

        if (!booking) {
            return res.status(404).json({ message: "Booking tidak ditemukan" });
        }

        res.json(booking);
    } catch (error) {
        console.error("Error fetching booking details:", error);
        res.status(500).json({ message: "Terjadi kesalahan saat mengambil detail booking" });
    }
};
