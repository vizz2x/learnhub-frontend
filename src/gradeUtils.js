export function letterGrade(percentage) {
  if (percentage >= 70) return { grade: 'A', color: '#065f46' }
  if (percentage >= 60) return { grade: 'B', color: 'var(--green)' }
  if (percentage >= 50) return { grade: 'C', color: 'var(--gold-dark)' }
  if (percentage >= 45) return { grade: 'D', color: '#92400e' }
  if (percentage >= 40) return { grade: 'E', color: '#b45309' }
  return { grade: 'F', color: 'var(--red-pen)' }
}

export function letterGradeFromPoints(pointsEarned, pointsPossible) {
  const percentage = (pointsEarned / pointsPossible) * 100
  return letterGrade(percentage)
}