const Attendance = require('../models/Attendance');
const UserAttendance = require('../models/userAttendance');
const Member = require('../models/User')

module.exports = {
    postUserAttendance: async (req, res, next) =>{
        try {
            const { QRCode, attendanceId, schoolYear } = req.body
            const { userId } = req.params
            
            let today = new Date();
            // let date_scan = today.toISOString().slice(0, 10)
            // let time_scan = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            let date_scan = ("0" + today.getDate()).slice(-2) + "-" + ("0"+(today.getMonth()+1)).slice(-2) + "-" + today.getFullYear();
            let time_scan = ("0" + today.getHours()).slice(-2) + ":" + ("0" + today.getMinutes()).slice(-2) + ":" + ("0" + today.getSeconds()).slice(-2) ;
           
            //validasi value dari qrCode
            const getAttendanceOnTime = await Attendance.findOne({QRCodeOnTime: QRCode, _id:attendanceId})
            const getAttendanceLate = await Attendance.findOne({QRCodeLate: QRCode, _id:attendanceId})

            console.log("getAttendanceOnTime:",getAttendanceOnTime);
            console.log("getAttendanceLate:",getAttendanceLate);
            //check jika user sudah mengisi absen atau belum
            const userAttendance = await UserAttendance.findOne({attendanceId:attendanceId, userId:userId })
            if(userAttendance){
               return res.status(201).json({
                    message: "this user has filled the absension",
                    })  
            }

            //jika ontime
            if(getAttendanceOnTime){
                await UserAttendance.create({
                    date_scan, time_scan, userId: userId, presence: getAttendanceOnTime.QRCodeOnTime, attendanceId:getAttendanceOnTime.id, schoolYear: schoolYear
                })
                return res.status(201).json({
                    message: "Sucessfuly Post User Attendance",
                    })
            }

            //jika late
            if(getAttendanceLate){
                await UserAttendance.create({
                    date_scan, time_scan, userId: userId, presence: getAttendanceLate.QRCodeLate, attendanceId:getAttendanceLate.id, schoolYear: schoolYear
                })

                return res.status(201).json({
                    message: "Sucessfuly Post User Attendance",
                    })
            }


          } catch (error){
                console.log("error:",error);
          }
    },

    editUserAttendance: async (req, res, next) =>{
        try {
            const { presence, attendanceId, schoolYear, regBy } = req.body
            const { userId } = req.params
            
            let today = new Date();
            let date_scan = ("0" + today.getDate()).slice(-2) + "-" + ("0"+(today.getMonth()+1)).slice(-2) + "-" + today.getFullYear();
            let time_scan = ("0" + today.getHours()).slice(-2) + ":" + ("0" + today.getMinutes()).slice(-2) + ":" + ("0" + today.getSeconds()).slice(-2) ;
           
            //validasi value dari qrCode
            const getAttendance = await Attendance.findOne({_id:attendanceId})

            const userAttendance = await UserAttendance.findOne({attendanceId:getAttendance._id, userId:userId })

            //jika belum isi
            if(!userAttendance){
                await UserAttendance.create({
                    date_scan, time_scan, userId: userId, presence: presence, attendanceId:getAttendance.id, schoolYear: schoolYear
                })
                return res.status(201).json({
                    message: "Sucessfuly Edit User Attendance",
                })
            }

            //jika salah isi
            if(userAttendance){
                await UserAttendance.findOne({userId:userId})
                .then((update)=>{
                    update.regBy = regBy
                    update.presence = presence
                    update.date_scan = date_scan
                    update.time_scan = time_scan
                    return update.save()
                })
                .then(result =>{
                    res.status(201).json({
                        message: 'Sucessfuly Edit User Attendance"',
                    })
                })
                .catch((e)=>{
                    res.status(200).json({
                        message: e,
                    })
                })
            }
          
          } catch (error){
                console.log("error:",error);
          }
    },

    // getUsersAllAttendance: async (req, res, next)=>{
    //     try {
    //         let arrayGetAttendance = []
    //         //code  untuk mendapatkan all attendance/absen dari users
    //         const getAttendance = await Attendance.find({status:true})
    //         for(let i = 0; i < getAttendance.length; i++){
    //             let newGetAttendance = getAttendance[i]
    //                 const getUserAttendance = await UserAttendance.find({
    //                     attendanceId: getAttendance[i]._id,
    //                 })
    //                 .populate({path: 'userId', select: 'lastName firstName userName'})

    //                 let arrayUserGetAttendance = []
    //                 for(let i = 0; i < getUserAttendance.length; i++){
    //                     arrayUserGetAttendance.push(getUserAttendance[i])
    //                 }
    //             newGetAttendance.userAttendance = arrayUserGetAttendance;
    //             arrayGetAttendance.push(newGetAttendance)
    //         }
           

    //           res.status(201).json({
    //               message: "Sucessfuly get User Attendance",
    //               data: arrayGetAttendance
    //               })
  
    //       } catch (error) {
    //           console.log("error:",error);
    //       }
    // },


    getUsersAllAttendance: async (req, res, next)=>{
        try {
            // console.log("Testing");
            let arrayGetAttendance = []
            let schoolYears = []
            // cari semua absen
            const getAttendance = await Attendance.find({status: true})

            // cari absen user
            for(let i = 0; i < getAttendance.length; i++){

                //check tahun ajaran
                if(!schoolYears.includes(getAttendance[i].schoolYear)){
                  schoolYears.push(getAttendance[i].schoolYear)
                }

                let newGetAttendance = getAttendance[i]
                    const getUserAttendance = await UserAttendance.find({
                                    attendanceId: getAttendance[i]._id,
                                })
                                .populate({path: 'userId', select: 'lastName firstName userName'})
            
                                let arrayUserGetAttendance = []
                                for(let i = 0; i < getUserAttendance.length; i++){
                                    arrayUserGetAttendance.push(getUserAttendance[i])
                                }
                            newGetAttendance.userAttendance = arrayUserGetAttendance;
                            arrayGetAttendance.push(newGetAttendance)
            }


            // cocokan dengan nama member
            const getMember = await Member.find({isActive: true})

            let newArrayobject2 = []
            
            for(let i = 0; i < getMember.length; i++){
                let arrayObject = []
                
                for(let j = 0; j < arrayGetAttendance.length; j ++){


                   const filterArray = arrayGetAttendance[j].userAttendance.filter(e =>e.userId.userName == getMember[i].userName);
            
                   if(filterArray){

                    if(filterArray.length!= 0){
                        arrayObject.push({
                            userId:getMember[i]._id,
                            userName:getMember[i].userName,
                            presence:filterArray[0].presence,
                            date: arrayGetAttendance[j].date_created
                        })
                    }
                    
                    if(filterArray.length== 0){
                        arrayObject.push({
                            userId:getMember[i]._id,
                            userName:getMember[i].userName,
                            presence:'absen',
                            date: arrayGetAttendance[j].date_created
                        })
                    }
                   }
                    
                }
                newArrayobject2.push(arrayObject)
            }
            
            console.log("School years:",schoolYears);
               
              res.status(201).json({
                  message: "Sucessfuly get User Attendance",
                  getAttendance: newArrayobject2
                })
  
          } catch (error) {
              console.log("error:",error);
          }
    },

    
    getUserAllAttendance: async (req, res, next)=>{
        try {

            const { userId } = req.params;
            
            let arrayGetAttendance = []
            //code  untuk mendapatkan all attendance/absen dari seorang user
            const getAttendance = await Attendance.find({status:true})
            for(let i = 0; i < getAttendance.length; i++){
                let newGetAttendance = getAttendance[i]
                    const getUserAttendance = await UserAttendance.find({
                        attendanceId: getAttendance[i]._id,
                    })
                    .populate({path: 'userId', select: 'lastName firstName'})
                    let arrayUserGetAttendance = []
                    for(let i = 0; i < getUserAttendance.length; i++){
                        if(getUserAttendance[i].userId._id.toString() == new Object(userId)){
                            arrayUserGetAttendance.push(getUserAttendance[i])
                        }
                    }
                newGetAttendance.userAttendance = arrayUserGetAttendance;
                arrayGetAttendance.push(newGetAttendance)
            }

              res.status(201).json({
                  message: "Sucessfuly get User Attendance",
                  data: arrayGetAttendance
                  })
  
          } catch (error) {
              console.log("error:",error);
          }
    },
    getUsersFilterAttendance: async (req, res, next)=>{
        try {
            const { semester,schoolYear } = req.params;

            let arrayGetAttendance = []
            const getAttendance = await Attendance.find({
                status:true,
                semester: semester,
                schoolYear: schoolYear
            })
            //di looping agar bisa mendapatkan absen
            for(let i = 0; i < getAttendance.length; i++){
                let newGetAttendance = getAttendance[i]
                const getUserAttendance = await UserAttendance.find({
                    attendanceId: getAttendance[i]._id,
                })
                .populate({path: 'userId', select: 'lastName firstName'})
                let arrayUserGetAttendance = []
                for(let i = 0; i < getUserAttendance.length; i++){
                    arrayUserGetAttendance.push(getUserAttendance[i])
                }
                newGetAttendance.userAttendance = arrayUserGetAttendance;
                arrayGetAttendance.push(newGetAttendance)
            }

            res.status(201).json({
            message: "Sucessfuly get User Attendance",
            data: arrayGetAttendance
            })
  
          } catch (error) {
              console.log("error:",error);
          }
    },
    getUserFilterAttendance: async (req, res, next)=>{
        try {
            const { userId, semester, schoolYear } = req.params;

            let arrayGetAttendance = []
            const getAttendance = await Attendance.find({
                status:true,
                semester: semester,
                schoolYear: schoolYear
            })
            //di looping agar bisa mendapatkan absen
            for(let i = 0; i < getAttendance.length; i++){
                let newGetAttendance = getAttendance[i]
                const getUserAttendance = await UserAttendance.find({
                    attendanceId: getAttendance[i]._id,
                    userId: userId
                })
                .populate({path: 'userId', select: 'lastName firstName'})
                let arrayUserGetAttendance = []
                for(let i = 0; i < getUserAttendance.length; i++){
                    arrayUserGetAttendance.push(getUserAttendance[i])
                }
                newGetAttendance.userAttendance = arrayUserGetAttendance;
                arrayGetAttendance.push(newGetAttendance)
            }

            res.status(201).json({
            message: "Sucessfuly get User Attendance",
            data: arrayGetAttendance
            })
  
          } catch (error) {
              console.log("error:",error);
          }
    }
}