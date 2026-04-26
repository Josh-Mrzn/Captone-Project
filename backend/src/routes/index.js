// backend/src/routes/index.js
import express from "express";
import authRoutes from "./authRoutes.js";
import productRoutes from "./productRoutes.js";
import superAdminRoutes from "./superAdminRoutes.js";
// import userRoutes from "./userRoutes.js";
// import bannerRoutes from './bannerRoutes.js';

const router = express.Router();

// API root - helpful for checking if the backend is live
router.get("/", (req, res) => {
  res.json({
    message: "API is running...",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    endpoints: {
      health: "GET /",
      register: "POST api/auth/register",
      login: "POST api/auth/login",
      logout: "POST api/auth/logout",
      products: "GET api/products",
      // Add more as you create them:
      // profile: "GET api/user/profile",
      // banners: "GET api/banner",
    },
  });
});

// === Mount Route Modules ===
router.use("/auth", authRoutes);     // → /api/auth/...
router.use("/products", productRoutes); // → /api/products/...
router.use("/superadmin", superAdminRoutes); // → /api/superadmin/...  
// router.use("/user", userRoutes);     // → /api/user/...
// router.use("/banner", bannerRoutes); // → /api/banner/...

export default router;
