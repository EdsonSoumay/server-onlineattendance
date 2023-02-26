const { ObjectId } = require('mongoose');
const mongoose = require('mongoose');

const attendaceSchema = new mongoose.Schema({
    time_created:{
        type: String,
        // required: true //untuk melakukan validasi
    },
    date_created:{
        type: Date,
        // type: string,
        // required: true
    },
    schoolYear:{
        type: String,
        required: true 
    },
    regBy: {
        type: String,
        // required: true 
    },
    QRCodeOnTime:{
        type: String,
        required: true 
    },
    QRCodeLate:{
        type: String,
        required: true 
    },
    description:{
        type: String,
        // required: true 
    },
    status:{
        type: Boolean,
        required: true 
    },
    userAttendance: {
        type: Array,
        // required: true 
    },
    schoolYear:{
        type: String,
        required: true,
    },
    semester:{
        type: String,
        required: true,
    },
    absenDate:{
        type: Date
    },
    absenDateString:{
        type: String
    },
    absenTimeString:{
        type: String
    },
})

module.exports = mongoose.model('Attendance', attendaceSchema)


