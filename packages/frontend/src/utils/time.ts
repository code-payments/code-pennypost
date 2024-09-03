
const getLocalizedTime = (val: string) => {
  return new Date(val).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
  })
}

export { getLocalizedTime }