import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error al destruir la sesión:", err);
            res.status(500).json({ status: "error", message: "Error al cerrar sesión" });
        } else {
            res.redirect("/views/login");
        }
    });
});

export default router
