const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const leadInWorshipSchema = new mongoose.Schema({
    devotion: {
        type: String,
        required: true //untuk melakukan validasi
      },
    evenDirector: {
        type: String,
        required: true 
      },
     date: {
        type: String,
        required: true 
      },
})

module.exports = mongoose.model('LeadInWorship', leadInWorshipSchema)