import express from "express";
import { registerUser, loginUser, getMe, getAllUsers,assignManager } from "../controllers/authController.js";
import { protect ,authorizeRoles} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.get("/users", protect, authorizeRoles("admin"), getAllUsers);
router.put("/users/:id/assign-manager", protect, authorizeRoles("admin"), assignManager);

export default router;