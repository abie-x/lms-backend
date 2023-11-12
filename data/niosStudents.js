const testNiosStudents = [
  {
    course: 'SSLC',
    intake: 'April',
    batch: 'Science',
    referenceNumber: 'REF12345',
    enrollmentNumber: 'ENROLL123',
    status: 'Fail',
    onDemandExamMonth: 'May',
    subjects: ['Mathematics', 'Science', 'English', 'History', 'Geography'],
    toc: ['Physics', 'Chemistry'],
    name: 'John Doe',
    place: 'Sample Place',
    dob: new Date('2000-01-01'),
    phoneNumber: '1234567890',
    parentNumber: '9876543210',
    email: 'johndoe@example.com',
    password: 'password123',
    results: 'A+ in all subjects',
    feeDetails: {
      totalAmount: 10000,
      paidAmount: 5000,
      registrationFees: 1000,
      registrationPaymentDate: new Date('2023-02-15'),
      examFees: 4000,
      examPaymentDate: new Date('2023-02-20'),
      installments: [
        {
          installmentNumber: 1,
          dueDate: new Date('2023-03-01'),
          amount: 1000,
          isPaid: true,
        },
        {
          installmentNumber: 2,
          dueDate: new Date('2023-04-01'),
          amount: 2000,
          isPaid: false,
        },
        {
          installmentNumber: 3,
          dueDate: new Date('2023-05-01'),
          amount: 3000,
          isPaid: false,
        },
      ],
    },
    examCentre: 'Trissur',
    admissionCoordinator: 'CoordinatorName',
  }
]

export { testNiosStudents};
