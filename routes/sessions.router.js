import { Router } from "express";
import { usersManager } from '../dao/managersDB/usersManager.js'
import { hashData, compareData } from "../utils.js";
import passport from "passport";

const router = Router();


router.get('/get-user', (req, res) => {
    // console.log('Session:', req.session);
    // console.log('Passport user:', req.session.passport ? req.session.passport.user : null);

    const user = req.session.passport ? req.session.passport.user : null;

    if (user && user.email) {
        res.json({ email: user.email, role: user.role });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});



//----------------------------------------------------- LOGIN & SIGNUP CON PASSPORT ----------------------------------------------------------


router.post('/signup', passport.authenticate('signup', {
    successRedirect: '/views/login',
    failureRedirect: '/views/signup'
}));

router.post("/login", passport.authenticate("login", { failureRedirect: "/views/login" }), async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
            let role = "admin";
            req.session.user = { email, role };
            return res.render("admin");
        }

        const user = await usersManager.findByEmail(email);

        if (!user) {
            return res.redirect("/views/signup");
        }

        const isPasswordValid = await compareData(password, user.password);

        if (!isPasswordValid) {
            return res.render("login", { errorMessage: 'Contraseña no válida' });
        }

        let role = "usuario";
        req.session.user = { email, first_name: user.first_name, role };

        res.redirect("/api/products");
    } catch (error) {
        return res.status(500).json({ error });
    }
});


//--------------------------------------------------------LOGIN & SIGNUP CON GITHUB ----------------------------------------------------------


router.get(
    "/auth/github",
    passport.authenticate('github', { scope: ["user:email"] })
);


router.get(
    "/callback",
    passport.authenticate('github', {
        failureRedirect: '/views/login',
    }),
    (req, res) => {
        // console.log("GitHub authentication successful");
        // console.log("Passport user:", req.session.passport.user);
        res.redirect('/api/products');
    }
);

//--------------------------------------------------------SESSION-----------------------------------------------------------------------------

router.get('/current', passport.authenticate('session'), (req, res) => {
    res.json({ user: req.user });
});



export default router