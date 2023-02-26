const Attendance = require('../models/Attendance');

module.exports = {
    generateQRCode: async (req, res) =>{
        try {
            const { regBy, QRCodeOnTime, QRCodeLate, description, schoolYear, semester, absenDate} = req.body

            await Attendance.create({
                regBy, QRCodeOnTime, QRCodeLate, description, status: true, schoolYear, semester,
                date_created:  new Date(), 
                absenDate: absenDate
            })

            res.status(201).json({
            message: "Generate QR Code Sucess",
            })
          } catch (error){
                console.log("error:",error);
          }
    },
    updateStatusQRCode: async (req, res) =>{
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
                    message: 'Delete QR code Sucess',
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
    updateQRCode: async (req, res) =>{
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
                    message: 'Update QR code Sucess',
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
   deleteQRCode: async (req, res) =>{
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

    getQRCode: async (req, res)=>{
        try {
            let date = new Date().toISOString().slice(0, 10)
            const getQRCode = await Attendance.findOne({date: date})
            // console.log("getQRCode:",getQRCode);
      
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

    getQRCodes: async (req, res)=>{
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
    getLatestQRCodes: async (req, res)=>{
        try {
            const { schoolYear, semester} = req.query
            const getQRCodes = await Attendance.find({status:true, schoolYear, semester}).sort({'_id': -1})

            res.status(201).json({
                message: "Sucessfuly get QR Code",
                data: getQRCodes
            })
        } catch (error) {
            console.log("error:",error);
        }
    }
}