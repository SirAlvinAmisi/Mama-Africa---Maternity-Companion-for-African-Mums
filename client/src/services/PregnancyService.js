// src/services/PregnancyService.js
export const PregnancyService = {
    calculateMilestones: (eddDate) => {
      const edd = new Date(eddDate);
      // Calculate conception date (approximately 40 weeks before EDD)
      const conceptionDate = new Date(edd);
      conceptionDate.setDate(conceptionDate.getDate() - 280);
      
      // Calculate trimester dates
      const firstTrimesterEnd = new Date(conceptionDate);
      firstTrimesterEnd.setDate(firstTrimesterEnd.getDate() + 84); // 12 weeks
      
      const secondTrimesterEnd = new Date(conceptionDate);
      secondTrimesterEnd.setDate(secondTrimesterEnd.getDate() + 182); // 26 weeks
      
      // Generate recommended checkups
      const checkups = generateRecommendedAppointments(conceptionDate);
      
      return {
        conceptionDate,
        firstTrimester: { start: conceptionDate, end: firstTrimesterEnd },
        secondTrimester: { start: firstTrimesterEnd, end: secondTrimesterEnd },
        thirdTrimester: { start: secondTrimesterEnd, end: edd },
        recommendedAppointments: checkups
      };
    }
  };
  
  // Generate standard pregnancy checkup schedule
  function generateRecommendedAppointments(conceptionDate) {
    const appointments = [];
    const conception = new Date(conceptionDate);
    
    // First trimester (weeks 8, 12)
    const week8 = new Date(conception);
    week8.setDate(week8.getDate() + 56); // 8 weeks after conception
    appointments.push({
      title: 'First Prenatal Visit',
      date: week8,
      type: 'checkup',
      notes: 'Medical history, blood tests, physical exam'
    });
    
    const week12 = new Date(conception);
    week12.setDate(week12.getDate() + 84); // 12 weeks
    appointments.push({
      title: 'NT Ultrasound',
      date: week12,
      type: 'scan',
      notes: 'Nuchal translucency ultrasound'
    });
    
    // Second trimester (weeks 16, 20, 24, 28)
    const week20 = new Date(conception);
    week20.setDate(week20.getDate() + 140); // 20 weeks
    appointments.push({
      title: 'Anatomy Scan',
      date: week20,
      type: 'scan',
      notes: 'Detailed ultrasound to check baby\'s development'
    });
    
    const week28 = new Date(conception);
    week28.setDate(week28.getDate() + 196); // 28 weeks
    appointments.push({
      title: 'Glucose Test',
      date: week28,
      type: 'checkup',
      notes: 'Gestational diabetes screening'
    });
    
    // Third trimester (weeks 32, 36, 38, 40)
    const week36 = new Date(conception);
    week36.setDate(week36.getDate() + 252); // 36 weeks
    appointments.push({
      title: 'Group B Strep Test',
      date: week36,
      type: 'checkup',
      notes: 'Group B streptococcus screening'
    });
    
    const week40 = new Date(conception);
    week40.setDate(week40.getDate() + 280); // 40 weeks (EDD)
    appointments.push({
      title: 'Due Date Checkup',
      date: week40,
      type: 'checkup',
      notes: 'Final checkup near due date'
    });
    
    return appointments;
  }