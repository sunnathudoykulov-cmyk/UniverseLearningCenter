export const advantages = [
  { number: '01', titleKey: 'advantages.programs.title', textKey: 'advantages.programs.text', size: 'wide', requiresApproval: true },
  { number: '02', titleKey: 'advantages.groups.title', textKey: 'advantages.groups.text', size: 'tall', requiresApproval: true },
  { number: '03', titleKey: 'advantages.feedback.title', textKey: 'advantages.feedback.text', size: 'standard', requiresApproval: true },
  { number: '04', titleKey: 'advantages.practice.title', textKey: 'advantages.practice.text', size: 'standard', requiresApproval: true },
  { number: '05', titleKey: 'advantages.directions.title', textKey: 'advantages.directions.text', size: 'wide', requiresApproval: false },
]

export const teachers = [1, 2, 3].map((id) => ({ id, photo: '', requiresApproval: true }))
export const testimonials = [1, 2].map((id) => ({ id, requiresApproval: true }))

export const steps = [
  'steps.choose', 'steps.consult', 'steps.level', 'steps.start', 'steps.progress',
]

export const faqItems = [
  'age', 'level', 'consult', 'languages', 'schedule', 'exams', 'child', 'location',
]
