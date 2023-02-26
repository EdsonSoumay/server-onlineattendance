const router = require('express').Router();
const UserController = require('../controllers/UserController');
const QRCodeController = require('../controllers/QRCodeController');
const AttendanceController = require('../controllers/AttendanceController');
const CurrentSemester = require('../controllers/CurrentSemester');

//CURRENT SEMESTER
        router.put('/currentsemester/:_id', CurrentSemester.updateCurrentSemester )
        router.get('/currentsemester/:_id', CurrentSemester.getCurrentSemester )

////USER & AUTH 
        router.post('/registration', UserController.registration )
        router.post('/login', UserController.login)
        router.put('/forgotpassword', UserController.forgotPassword)
        router.post('/sendemail', UserController.sendEmail) // send email to get token for forget password
        router.get('/users', UserController.users)
        router.put('/user/:userId/update', UserController.updateUser)

// TOKEN QR CODE
        router.post('/qrcode/', QRCodeController.generateQRCode )
        router.delete('/qrcode/:attendanceId', QRCodeController.deleteQRCode )
        router.put('/qrcode/status/:attendanceId', QRCodeController.updateStatusQRCode ) // alternative deletes
        router.put('/qrcode/:attendanceId', QRCodeController.updateQRCode )
        router.get('/qrcode/', QRCodeController.getQRCode )
        router.get('/qrcodes/', QRCodeController.getQRCodes )
        router.get('/latestqrcodes/', QRCodeController.getLatestQRCodes ) // get 5 latest qr codes

// USER ATTENDANCE
        router.post('/postusersattendance/:userId', AttendanceController.postUserAttendance) // kirim absen dari user
        router.put('/edituserattendance/:userId', AttendanceController.editUserAttendance) // update absen dari officer
        router.get('/getusersallsattendance/', AttendanceController.getUsersAllAttendance) // get semua user punya semua attendance/absen di semester tertentu. ini yg pake di mobile. pake query
        router.get('/getuserfilterattendance/', AttendanceController.getUserFilterAttendance) // get satu user punya semua attendance/absen. ini yang pake di mobile

module.exports = router;