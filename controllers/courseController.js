//this is the set of api controllers logic that relates to NIOS and online degree
import asyncHandler from 'express-async-handler'
import { NiosFee } from '../models/feeModel.js'

//desc => create a new NIOS fee
//route => POST /api/course/nios
//access  => Private (admin only)
const registerNios = asyncHandler(async (req, res) => {
    const {
        year,
        intake,
        batch,
        course,
        mode,
        examFees,
        examFeeDueDate,
        registrationFees,
        registrationFeeDueDate,
        admissionFees,
        admissionFeeDueDate,
        totalAmount,
        installments,
      } = req.body;

      const fee = await NiosFee.create({
        year,
        intake,
        batch,
        course,
        mode,
        examFees,
        examFeeDueDate,
        registrationFees,
        registrationFeeDueDate,
        admissionFees,
        admissionFeeDueDate,
        totalAmount,
        installments
    })

    if(fee) {
        res.status(201).send(fee)
    } else {
        res.status(404)
        throw new Error('Something went wrong..')
    }
})


//desc => update the existing NIOS record model
//route => PUT /api/course/nios
//access => Private (admin only)
const updateNios = asyncHandler(async (req, res) => {
    const {
      filters,
      updateData
    } = req.body;
  
    const filterQuery = {
        year: filters.year,
        intake: filters.intake,
        batch: filters.batch,
        course: filters.course,
    };
      
  
    // Use Mongoose to find and update NIOS records based on the filter criteria
    // const result = await NiosFee.updateMany(filterQuery, updateData);

    const result = await NiosFee.updateOne(filterQuery, { $set: updateData });
  
    if (result) {
      res.status(200).json({
        message: 'NIOS records updated successfully',
        updatedCount: result.nModified
      });
    } else {
      res.status(404);
      throw new Error('Something went wrong while updating NIOS records.');
    }
});
  

export {
    registerNios,
    updateNios
}