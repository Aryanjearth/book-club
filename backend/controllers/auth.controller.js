const user_model = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secret = require("../config/auth.config");

const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|yahoo\.co\.in|outlook\.com|hotmail\.com|rediffmail\.com|chitkara\.edu\.in|edu|gov\.[a-z]{2})$/;

const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,15}$/;

exports.signup = async (req, res) => {
    const { username, email, password } = req.body;

    // Check for missing fields
    if (!username || !email || !password) {
        return res.status(400).send({
            message: "All fields (username, email, password) are required"
        });
    }

    // Validate username
    if (/^\s/.test(username)) {
        return res.status(400).send({
            message: "Username must not start with a space"
        });
    }

    if (/\s{2,}/.test(username)) {
        return res.status(400).send({
            message: "Username must not contain two or more consecutive spaces"
        });
    }

    if (username.length > 12) {
        return res.status(400).send({
            message: "Username must not be longer than 12 characters"
        });
    }

    // Validate email
    if (/\s/.test(email)) {
        return res.status(400).send({
            message: "Email must not contain spaces"
        });
    }

    if (email.length > 35 || !emailRegex.test(email)) {
        return res.status(400).send({
            message: "Email must not be longer than 35 characters, must follow a valid format, and must not be unusual"
        });
    }

    // Validate password
    if (/\s/.test(password)) {
        return res.status(400).send({
            message: "Password must not contain spaces"
        });
    }

    if (!passwordRegex.test(password)) {
        return res.status(400).send({
            message: "Password must be 8-15 characters long, include one uppercase letter, one number, and one special character."
        });
    }

    // Check if email is already in use
    try {
        const existingUser = await user_model.findOne({ email });
        if (existingUser) {
            return res.status(409).send({
                message: "Email is already registered"
            });
        }
    } catch (err) {
        console.error("Error while checking for existing user:", err);
        return res.status(500).send({
            message: "Error occurred while processing your request"
        });
    }

    // Create user object
    const userObj = {
        username,
        password: bcrypt.hashSync(password, 8),
        email
    };

    try {
        const user = await user_model.create(userObj);

        // Return user response
        res.status(201).send({
            message: "User registered successfully",
            user,
        });
    } catch (err) {
        console.error("Error occurred while registering user:", err);
        res.status(500).send({
            message: "An error occurred while registering the user"
        });
    }
};

exports.signin = async (req, res) => {
    const { email, password } = req.body;

    // Check for missing fields
    if (!email || !password) {
        return res.status(400).send({
            message: "Email and password are required"
        });
    }

    // Check for spaces in email
    if (/\s/.test(email)) {
        return res.status(400).send({
            message: "Email must not contain spaces"
        });
    }

    // Email validation: must not be longer than 20 characters and valid format
    if (email.length > 35 || !emailRegex.test(email)) {
        return res.status(400).send({
            message: "Email must not be longer than 35 characters, must follow a valid format, and must not be unusual"
        });
    }

    // Check for spaces in password
    if (/\s/.test(password)) {
        return res.status(400).send({
            message: "Password must not contain spaces"
        });
    }

    try {
        // Check if user exists
        const user = await user_model.findOne({ email });
        if (!user) {
            return res.status(404).send({
                message: "User not found"
            });
        }

        // Validate password
        const isPasswordCorrect = bcrypt.compareSync(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).send({
                message: "Invalid password"
            });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, secret.secret, {
            expiresIn: 3600, // Token expires in 1 hour
        });

        res.status(200).send({
            message: "Signin successful",
            user,
            accessToken: token
        });
    } catch (err) {
        console.error("Error occurred during signin:", err);
        res.status(500).send({
            message: "An error occurred during signin"
        });
    }
};
