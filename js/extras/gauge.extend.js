var collection = document.getElementsByTagName('canvas')
Reveal.addEventListener('slidechanged', event => {
  for (var i = 0, s = collection.length; i < s; i++) {
    if (
      $(collection[i])
        .closest('section')
        .hasClass('present')
    ) {
      BaseGauge.fromElement(collection[i])
    }
  }
})