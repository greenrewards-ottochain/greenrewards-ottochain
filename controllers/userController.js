const { User } = require("../models/userModel");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const nodemailer = require("nodemailer")


//function to generate 4 digit code
const generateCode = () => {
    const code = Math.floor(1000 + Math.random() * 9000);
    return code;
};

module.exports.signUp_post = async (req, res) => {
    try {
        const { name, email, password, } = req.body;

        //check if user already exists
        const userEmail = await User.findOne({ email: req.body.email });

        if (userEmail) {
            return res.status(400).json({
                status: "fail",
                message: "user already exists",
            });
        }
        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //generate 4 digit code
        const code = generateCode();

        //store code with user's data in database
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            twoFactorSecret: code,
            twoFactorCodeExpires: Date.now() + 600000,
        });


        //send code to user's email
        const transporter = nodemailer.createTransport({
            service: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        });

        //verify connection configuration
        transporter.verify((err, success) => {
            if (err) {
                console.log(err);
            } else {
                console.log("server is ready to take messages");
            }
        }
        );
        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: "Email Verification",
            html: `<h2>Thank you for registering with Green Reward</h2>
      <p>Your verification code is ${code}</p>
      <p>This code will expire in 5 minutes</p>`,
        });
        res.status(201).json({
            status: "success",
            message: "user created successfully",
            data: user,
        });
    } catch (err) {
        const errors = (err);
        res.status(400).json({ errors });
    }
};

module.exports.saveWallet = async (req, res) => {
    const { userId, walletAddress } = req.body

    const isUserExist = await User.findById(userId)
    if (!isUserExist) {
        res.status(404).json({
            status: "fail",
            message: "user not found"
        })
    }
    const updateUserWallet = await User.findByIdAndUpdate(userId, { walletAddress })
    if (!updateUserWallet) {
        res.status(403).json({
            status: "fail",
            message: "not updated"
        })
    }
    res.status(200).json({
        status: "success",
        message: "wallet saved"
    })
}

module.exports.login = async (req, res) => {
    try {
        //find user
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({
                status: "fail",
                message: "user does not exist",
            });
        }
        //if user found compare password
        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );

        //if password is not valid
        if (!validPassword) {
            return res.status(400).json({
                status: "fail",
                message: "invalid password",
            });
        }
        // Check if 2FA code has expired or is invalid
        if (user.twoFactorCodeExpires < Date.now() || user.twoFactorSecret !== req.body.code) {
            // If the code has expired, you can generate a new one here
            const newCode = generateCode(); // Assuming generateCode is a function that generates a new 4-digit code
            user.twoFactorSecret = newCode;
            user.twoFactorCodeExpires = Date.now() + 600000; // 10 minutes from now
            await user.save(); // Save the updated user with the new code

            return res.status(400).json({
                status: "fail",
                message: "invalid code, a new code has been sent to your email",
            });
        }
        //if password is valid create token
        const token = jwt.sign({ _id: user._id }, process.env.MY_SECRET, {
            expiresIn: "7days",
        });
        //verify token

        const verified = jwt.verify(token, process.env.MY_SECRET);
        //send token to client
        res.cookie("jwt", token, {
            maxAge: 1000 * 60 * 60 * 24 * 7,
        });
        res.status(200).json({
            status: "success",
            message: "user logged in successfully",
            data: verified,
        });
    } catch (err) {
        const errors = (err);
        res.status(400).json({ errors });
    }
};

