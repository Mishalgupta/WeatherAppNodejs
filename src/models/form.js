const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const formSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: Number,
        required: true,
        unique: true

    },
    password: {
        type: String,
        required: true
    },
    conformpassword: {
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

//generating tokens
formSchema.methods.generateAuthToken = async function () {
    try {
        const token = jwt.sign({ _id: this._id.toString() }, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token;
    } catch (err) {
        res.send("the error part" + err);
        console.log("the error part" + err);

    }
}

//converting password into hash code
//for pre check for middleware
formSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        // const passwordHash = await bcrypt.hash(password, 10);
        // console.log(`the current password is : ${this.password}`);
        this.password = await bcrypt.hash(this.password, 10);
        this.conformpassword = await bcrypt.hash(this.password, 10);
        // console.log(`the current password is : ${this.password}`);

        // this.conformpassword = undefined;
    }
    next();
})
//now we need to create a collection
const Register = new mongoose.model('Register', formSchema);

module.exports = Register;