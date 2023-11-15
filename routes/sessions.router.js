import { Router } from "express";
import { usersManager } from '../dao/managersDB/usersManager.js'
import { hashData, compareData } from "../utils.js";
import passport from "passport";

const router = Router();

router.get('/get-user', (req, res) => {
    if (req.session.user) {
        res.json(req.session.user);
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
    passport.authenticate('github', { scope: ['user:email'] })
  );
  
  
  
  router.get(
    "/callback",
    passport.authenticate('github', {
      failureRedirect: '/views/login',
    }),
    (req, res) => {
      res.redirect('/views/profile');
    }
  );
  
  

//----------------------------------------------------- LOGIN & SIGNUP SIN PASSPORT --------------------------------------------------------


/* router.post('/signup', async (req, res) => {
   const { first_name, last_name, email, password } = req.body;
   if (!first_name || !last_name || !email || !password) {
       return res.status(400).json({ message: 'Todos los campos son requeridos' });
   }
   try {
       const existingUser = await usersManager.findByEmail(email);
       if (existingUser) {
           return res.status(400).json({ message: 'Ya existe un usuario con ese email' });
       }
       const hashedPassword = await hashData(password);
       const createdUser = await usersManager.createOne({...req.body,password:hashedPassword,});

       res.redirect('/views/login');
   } catch (error) {
       res.status(500).json({ error: error.message });
   }
}); 


router.post("/login", async (req, res) => {
   const { email, password } = req.body;

   if (!email || !password) {
       return res.status(400).json({ message: 'Campos incorrectos' });
   }

   try {
       if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
           // Asignar roles
           let role = "admin";
           req.session.user = { email, role };
           return res.render("admin");
       }

       const user = await usersManager.findByEmail(email);

       if (!user) {
           return res.redirect("/views/signup");
       }

       // const isPasswordValid = password === user.password;

       const isPasswordValid = await compareData(password,user.password)

       if (!isPasswordValid) {
           return res.render("login", { errorMessage: 'Contraseña no válida' });
       }

       let role = "usuario";
       req.session.user = { email, first_name: user.first_name, role };
       res.redirect("/api/products");
   } catch (error) {
       return res.status(500).json({ error });
   }
}); */

export default router