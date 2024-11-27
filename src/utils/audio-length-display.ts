export const audioLengthDisplay = (audioLength?: number, format?: 'short' | 'long'): string => {
  if(!audioLength) return ''

  const hours = Math.floor(audioLength / 60)
  const minutes = audioLength % 60
  if(format && format === 'long') return `${hours} hours and ${minutes} minutes`
  return `${hours}h ${minutes}m`
}