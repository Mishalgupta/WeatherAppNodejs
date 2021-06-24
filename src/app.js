const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const bcrypt = require("bcryptjs");
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

require("./db/conn");
const Register = require("./models/form");
app.post("/form", async (req, res) => {
    try {
        // console.log(req.body.fullname);
        // res.send(req.body.fullname);

        const password = req.body.password;
        const cpassword = req.body.conformpassword;
        if (password === cpassword) {
            const registerEmployee = new Register({
                fullname: req.body.fullname,
                email: req.body.email,
                phone: req.body.phone,
                password: password,
                conformpassword: cpassword
            })
            const register = await registerEmployee.save();
            res.status(201).render("index");
        }
        else {
            res.send("Password are not matching");
        }
    } catch (err) {
        res.status(400).send(err);
    }
});

// public static path
const static_path = path.join(__dirname, "../public");
const templates_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

app.set('view engine', 'hbs');
app.set('views', templates_path)
hbs.registerPartials(partials_path);

app.use(express.static(static_path));

// routing
app.get("", (req, res) => {
    res.render('index');
});

app.get("/about", (req, res) => {
    res.render('about');
});

app.get("/weather", (req, res) => {
    res.render('weather');
});
app.get("/form", (req, res) => {
    res.render('form');
});

app.get("/login", (req, res) => {
    res.render('login');
});
app.get("*", (req, res) => {
    res.render('404Error', {
        errorMsg: 'oops! page not found'
    });
});


//login validation
app.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        // console.log(`${email} and password is ${password}`);

        const userEmail = await Register.findOne({ email: email });

        // this will procede our request if password matches
        const isMatch = await bcrypt.compare(password, userEmail.password);

        if (isMatch) {
            res.status(201).render("index");
        } else {
            res.send("Invalid login details");
        }
    } catch (error) {
        res.status(400).send("Invalid login details");
    }

})

// Hashing is a one way communication
// we will use here bcrypt.js to hash our passwords.

// const bcrypt = require("bcryptjs");
// const securePassword = async (password) => {
//     const passwordHash = await bcrypt.hash(password, 10);
//     console.log(passwordHash); // this will generate hash code of our password  with 10 rounds

//     const passwordMatch = await bcrypt.compare(password, passwordHash);
//     console.log(passwordMatch); // this will procede our request if password matches
// }
// securePassword("mishal123");

app.listen(port, () => {
    console.log(`listening to the port http://localhost:${8000}`)
});