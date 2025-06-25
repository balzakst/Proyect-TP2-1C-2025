// Middleware para verificar el rol del usuario
export function requireRole(role) {
    return (req, res, next) => {
        // Suponiendo que el usuario ya está autenticado y su info está en req.user
        if (!req.user) {
            return res.status(401).json({ message: "No autenticado" });
        }
        if (req.user.rol !== role) {
            return res.status(403).json({ message: "Acceso denegado: requiere rol " + role });
        }
        next();
    };
}
