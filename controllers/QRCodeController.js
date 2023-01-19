const Attendance = require('../models/Attendance');

module.exports = {
    generateQRCode: async (req, res, next) =>{
        try {
            const { regBy, QRCodeOnTime, QRCodeLate, description, schoolYear, semester, absenDate} = req.body
            let today = new Date();

            // let date_created = today.toISOString().slice(0, 10)
            // let time_created = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            let date_created = ("0" + today.getDate()).slice(-2) + "-" + ("0"+(today.getMonth()+1)).slice(-2) + "-" + today.getFullYear();
            let time_created = ("0" + today.getHours()).slice(-2) + ":" + ("0" + today.getMinutes()).slice(-2) + ":" + ("0" + today.getSeconds()).slice(-2) ;
           
            const postAttendance = new Attendance({
                regBy, date_created, time_created, QRCodeOnTime, QRCodeLate, description, status: true, schoolYear, semester,
                absenDate: absenDate != null? absenDate: date_created
            })
            postAttendance.save() // menyimpan data ke database
            .then(
                result =>{
                    res.status(201).json({
                        message: "Generate QR Code Sucess",
                        })
                }
            )
            .catch( err =>{
                console.log('error:', err)
            })
          } catch (error){
                console.log("error:",error);
          }
    },
    updateStatusQRCode: async (req, res, next) =>{
        try {
            const { attendanceId } = req.params
            const { regBy, description, status} = req.body

            await Attendance.findOne({_id: attendanceId})
            .then((update)=>{
                update.status = status
                update.regBy = regBy
                update.description = description
                return update.save()
            })
            .then(result =>{
                res.status(201).json({
                    message: 'Update status QR code Sucess',
                })
            })
            .catch((e)=>{
                res.status(200).json({
                    message: e,
                })
            })
            
          } catch (error){
                console.log("error:",error);
          }
    },
    updateQRCode: async (req, res, next) =>{
        try {
            const { attendanceId } = req.params
            const { regBy, description, absenDate} = req.body

            await Attendance.findOne({_id: attendanceId})
            .then((update)=>{
                update.absenDate = absenDate
                update.regBy = regBy
                update.description = description
                return update.save()
            })
            .then(result =>{
                res.status(201).json({
                    message: 'Update status QR code Sucess',
                })
            })
            .catch((e)=>{
                res.status(200).json({
                    message: e,
                })
            })
            
          } catch (error){
                console.log("error:",error);
          }
    },
   deleteQRCode: async (req, res, next) =>{
        try {
            const { attendanceId } = req.params
           
            await Attendance.remove({_id:attendanceId})
            .then(
                result =>{
                    res.status(201).json({
                        message: "Delete QR Code Sucess",
                        })
                }
            )
            .catch( err =>{
                console.log('error:', err)
            })
            
          } catch (error){
                console.log("error:",error);
          }
    },

    getQRCode: async (req, res, next)=>{
        try {
            let date = new Date().toISOString().slice(0, 10)
            const getQRCode = await Attendance.findOne({date: date})
            console.log("getQRCode:",getQRCode);
      
            res.status(201).json({
                message: "Sucessfuly get QR Code",
                data: {
                    QRCodeOnTime: getQRCode.QRCodeOnTime,
                    QRCodeLate: getQRCode.QRCodeLate,
                }
                })
        } catch (error) {
            console.log("error:",error);
        }
    },

    getQRCodes: async (req, res, next)=>{
        try {
            const getQRCodes = await Attendance.find({status:true})

            res.status(201).json({
                message: "Sucessfuly get QR Code",
                data: getQRCodes
            })
        } catch (error) {
            console.log("error:",error);
        }
    },
    getLatestQRCodes: async (req, res, next)=>{
        try {
            const getQRCodes = await Attendance.find({status:true}).sort({'_id': -1})

            res.status(201).json({
                message: "Sucessfuly get QR Code",
                data: getQRCodes
            })
        } catch (error) {
            console.log("error:",error);
        }
    }
}