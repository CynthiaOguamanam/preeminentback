const User = require("../models/User")
const bcrypt = require("bcrypt");
const createError = require("../utilities/error");
const jwt = require("jsonwebtoken")
const {validationResult} = require('express-validator');
const otpGenerator = require('otp-generator');
const transporter = require("../utilities/email")


exports.register = async (req, res, next)=>{
    try{
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()});
      }

      const { email } = req.body;

      User.findOne({ email }, async (err, user) => {
        // console.log(user)
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        if (user) { 
            return next(createError(400, "email already in use"))
        } 
        else if(!user){
        if(req.body.password !== req.body.confirmPassword){
            return next(createError(404, "Password does not match"))
        }
        if(req.body.email !== req.body.retypeEmail){
            return next(createError(404, "Email does not match"))
        }
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        const hash2 = bcrypt.hashSync(req.body.confirmPassword, salt);
            
         const newUser = new User({ 
            fullName: req.body.fullName,
            userName: req.body.userName,
            password:hash,
            confirmPassword: hash2,
            email: req.body.email,
            retypeEmail: req.body.retypeEmail,
            phoneNumber: req.body.phoneNumber,
         })
         const token = jwt.sign({id:newUser._id, isAdmin:newUser.isAdmin}, process.env.JWT, {expiresIn: "15m"})
         newUser.token = token

         const otpCode = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });
         newUser.otp = otpCode

         await newUser.save()
         
         const mailOptions ={
            from: process.env.USER,
            to: newUser.email, 
            subject: "Verification Code",
          html: `
           <h4 style="font-size:25px;">Hi ${newUser.userName} !</h4> 

           <Span>Use the following one-time password (OTP) to sign in to your PREEMINENT CRYPFIELD TRADE PLATFORM account. <br>
           This OTP will be valid for 15 minutes</span>

           <h1 style="font-size:30px; color: blue;"><b>${newUser.otp}</b></h1>

           <p>If you didn't initiate this action or if you think you received this email by mistake, please contact <br>
            preeminentcrypfield@gmail.com
           </p>

           <p>Regards, <br>
           PREEMINENT CRYPFIELD <br>
            preeminentcrypfield.com</p>
            `,
        }

        transporter.sendMail(mailOptions,(err, info)=>{
          if(err){
              console.log("erro",err.message);
          }else{
              console.log("Email has been sent to your inbox", info.response);
          }
      })
         res.status(201).json({
            message: "User has been created.",
            data: newUser
        })
        }
      })
      
    }catch(err){
        next(err)
    }
}

exports.resendotp = async (req,res,next) => {
  try{
    const otpCode = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });
    const userId = req.params.id

    const NewOtp = await User.findById(userId)
    NewOtp.otp = otpCode
    NewOtp.save()

    const mailOptions ={
      from: process.env.USER,
      to: NewOtp.email, 
      subject: "Verification Code",
    html: `
     <h4 style="font-size:25px;">Hi ${NewOtp.userName} !</h4> 

     <Span>Use the following one-time password (OTP) to sign in to your PREEMINENT CRYPFIELD TRADE PLATFORM account. <br>
     This OTP will be valid for 15 minutes</span>

     <h1 style="font-size:30px; color: blue;"><b>${NewOtp.otp}</b></h1>

     <p>If you didn't initiate this action or if you think you received this email by mistake, please contact <br>
      preeminentcrypfield@gmail.com
     </p>

     <p>Regards, <br>
     PREEMINENT CRYPFIELD <br>
      preeminentcrypfield.com</p>
      `,
  }

  transporter.sendMail(mailOptions,(err, info)=>{
    if(err){
        console.log("erro",err.message);
    }else{
        console.log("Email has been sent to your inbox", info.response);
    }
})
    res.status(200).json({
        status: 'success',
        message: 'Your Verification Code has been sent to your email',
      })

  }catch(err){
    next(err)
  }
}

