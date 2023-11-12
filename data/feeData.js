const testFeeData = [
    {
        inTakeYear: 2023,
        inTakeBatch: 'April',
        examFees: 5000,
        registrationFees: 1500,
        totalAmount: 6500,
        installments: [
          {
            installmentNumber: 1,
            dueDate: '2023-04-15',
            amount: 3000,
          },
          {
            installmentNumber: 2,
            dueDate: '2023-05-15',
            amount: 3500,
          },
        ],
      }      
]

export {
    testFeeData
}