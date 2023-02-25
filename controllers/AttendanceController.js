const Attendance = require('../models/Attendance');
const UserAttendance = require('../models/userAttendance');
const Member = require('../models/User');
const userAttendance = require('../models/userAttendance');


module.exports = {
    postUserAttendance: async (req, res, next) =>{
        console.log("post user attendance:",req.body)
        try {
            // const { QRCode, attendanceId, schoolYear } = req.body
            const { QRCode} = req.body
            const { userId } = req.params
            
            let today = new Date();
            // let date_scan = today.toISOString().slice(0, 10)
            // let time_scan = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            let date_scan = ("0" + today.getDate()).slice(-2) + "-" + ("0"+(today.getMonth()+1)).slice(-2) + "-" + today.getFullYear();
            let time_scan = ("0" + today.getHours()).slice(-2) + ":" + ("0" + today.getMinutes()).slice(-2) + ":" + ("0" + today.getSeconds()).slice(-2) ;
           
            //validasi value dari qrCode
            // const getAttendanceOnTime = await Attendance.findOne({QRCodeOnTime: QRCode, _id:attendanceId})
            // const getAttendanceLate = await Attendance.findOne({QRCodeLate: QRCode, _id:attendanceId})
         
            const getAttendanceOnTime = await Attendance.findOne({QRCodeOnTime: QRCode})
            const getAttendanceLate = await Attendance.findOne({QRCodeLate: QRCode})
         
            console.log("on time:",getAttendanceOnTime)
            console.log("on Late:",getAttendanceLate)
            //check jika user sudah mengisi absen atau belum
            // const userAttendance = await UserAttendance.findOne({attendanceId:attendanceId, userId:userId })

            const userAttendance = await UserAttendance.findOne({
                attendanceId:getAttendanceOnTime? getAttendanceOnTime._id : getAttendanceLate._id, 
                userId:userId
             })
           
            if(userAttendance){
               return res.status(409).json({
                    message: "this user has filled the absension",
                    })  
            }

                await UserAttendance.create({
                    date_scan, time_scan, userId: userId, 
                    presence: getAttendanceOnTime? getAttendanceOnTime.QRCodeOnTime: getAttendanceLate.QRCodeLate, 
                    attendanceId:getAttendanceOnTime? getAttendanceOnTime.id : getAttendanceLate.id, 
                    // schoolYear: schoolYear
                })

                return res.status(201).json({
                    message: "Sucessfuly Post User Attendance",
                    })
          } catch (error){
                console.log("error:",error);
          }
    },

    editUserAttendance: async (req, res, next) =>{
        try {
            const { presence, attendanceId, schoolYear, reg_by } = req.body
            const { userId } = req.params
            
            console.log("edit:",req.body)

            let today = new Date();
            // let date_scan = ("0" + today.getDate()).slice(-2) + "-" + ("0"+(today.getMonth()+1)).slice(-2) + "-" + today.getFullYear();
            let time_scan = ("0" + today.getHours()).slice(-2) + ":" + ("0" + today.getMinutes()).slice(-2) + ":" + ("0" + today.getSeconds()).slice(-2) ;
           
            //validasi value dari qrCode
            const getAttendance = await Attendance.findOne({_id:attendanceId})

            const userAttendance = await UserAttendance.findOne({attendanceId:getAttendance._id, userId:userId })

            //jika belum isi
            if(!userAttendance){
                await UserAttendance.create({
                   userId: userId, presence: presence, 
                   attendanceId:getAttendance.id, 
                //    schoolYear: schoolYear,
                   date_scan: null,
                   time_scan: null
                })
                return res.status(201).json({
                    message: "Sucessfuly Edit User Attendance (create baru)",
                })
            }

            //jika salah isi
            if(userAttendance){
                console.log("dia masuk disini")
               await UserAttendance.updateOne({userId:userId, attendanceId:getAttendance.id}, {  reg_by : reg_by ,presence : presence,  update_time : today });
               res.status(201).json({
                        message: 'Sucessfuly Edit User Attendance',
                    })
            }
          
          } catch (error){
                console.log("error:",error);
          }
    },

    getUsersAllAttendance: async (req, res, next)=>{
        try {

            const { schoolYear, semester } = req.query;
            let arrayGetAttendance = []
            let schoolYears = []
                
            let getSchoolYears = await Attendance.find({status: true})
            
                //check tahun ajaran
                for(let i = 0; i < getSchoolYears.length; i++){
                    if(!schoolYears.includes(getSchoolYears[i].schoolYear)){
                      schoolYears.push(getSchoolYears[i].schoolYear)
                    }
                }

            const defaultSchoolYear = '2021-2022'
            const defaultSemester = '1'

            // cari semua absen
            let  getAttendance = await Attendance.find({
                status: true, 
                schoolYear:schoolYear?schoolYear:defaultSchoolYear, 
                semester: semester?semester:defaultSemester
            }).sort({absenDate: 1})

            // // cari semua absen
            // let getAttendance; 
            // if(schoolYear, semester){
            //   getAttendance = await Attendance.find({status: true, schoolYear:schoolYear, semester: semester})
            //   .sort({absenDate: 1})
            // }
            // else{
            //   getAttendance = await Attendance.find({status: true, schoolYear: defaultSchoolYear, semester: defaultSemester})
            //  .sort({absenDate: 1})
            // }

            // cari absen user
            for(let i = 0; i < getAttendance.length; i++){

                let newGetAttendance = getAttendance[i]

                const getUserAttendance = await UserAttendance.find({attendanceId: getAttendance[i]._id})
                                         .populate({path: 'userId', select: 'lastName firstName userName'})
            
                let arrayUserGetAttendance = []
                for(let i = 0; i < getUserAttendance.length; i++){
                    arrayUserGetAttendance.push(getUserAttendance[i])
                }
  
                newGetAttendance.userAttendance = arrayUserGetAttendance;

                //set up date
                let day = getAttendance[i].absenDate.toLocaleDateString('en-US', {weekday: 'long'});
                let dateNumber = getAttendance[i].absenDate.toLocaleDateString('en-US', {day: '2-digit'});
                let month = getAttendance[i].absenDate.toLocaleDateString('en-US', {month: '2-digit'});
                let year = getAttendance[i].absenDate.toLocaleDateString('en-US', {year: 'numeric'});
                let formattedDate = day + ', ' + dateNumber + ' - ' + month + ' - ' + year;
                //end set up date

                //set up time
                let utc_hours = getAttendance[i].absenDate.getUTCHours();
                utc_hours += 8;
                getAttendance[i].absenDate.setUTCHours(utc_hours);
                let dateString = getAttendance[i].absenDate.toISOString();
                let timeString = dateString.slice(11, 23) + dateString.slice(26, 29);
                //end set up time


                newGetAttendance.absenDateString = formattedDate;
             
                newGetAttendance.absenTimeString = timeString;
                
                arrayGetAttendance.push(newGetAttendance)
            }


            // cocokan dengan nama member
            const getMember = await Member.find({isActive: true})

            let newArrayobject2 = []
            
            for(let i = 0; i < getMember.length; i++){
                let arrayObject = []
                
                for(let j = 0; j < arrayGetAttendance.length; j ++){

                //    const filterArray = arrayGetAttendance[j].userAttendance.filter(e =>e.userId.userName == getMember[i].userName);
                   const filterArray = arrayGetAttendance[j].userAttendance.filter(e =>e.userId?.userName == getMember[i].userName);

                   if(filterArray){

                    if(filterArray.length!= 0){
                        arrayObject.push({
                            userId:getMember[i]._id,
                            userName:getMember[i].userName,
                            firstName:getMember[i].firstName,
                            lastName:getMember[i].lastName,
                            presence:filterArray[0].presence,
                            date: arrayGetAttendance[j].date_created
                        })
                    }
                    
                    if(filterArray.length == 0){
                        arrayObject.push({
                            userId:getMember[i]._id,
                            userName:getMember[i].userName,
                            firstName:getMember[i].firstName,
                            lastName:getMember[i].lastName,
                            presence:'absen',
                            date: arrayGetAttendance[j].date_created
                        })
                    }
                   }
                    
                }
                newArrayobject2.push(arrayObject)
            }
            
            console.log("new array obj 2:",newArrayobject2);
            // console.log("aray get attendance:",arrayGetAttendance[0].absenDate.day);
               
              res.status(201).json({
                  message: "Sucessfuly get User Attendance",
                  data:{
                   date: arrayGetAttendance, 
                  member: newArrayobject2,
                  schoolYear: schoolYear? schoolYear : defaultSchoolYear,
                  semester: semester? semester : defaultSemester,
                  filterSchoolYear: schoolYears
                  }
                })
  
          } catch (error) {
              console.log("error:",error);
          }
    },

    getUserFilterAttendance: async (req, res, next)=>{
        try {
            const { userId, semester, schoolYear } = req.query;

            let onTime = 0;
            let late = 0;
            let notPresent = 0;
            let excuse = 0;

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
                
                //kondisi for filter
                if(arrayUserGetAttendance.length  != 0){
                //    if(arrayUserGetAttendance[0].presence == 'late'){
                   if(arrayUserGetAttendance[0].presence.includes('late')){
                        late = 1 + late
                   }
                   else if(arrayUserGetAttendance[0].presence.includes('ontime')){
                        onTime = 1 + onTime
                   }
                   else if(arrayUserGetAttendance[0].presence.includes('excuse')){
                        excuse = 1 + excuse
                   }
                }
                else if(arrayUserGetAttendance.length  == 0){
                    notPresent = 1 + notPresent
                }

                // set up date and time
                  //set up date
                  let day = getAttendance[i].absenDate.toLocaleDateString('en-US', {weekday: 'long'});
                  let dateNumber = getAttendance[i].absenDate.toLocaleDateString('en-US', {day: '2-digit'});
                  let month = getAttendance[i].absenDate.toLocaleDateString('en-US', {month: '2-digit'});
                  let year = getAttendance[i].absenDate.toLocaleDateString('en-US', {year: 'numeric'});
                  let formattedDate = day + ', ' + dateNumber + ' - ' + month + ' - ' + year;
                  //end set up date
  
                  //set up time
                  let utc_hours = getAttendance[i].absenDate.getUTCHours();
                  utc_hours += 8;
                  getAttendance[i].absenDate.setUTCHours(utc_hours);
                  let dateString = getAttendance[i].absenDate.toISOString();
                  let timeString = dateString.slice(11, 23) + dateString.slice(26, 29);
                  //end set up time
  
  
                  newGetAttendance.absenDateString = formattedDate;
               
                  newGetAttendance.absenTimeString = timeString;
                // set up date and time


                 newGetAttendance.userAttendance = arrayUserGetAttendance;

                arrayGetAttendance.push(newGetAttendance)
            }

            res.status(201).json({
            message: "Sucessfuly get User Attendance",
            data: {
                    history: arrayGetAttendance,
                    onTime : onTime,
                    late: late,
                    notPresent :notPresent,
                    excuse: excuse
                }
            })
  
          } catch (error) {
              console.log("error:",error);
          }
    }
}