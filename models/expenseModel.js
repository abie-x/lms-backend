import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema(
   {
      category: {
         type: String,
         enum: [
            'Salary',
            'Rent',
            'PrintingandStationary',
            'Refreshment',
            'Electricity',
            'Repairs',
            'Equipments',
            'Miscallaneous',
            'ExamFees',
            'RegistrationFees',
         ],
         required: true,
      },
      amount: {
         type: Number,
         required: true,
      },
      description: {
         type: String,
      },
      date: {
         type: Date,
         required: true,
      },
   },
   {
      timestamps: true,
   }
);

const Expense = mongoose.model('Expense', expenseSchema);

export default Expense;
