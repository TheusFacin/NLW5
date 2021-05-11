const convertDurationToTimeString = (duration: number): string => {
  const hours = Math.floor(duration / 3600) // (60 * 60)
  const minutes = Math.floor((duration % 3600) / 60)
  const seconds = duration % 60

  const timeString = [hours, minutes, seconds]
    // obrigando os três a ter dois dígitos
    .map(unit => String(unit).padStart(2, '0'))
    .join(':')

  return timeString
}

export default convertDurationToTimeString