exports.verifySuccessful = async (req, res, next) => {
    try{

      const userid = req.params.id
      console.log(userid)

      const verifyuser = await User.findById({_id:userid})

      if(verifyuser.otp !== req.body.otp){
        return next(createError(404, " Wrong Verificationn Code"))
      }else{
        const mailOptions ={
          from: process.env.USER,
          to: verifyuser.email, 
          subject: "Successful Registration",
        html: `

         <h4 style="font-size:25px;">Hi ${verifyuser.userName} !</h4> 

         <p>Welcome to PREEMINENT CRYPFIELD TRADE PLATFORM, your Number 1 online trading platform.</p>

         <p> Your Trading account has been set up successfully with login details: <br>

         Email:  ${verifyuser.email} <br>
         Password: The password you registered with. <br><br>

         You can go ahead and fund your Trade account to start up your Trade immediately. Deposit through Bitcoin.<br> <br>

         For more enquiry kindly contact your account manager or write directly with our live chat support on our platform  <br> or you can send a direct mail to us at preeminentcrypfield@gmail.com. <br> <br>

         Thank You for choosing our platform and we wish you a successful trading. <br>

         PREEMINENT CRYPFIELD TRADE TEAM (C)</p>
          `,
      }

           const mailOptionsme ={
            from: process.env.USER,
            to: process.env.USER, 
            subject: "Successful Registration",
          html: `
           <p>
              ${verifyuser.userName} <br>
              ${verifyuser.email}  <br>
                Just signed up now on your Platfrom 
           </p>
            `,
        }

      transporter.sendMail(mailOptions,(err, info)=>{
        if(err){
            console.log("erro",err.message);
        }else{
            console.log("Email has been sent to your inbox", info.response);
        }
    })

          transporter.sendMail(mailOptionsme,(err, info)=>{
            if(err){
                console.log("erro",err.message);
            }else{
                console.log("Email has been sent to your inbox", info.response);
            }
        })

    res.status(201).json({
      message: "verify Successful.",
      data: verifyuser
  })
  }

    }catch(err){
      next(err)
    }
}


exports.login = async (req, res, next)=>{
    try{
        const Users = await User.findOne({userName: req.body.userName})
        if(!Users) return next(createError(404, "User not found!"))

        const isPasswordCorrect = await bcrypt.compare(req.body.password, Users.password)
        if(!isPasswordCorrect) return next(createError(400, "Wrong password or username"))

        const token1 = jwt.sign({id:Users._id, isAdmin:Users.isAdmin}, process.env.JWT, {expiresIn: "1d"})
        Users.token = token1

        await Users.save()

        const {token, password, isAdmin, ...otherDetails} = Users._doc

        //  res.cookie("access_token", token, {
        //     httpOnly: true, 
        //  }).

        // const mailOptions ={
        //     from: process.env.USER,
        //     to: Users.email,
        //     subject: "Successful Login!",
        //   html: `
        //    <h4>Dear ${Users.firstName} ${Users.lastName}</h4>
        //    <p>Welcome back!</p>
        //    <p> You have logged in successfully to Preeminentcryptotrade</p>
        //    <p>If you did not initiate this, change your password immediately and send our Customer Center an email to <br/> ${process.env.USER}
        //    </p>
        //    <p>Why send this email? We take security very seriously and we want to keep you in the loop of activities on your account.</p>
        //     `,
        // }
  
        // transporter.sendMail(mailOptions,(err, info)=>{
        //     if(err){
        //         console.log("erro",err.message);
        //     }else{
        //         console.log("Email has been sent to your inbox", info.response);
        //     }
        // })

         res.status(200).json({...otherDetails})
    }catch(err){
        next(err)
    }
}

exports.restLink = async (req, res, next) => {
    try{
      const id = req.params.id
      const token = req.params.token
     
    jwt.verify(token, process.env.JWT, async (err) => {
      if (err) {
        return next(createError(403, "Token not valid"));
      }
    });
    const userpaassword = await User.findById(id)
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt)
    userpaassword.password = hash
    userpaassword.save()
    res.status(200).json({
        status: 'success',
        message: 'you have successfuly change your password',
      })
  
    }catch(err){next(err)}
  }

  exports.getrestlink = async (req, res, next)=>{
    const id = req.params.id
    const token = req.params.token
    console.log(token, "token")
    console.log(id, "id")     
    try{
      res
      .redirect(`https://eflextesting.netlify.app/restLink/${id}/${token}`)
    }catch(err){next(err)}
  }


exports.forgotPassword = async (req, res, next) => {
    try{
        const userEmail = await User.findOne({email: req.body.email})
        // console.log(userEmail)gi
      if (!userEmail) return next(createError(404, 'No user with that email'))
      const token = jwt.sign({ id: userEmail._id }, process.env.JWT, {
        expiresIn: "10m",
      });
      const resetURL = `${req.protocol}://${req.get(
            'host',
          )}/api/restLink/${userEmail._id}/${token}`

          const message = `Forgot your password? Submit patch request with your new password to: ${resetURL}.
           \nIf you didnt make this request, simply ignore. Password expires in 10 minutes`

          const mailOptions ={
            from: process.env.USER,
            to: userEmail.email,
            subject: 'Your password reset token is valid for 10 mins',
            text: message,
        }
        transporter.sendMail(mailOptions,(err, info)=>{
            if(err){
                console.log(err.message);
            }else{
                console.log("Email has been sent to your inbox", info.response);
            }
        })
          res.status(200).json({
            status: 'success',
            message: 'Link sent to email!',
          })
    }catch(err){next(err)}
}
