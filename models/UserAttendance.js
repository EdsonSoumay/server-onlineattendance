const { ObjectId } = require('mongoose');
const mongoose = require('mongoose');

const userAttendanceSchema = new mongoose.Schema({
    date_scan:{
        // type: String,
        type: Date,
        // required: true //untuk melakukan validasi
    },
    time_scan:{
        type: String,
        // required: true //untuk melakukan validasi
    },
    userId:{
        type: ObjectId, // untuk menangkap relasi dari model item
        ref: 'User'
    },
    attendanceId:{
        type: ObjectId, // untuk menangkap relasi dari model item
        ref: 'Attendance'
    },
    presence:{
        type: String,
        require: true
    },
    reg_by:{
        type: String,
    },
    update_time:{
        type: Date,
        // require: true
    },


})

module.exports = mongoose.model('UserAttendance', userAttendanceSchema)


