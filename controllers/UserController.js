const User = require('../models/User');
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');

module.exports = {
    registration: async (req, res, next) =>{
    
        try {

            //get data from req.body
            const { firstName, lastName, email, userName, password} = req.body
            
            //cari apakah email sudah terdaftar di user?
            const userEmail = User.findOne({email: email, isAccepted: true})

            if(userEmail){
                return res.status(200).json({
                    message: "Email has been register",
                    })
            }

            //cari apakah username tersebut sudah ada?
            const users =  await User.find({userName: userName, isAccepted: true})

            //jika userName dan email tidak terdaftar, baru bisa registrasi
            if(users.length == 0){
                    const registUser = new User({
                            firstName, lastName, email, userName, password, isActive: false, isAccepted: false , role: 'member'
                    })
                    
                    bcrypt.hash(req.body.password, 10, (error, hashedPassword)=> {
                        if(error) {return next(error);}
                        registUser.set('password', hashedPassword);
                        registUser.save(error=> {
                          if(error) {return next(error);}
                          return res.status(200).json(registUser);
                        })
                      });
                    // registUser.save() // menyimpan data ke database
                    //     .then(
                    //         result =>{
                    //             res.status(201).json({
                    //                 message: "Registration Success",
                    //                 })
                    //         }
                    //     )
                    //     .catch( err =>{
                    //         console.log('error:', err)
                    //     })
            }
            else{
                res.status(200).json({
                    message: "user allready exist",
                    })
            }

          } catch (error){
                console.log("error:",error);
          }
    },
    login: async (req, res, next) =>{
        console.log("req.body:",req.body);
        try {
            const { userName, password} = req.body
            const user = await User.findOne({userName});
            if(!user) {
                return res.status(200).json({message: "user not found"});
            }
            const validate = await bcrypt.compare(password, user.password);
            if (!validate) {
                return res.status(200).json({ message: 'wrong password' });
            }
            res.status(201).json({ message: 'user successfuly login' })
          } catch (error){
                console.log("error:",error);
                res.status(500).json({ message: error })
          }
    },

    forgotPassword: async (req, res, next) =>{
        try {
                const { userName, email, password} = req.body
                await User.findOne({usernName:userName, email: email})
                .then((update)=>{
                    bcrypt.hash(password, 10, (error, hashedPassword)=> {
                        if(error) {return next(error);}
                        update.set('password', hashedPassword);
                        update.save()
                    });
                    // return update.save()
                })
                .then(result =>{
                    res.status(201).json({
                        message: 'Update Password Sucess',
                    })
                })
                .catch((e)=>{
                    res.status(200).json({
                        message: 'user or email is not found or matching',
                    })
                })
            }
            catch (error){
                console.log("error:",error);
          }
    },
    
    users: async (req, res, next) =>{
        try {
            const users =  await User.find()
            res.status(201).json({
                message: "All user Successfuly find",
                data: users
            })
          } catch (error){
                console.log("error:",error);
          }
    },

    updateUser: async (req, res, next) =>{
        try {
            const { userId} = req.params;
            const { firstName, lastName, email, password} = req.body

            await User.findOne({_id: userId })
            .then((update)=>{
                update.password = password
                update.firstName = firstName
                update.lastName = lastName
                update.email = email
                return update.save()
            })
            .then(result =>{
                res.status(201).json({
                    message: 'Update user Sucess',
                })
            })
            .catch((e)=>{
                res.status(200).json({
                    message: 'user is not found',
                })
            })

          } catch (error){
                console.log("error:",error);
          }
    },

    sendEmail: async(req, res, next) =>{
                try {
                    const EMAIL = 'rumputpalsu123@gmail.com'
                    const PASSWORD = 'vjaelhdnhvqguwkn'

                const { userEmail, userName, token } = req.body;

                const findUser = await User.findOne({userName:userName, email: userEmail})
                
                if(!findUser){
                    return res.status(201).json({
                        message: "Username and email is not matching"
                    })
                }

                let config = {
                    service : 'gmail',
                    auth : {
                        user: EMAIL,
                        pass: PASSWORD
                    }
                }

                let transporter = nodemailer.createTransport(config);

                let MailGenerator = new Mailgen({
                    theme: "default",
                    product : {
                        // name: "Mailgen",
                        name: "Your token has arrived!",
                        link : 'https://mailgen.js/'
                    }
                })

                let response = {
                    body: {
                        name : `Your Token: ${token}`
                        // intro: `Your Token: ${token}`,
                        // table : {
                        //     data : [
                        //         {
                        //             item : "Nodemailer Stack Book",
                        //             description: "A Backend application",
                        //             price : "$10.99",
                        //         }
                        //     ]
                        // },
                        // outro: "Looking forward to do more business"
                    }
                }

                let mail = MailGenerator.generate(response)

                let message = {
                    from : EMAIL,
                    to : userEmail,
                    subject: "Your token has arrived",
                    html: mail
                }

                await transporter.sendMail(message).then(() => {
                    return res.status(201).json({
                        message: "you should receive an email"
                    })
                }).catch(error => {
                    return res.status(500).json({ error })
                })

                } catch (error) {
                    return res.status(500).json({ error })
                }
       },
       
}