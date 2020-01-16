const express = require('express');
const router = express.Router();
const Test = require('../model/testSchema');
const bcryptjs = require('bcryptjs');
const nodeMailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const secretKey = require('../model/keys').secretKey;
const verify = require('./utility/verifyToken');
// Globle variable
var infoData = {email: null, otp: null};

/**GET home page */
router.post('/', verify, (req, res, next)=>{     // users
    Test.find()
        .then(users => res.status(200).json(users))
        .catch(err => res.status(201).json(err))
});

/**POST home page */
router.post('/create', (req, res, next)=>{  // /users
    const newTest = new Test({
        name: req.body.name,
        email: req.body.email,
        about: req.body.about,
        secret: req.body.secret
    })
    bcryptjs.genSalt(10, function(err, salt) {
        bcryptjs.hash(newTest.secret, salt, function(err, hash) {
            newTest.secret = hash;
            newTest.save()
                .then( createdTest => res.status(200).json({createdTest, success: true}))
                .catch(err => res.status(201).json(err));
        });
    });
});

/**POST login */
router.post('/login', (req, res, next)=>{     // users
    Test.findOne({name: req.body.name})
    .then(userFound => {
            if(!userFound) return res.status(404).json({message: 'user not found'});
            bcryptjs.compare(req.body.secret, userFound.secret).then((match) => {
                if(!match) return res.status(401).json({message: 'Incorrect Secret'});
                const token = jwt.sign({userFound}, secretKey, { expiresIn: '3600s' });
                res.header('auth-token', token).json({token});                
            });
        })   
        .catch(err =>res.status(201).json(err))
});

/**POST forgot password */
router.post('/forgotPassword', (req, res, next)=> {
    if (typeof infoData === undefined || infoData.otp === null ) return res.status(401).json({message:'OTP expired!'})
    if (infoData.otp !== +req.body.otp) return res.status(200).json({message:'Incorrect OTP!'})
    Test.findOne({email: infoData.email})
    .then(userFound => {
        bcryptjs.genSalt(10, function(err, salt) {
            bcryptjs.hash(req.body.newPassword, salt, function(err, hash) {
                userFound.secret = hash;
                userFound.save()
                    .then( newCreated => res.status(200).json({newCreated, success: true}))
                    .catch(err => res.status(201).json(err));
            });
        });
        })   
        .catch(err =>res.status(201).json(err))
});

/**POST send mail */
router.post('/send-mail', (req, res, next)=> {
    Test.findOne({email: req.body.email})
    .then(userFound => {
        if(!userFound) return res.status(404).json({message: 'Email doesn\'t exist'});
        let otp = Math.floor(1000 + Math.random() * 9000);
        let transporter = nodeMailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'dhanesh1296@gmail.com',
                pass: 'dhanesh1296@'
            }
        });
        let mailOptions = {
            from: '"Sheryians Coding School" <dhanesh1296@gmail.com>',
            to: req.body.email,
            subject: "From NODE API",
            text: `Your OTP verification code is ${otp}. Expires in 1 minute. `
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) return res.status(401).json(error);
            infoData = {email: req.body.email, otp: otp};
            setTimeout(() => infoData = {email: null, otp: null}, 1000*30);
            res.status(200).json({message: info.messageId, sent: info.response, infoData});
            });
        })   
        .catch(err =>res.status(201).json(err))
});

module.exports = router;