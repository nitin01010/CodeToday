const express = require("express");
const router = express.Router();
const UserModel = require("../db/db");
const Blogmodel = require("../db/dbblog");
const dotenv = require("dotenv");

dotenv.config();

const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");


router.get("/", async (req, res) => {
    try {
        const CheakJwt = await jwt.verify(req.cookies.jwt, process.env.KEYURL);
        if (CheakJwt) {
            res.redirect(`http://127.0.0.1:${process.env.PORT}/accounts/dashboard`);
        }
    } catch (error) {
        res.render('Home.ejs');
    }
});

router.get("/accounts/login/", async (req, res) => {
    try {
        const CheakJwt = await jwt.verify(req.cookies.jwt, process.env.KEYURL)
        res.redirect("/accounts/dashboard")
    } catch (error) {
        res.render('login.ejs');
    }
});

router.get("/accounts/emailsignup/", async (req, res) => {
    try {
        const CheakJwt = await jwt.verify(req.cookies.jwt, process.env.KEYURL)
        res.redirect("/accounts/dashboard")
    } catch (error) {
        res.render('Sigin.ejs');
    }
});

router.get('/api/jwt', (req, res) => {
    res.clearCookie('jwt');
    res.redirect("/");
});

router.get("/accounts/dashboard", async (req, res) => {
    try {
        const tokensave = req.cookies.jwt;
        const user = await jwt.verify(tokensave, process.env.KEYURL);
        const { email } = user;
        const newUser = await UserModel.findOne({ email })
        res.status(200).render("dashboard.ejs", { name: newUser.name });
    } catch (error) {
        res.redirect("/");
    }
});

router.get("/accounts/blog", async (req, res) => {
    try {
        const tokensave = req.cookies.jwt;
        const user = await jwt.verify(tokensave, process.env.KEYURL);
        const { email } = user;
        const newUser = await UserModel.findOne({ email })
        const Blog = await Blogmodel.find({})
        res.status(200).render("Blog.ejs", { data: Blog });
    } catch (error) {
        res.redirect("/");
    }
});

router.get("/accounts/post/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const RaedBlog = await Blogmodel.findById({ _id: id });
        const token = req.cookies.jwt;
        if (!token) {
            res.status(401).send("Login Please");
        }
        res.render("BlogRead.ejs", { RaedBlog });
    } catch (error) {
        res.status(401).send("Please Login ");
    }
});

router.post("/api/newUser", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Making Password Secrecore 
        const Hashpassword = await bcrypt.hash(password, 10);

        //token
        const token = await jwt.sign({ email }, process.env.KEYURL);
        // console.log({ name, email, Hashpassword, token });

        // Save jwt smalldatabase
        res.cookie('jwt', token);

        // Save data in database 
        const dataSaver = await UserModel({ name, email, password: Hashpassword, token })
        dataSaver.save();

        res.redirect(`http://127.0.0.1:${process.env.PORT}/accounts/dashboard`);
    } catch (error) {
        res.status(401).send('There is one Error | GET');
    }
});


router.post("/api/user", async (req, res) => {
    try {
        const { email, password } = req.body;

        const UsreFind = await UserModel.findOne({ email });
        const pass = await bcrypt.compare(password, UsreFind.password);
        res.cookie('jwt', UsreFind.token);

        if (pass) {
            res.status(201).redirect(`http://127.0.0.1:${process.env.PORT}/accounts/dashboard`);
        } else {
            res.status(400).send('Fail to Login in Password');
        }
    } catch (error) {
        res.status(401).send('Email and Password is Worng');
    }
});

router.get("*", (req, res) => {
    res.status(401).send("<h1>No Page</h1>")
});


module.exports = router;