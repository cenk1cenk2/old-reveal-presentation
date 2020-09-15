function includeHTML () {
  var z
  var i
  var elmnt
  var file
  var xhttp
  /* Loop through a collection of all HTML elements: */
  z = document.getElementsByTagName('*')
  for (i = 0; i < z.length; i++) {
    elmnt = z[i]
    /* search for elements with a certain atrribute:*/
    file = elmnt.getAttribute('include-html')
    if (file) {
      console.log(`Trying to get included file: ${file}`)
      /* Make an HTTP request using the attribute value as the file name: */
      xhttp = new XMLHttpRequest()
      xhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
          if (this.status === 200) {
            elmnt.innerHTML = this.responseText

            // add scripts to head
            var scriptElements = elmnt.getElementsByTagName('SCRIPT')
            for (i = 0; i < scriptElements.length; i++) {
              var scriptElement = document.createElement('SCRIPT')
              scriptElement.type = 'text/javascript'
              if (!scriptElements[i].src) {
                scriptElement.innerHTML = scriptElements[i].innerHTML
              } else {
                scriptElement.src = scriptElements[i].src
              }
              document.head.appendChild(scriptElement)
              console.log(`File included: ${file}`)
            }
          }

          if (this.status === 404) {
            elmnt.innerHTML = 'Page not found. ' + file
          }

          /* Remove the attribute, and call this function once more: */
          elmnt.removeAttribute('include-html')
          includeHTML()
        }
      }
      xhttp.open('GET', file, false)
      xhttp.send()
      /* Exit the function: */
      return
    }
  }
}

includeHTML()

console.log('Finished including files.')

// for (let i = 0; i < 5; i++) {
//   setTimeout(includeHTML(), 100)
// }

const ANIMATE_DELAY = 400

$(document).ready(() => {
  console.log('Initializing reveal.js')
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
      {
        src: 'dist/js/plugins/external-section/external-section.js',
        condition () {
          return !!document.querySelector('[data-external]')
        }
      },
      {
        src: 'dist/js/plugins/markdown/marked.js',
        condition () {
          return !!document.querySelector('[data-markdown]')
        }
      },
      {
        src: 'dist/js/plugins/markdown/markdown.js',
        condition () {
          return !!document.querySelector('[data-markdown]')
        }
      },
      { src: 'dist/js/plugins/notes/notes.js', async: true },
      { src: 'dist/js/plugins/zoom-js/zoom.js', async: true },
      { src: 'dist/js/plugins/highlight/highlight.js', async: true }
    ],
    keyboard: {
      // enable auto slide with space
      32 () {
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
    slideName(event)
  })

  // Binds event to the next buttons on each slide
  $('.nextButton a').on('click', (e) => {
    const goto = parseInt($(e.target).attr('actual-slide'), 10) + 1
    Reveal.slide(goto, 0)
    e.preventDefault()
    return false
  })

  // Hide Header on the first and last slide
  function headerVisibility () {
    const slide = Reveal.getIndices().h
    if (slide === 0 || slide === totalSlides - 1) {
      $('#header').hide()
    } else {
      $('#header').show()
    }
  }

  // Get all slidenames by section
  const slideNames = $('section')
    .map((i, obj) => {
      return $(obj).attr('slide-name-data')
    })
    .get()

  // add slide name to top
  function slideName (event) {
    $('#slide-title').html(String(slideNames[event.indexh]).toUpperCase())
  }

  // Create Direct Navigation to Slides
  for (let i = 0; i < totalSlides; i++) {
    $('#timeline ul').append(`<li><a href="#" slide-name-data="${slideNames[i]}" go-to-data="${i}"></a></li>`)
  }

  // Navigate to Slide with Navigation Menu Click
  $('#timeline ul li a').on('click', (e) => {
    Reveal.slide(parseInt($(e.target).attr('go-to-data'), 10))
    e.preventDefault()
    return false
  })

  // Write Slidenumber over navigation
  $('#timeline ul li a').on('mouseover', (e) => {
    $('#pointTT > p.name').text(
      $(e.target).attr('slide-name-data') === 'undefined' ? `Slide No: ${$(e.target).attr('go-to-data')}` : String($(e.target).attr('slide-name-data')).toUpperCase()
    )
    $('#pointTT').show()
    $('#pointTT').css({
      left: $(e.target).offset().left + 5 - $('#pointTT').width() / 2 + 'px',
      top: $(e.target).offset().top - 34 + 'px'
    })
    e.preventDefault()
    return false
  })

  $('#timeline ul li a').on('mouseout', (e) => {
    $('#pointTT').hide()
    e.preventDefault()
    return false
  })

  // Animate and position the content when loading a new slide
  function animateContent (event) {
    // $(event.currentSlide).find('.content').css('top', document.body.clientHeight / 2 - ($(event.currentSlide).find('.content').height() / 2))
    if (event.indexh > 0) {
      $(event.currentSlide).find('.animate-content').delay(ANIMATE_DELAY).animate({ opacity: 1 }, 1000)
      $(event.currentSlide).find('.nextButton').delay(ANIMATE_DELAY).animate({ opacity: 1 }, 1000)
    } else {
      $(event.currentSlide).find('.nextButton').delay(ANIMATE_DELAY).animate({ opacity: 1 }, 1000)
    }
    $(event.previousSlide)
      .find('.animate-content')
      .delay(ANIMATE_DELAY * 2)
      .animate({ opacity: 0 }, 100)
    $(event.previousSlide)
      .find('.nextButton')
      .delay(ANIMATE_DELAY * 2)
      .animate({ opacity: 0 }, 100)
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
})
