export const download = (csvData: string[], filename: string) => {
  const csvBlob = new Blob(csvData, {type: 'text/csv'})
  const csvUrl = URL.createObjectURL(csvBlob)
  const link = document.createElement('a')
  link.href = csvUrl
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}