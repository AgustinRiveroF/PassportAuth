import { Router } from "express";

const router = Router()

router.get("/login", (req, res) =>{
    res.render("login")
});

router.get("/signup", (req, res) =>{
    res.render("signup")
});

router.get("/profile", (req, res) =>{
    if(!req.session.passport) {
        return res.redirect('login')
    }
    res.render("profile",{ user: req.user })
});


export default router