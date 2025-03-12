import express, { Request, Response, Application } from 'express';
import authRoutes from './routers/auth.routes';
import ErrorMiddleware from "./middlewares/error.middleware";
import { PORT as port, BASE_WEB_URL } from "./config";
import cors from "cors";

import propertyRoutes from '@/routers/property.routes';
import filterRoutes from "@/routers/search.routes";
import updateRole from '@/routers/update.role.routes';
import uploadRoutes from '@/routers/upload.routes';
import dashboardRoutes from '@/routers/dashboard.route';
import bookingRoutes from '@/routers/booking.routes';
import peakSeasonRoutes from '@/routers/peakSeason.routes';
import profileRoutes from '@/routers/profile.routes';
import pricingRoutes from '@/routers/pricing.routes';
import roomRoutes from '@/routers/room.routes';
import orderRoutes from "@/routers/order.routes";

import googleLoginRoute from '@/routers/social.routes'


import dotenv from "dotenv";
dotenv.config();

const PORT = Number(port) || 8000;

const app: Application = express();

app.use(
  cors({
    origin: BASE_WEB_URL || "http://localhost:3000",
    credentials: true,
  })
);


app.use(express.json());

app.use('/auth', authRoutes);  
app.use('/property', propertyRoutes);
app.use('/api', filterRoutes);


app.use("/role", updateRole);

app.use('/api', uploadRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/peak-season', peakSeasonRoutes);
app.use('/profile', profileRoutes);
app.use('/api/pricing', pricingRoutes);
app.use('/api/room', roomRoutes)

app.use("/api/dashboard/bookings", orderRoutes);

app.use("/api/login", googleLoginRoute);


app.use(ErrorMiddleware);


app.listen(PORT, () => {
  console.log(`Server jalan di ${PORT}`)
});

export default app;
