const CurrentSemester = require('../models/CurrentSemester');
const mongoose = require('mongoose');

module.exports = {
    updateCurrentSemester: async (req, res) =>{
       try {
        const { _id } = req.params
        const{ semester, reg_by, schoolYear} = req.body
        console.log(req.body)

        await CurrentSemester.updateOne(
                {_id: mongoose.Types.ObjectId(_id)}, 
                { semester, reg_by, schoolYear}
            )
        
        const findCurrentSemester = await CurrentSemester.findOne()
        
        res.status(201).json({
            message: "Succesfully update current semester",
            data: findCurrentSemester
            })

       } catch (error) {
            res.status(501).json({
                    message: "server error",
                    })
       }
    },
    getCurrentSemester: async(req, res) =>{
        try {
            const findCurrentSemester = await CurrentSemester.findOne()
            res.status(201).json({
                message: "Succesfully get current semester",
                data: findCurrentSemester
                })
        } catch (error) {
            res.status(501).json({
                message: "server error",
                })
        }
    }

}