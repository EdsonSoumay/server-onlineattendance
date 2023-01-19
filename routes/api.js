const router = require('express').Router();
const UserController = require('../controllers/UserController');
const QRCodeController = require('../controllers/QRCodeController');
const AttendanceController = require('../controllers/AttendanceController');


const {uploadSingle, uploadMultiple} = require('../middleware/multer')


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
        router.put('/qrcode/:attendanceId', QRCodeController.updateQRCode ) // alternative deletes
        router.get('/qrcode/', QRCodeController.getQRCode )
        router.get('/qrcodes/', QRCodeController.getQRCodes )
        router.get('/latestqrcodes/', QRCodeController.getLatestQRCodes ) // get 5 latest qr codes

// USER ATTENDANCE
        router.post('/postusersattendance/:userId', AttendanceController.postUserAttendance) // kirim absen dari user
    
        router.post('/edituserattendance/:userId', AttendanceController.editUserAttendance) // update absen dari user
        
        //nanti bikin res api untuk memberi absen bagi user yang datang terlambat atau absen

        router.get('/getusersallsattendance/', AttendanceController.getUsersAllAttendance) // get semua user punya semua attendance/absen
        router.get('/getuserallsattendance/:userId', AttendanceController.getUserAllAttendance) // get semua user punya semua attendance/absen tapi di filter. (berdasarkan bulan, semester, tahun)
    
        router.get('/getusersfilterattendance/:schoolYear/:semester/', AttendanceController.getUsersFilterAttendance) // get satu user punya semua attendance/absen
        router.get('/getuserfilterattendance/:userId/:schoolYear/:semester/', AttendanceController.getUserFilterAttendance) // get satu user punya semua attendance/absen

        

module.exports = router;