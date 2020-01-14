const ANIMATE_DELAY = 400

// Initialize Reveal.js
Reveal.initialize({
  width: '1920',
  height: '1080',
  controls: false,
  progress: true,
  history: true,
  overview: true,
  loop: true,
  autoPlayMedia: true,
  navigationMode: 'linear',
  transition: 'linear',
  dependencies: [
    { src: 'js/plugin/markdown/marked.js' },
    { src: 'js/plugin/markdown/markdown.js' },
    { src: 'js/plugin/notes/notes.js', async: true },
    { src: 'js/plugin/zoom-js/zoom.js', async: true },
    { src: 'js/plugin/highlight/highlight.js', async: true },
    { src: 'js/extend/external.plugin.js', condition: function () { return !!document.querySelector('[data-external]') } }

  ],
  keyboard: {
    // enable auto slide with space
    32: function () {
      Reveal.toggleAutoSlide(true)
    }
  }
})

// constants
const totalSlides = Reveal.getTotalSlides()

// printing functions for revealjs
var link = document.createElement('link')
link.rel = 'stylesheet'
link.type = 'text/css'
link.href = window.location.search.match(/print-pdf/gi) ? 'css/print/pdf.css' : 'css/print/paper.css'
document.getElementsByTagName('head')[0].appendChild(link)

// initialize events
Reveal.addEventListener('ready', () => {
  checktimeline()
  headerVisibility()
})

// event on every slide change
Reveal.addEventListener('slidechanged', (event) => {
  animateContent(event)
  checktimeline()
  headerVisibility()
})

// Binds event to the next buttons on each slide
$('.nextButton a').on('click', e => {
  const goto = parseInt($(e.target).attr('actual-slide')) + 1
  Reveal.slide(goto, 0)
  e.preventDefault()
  return false
})

// Hide Header on the first and last slide
function headerVisibility () {
  const slide = Reveal.getIndices().h
  if (slide === 0 || slide === totalSlides) {
    $('#header').hide()
  } else {
    $('#header').show()
  }
}

// Get all slidenames by section
const slideNames = $('section').map((i, obj) => {
  return $(obj).attr('slide-name-data')
}).get()

// Create Direct Navigation to Slides
for (let i = 0; i < totalSlides; i++) {
  $('#timeline ul').append(`<li><a href="#" slide-name-data="${slideNames[i]}" go-to-data="${i}"></a></li>`)
}

// Navigate to Slide with Navigation Menu Click
$('#timeline ul li a').on('click', e => {
  Reveal.slide(parseInt($(e.target).attr('go-to-data')))
  e.preventDefault()
  return false
})

// Write Slidenumber over navigation
$('#timeline ul li a').on('mouseover', e => {
  $('#pointTT > p.name').text($(e.target).attr('slide-name-data') === 'undefined' ? `Slide No: ${$(e.target).attr('go-to-data')}` : $(e.target).attr('slide-name-data'))
  $('#pointTT').show()
  $('#pointTT').css({
    left: ($(e.target).offset().left + 5 - $('#pointTT').width() / 2) + 'px',
    top: ($(e.target).offset().top - 34) + 'px'
  })
  e.preventDefault()
  return false
})

$('#timeline ul li a').on('mouseout', e => {
  $('#pointTT').hide()
  e.preventDefault()
  return false
})

// Animate and position the content when loading a new slide
function animateContent (event) {
  // $(event.currentSlide).find('.content').css('top', document.body.clientHeight / 2 - ($(event.currentSlide).find('.content').height() / 2))
  if ((event.indexh) > 0) {
    $(event.currentSlide).find('.animate-content').delay(ANIMATE_DELAY).animate({ opacity: 1 }, 1000)
    $(event.currentSlide).find('.nextButton').delay(ANIMATE_DELAY).animate({ opacity: 1 }, 1000)
  } else {
    $(event.currentSlide).find('.nextButton').delay(ANIMATE_DELAY).animate({ opacity: 1 }, 1000)
  }
  $(event.previousSlide).find('.animate-content').delay(ANIMATE_DELAY * 2).animate({ opacity: 0 }, 100)
  $(event.previousSlide).find('.nextButton').delay(ANIMATE_DELAY * 2).animate({ opacity: 0 }, 100)
}

function checktimeline () {
  const slide = Reveal.getIndices().h
  if (window.selectedSlide !== slide || !window.selectedSlide) {
    window.selectedSlide = slide
    $('#timeline ul li a').removeClass('selected')
    $('#timeline ul li span').removeClass('selected')
    $(`#timeline ul li a[go-to-data="${slide}"]`).addClass('selected')
    $(`#timeline ul li span:contains("${window.selectedSlide}")`).addClass('selected')
  }
}
