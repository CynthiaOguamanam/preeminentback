const Contact = require("../models/Contacts")
const transporter = require("../utilities/email")

exports.CreateContact = async (req, res, next) => { 
    try{
        const data = req.body
        const NewContactMsg = await Contact.create(data)
        const sender =  NewContactMsg.email
        console.log(sender)

        const mailOptions = {
          /*   let sender = NewContactMsg.email, */
            from: sender,
            to: process.env.USER, 
            subject: "Support Form",
          html: `
           <p>
                ${NewContactMsg.msg}
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
        
        res.status(201).json({
            message: "New Contact Msg.",
            data: NewContactMsg
        })

    }catch(err){
        next(err)
    }

}