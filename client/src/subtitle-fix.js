/**
 * Based on https://stackoverflow.com/a/71689039
 *
 * Chrome needs a workround to display multiple subtitles
 * This loads CSS from index.html at runtime to achieve this
 *
 * I tried converting this to Vue code, but after hours of trying I didn't get it to work,
 * because I couldn't load the CSS from index.html at runtime.
*/
function fixSubs(maxCueLines = 2) {
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
