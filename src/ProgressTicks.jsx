function ProgressTicks({ percentage }) {
  const filledCount = Math.round(percentage / 10)
  const ticks = []
  for (let i = 0; i < 10; i++) {
    ticks.push(i < filledCount)
  }

  return (
    <div className="progress-ticks">
      {ticks.map((filled, i) => (
        <span key={i} className={filled ? 'tick tick--filled' : 'tick'}>✓</span>
      ))}
      <span className="progress-ticks__label">{percentage}%</span>
    </div>
  )
}

export default ProgressTicks