function fixSubs() {
  const video = document.querySelector('#video')
  if (window.chrome) {
    const sheet = document.querySelector('#videoStyle').sheet
    const rule = Array.prototype.find.call(
      sheet.rules,
      (r) => r.selectorText === 'video::-webkit-media-text-track-display'
    )
    const observer = new ResizeObserver((entries) => {
      console.log('updated subtitle fix')
      const height = entries[0].contentRect.height
      const controlsHeight = 72
      const maxCueLines = 2
      rule.style.setProperty(
        'top',
            `calc(${Math.floor(
              (1 - controlsHeight / height) * 100
            )}% - ${maxCueLines}em)`,
            'important'
      )
    })
    observer.observe(video)
  }
}
export default fixSubs
