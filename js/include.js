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
      xhttp.open('GET', file, true)
      xhttp.send()
      /* Exit the function: */
      return
    }
  }
}

includeHTML()
// for (let i = 0; i < 5; i++) {
//   setTimeout(includeHTML(), 100)
// }
