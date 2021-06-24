const mongoose = require('mongoose');
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
    }
})

//for pre check for middleware
formSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        // const passwordHash = await bcrypt.hash(password, 10);
        console.log(`the current password is : ${this.password}`);
        this.password = await bcrypt.hash(this.password, 10);
        console.log(`the current password is : ${this.password}`);
        
        this.conformpassword = undefined;
    }
    next();
})
//now we need to create a collection
const Register = new mongoose.model('Register', formSchema);

module.exports = Register;