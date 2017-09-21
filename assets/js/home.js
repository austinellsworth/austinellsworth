function Content (tab, div) {
  this.tab = tab
  this.div = div
}

Content.prototype.contentSlide = function () {
  $('.navbar li a').removeClass('active')
  this.tab.addClass('active')
  $('.content').css('display', 'none')
  this.div.css('display', 'block')
}

const tabs = {
  home: new Content($('#h'), $('.main')),
  about: new Content($('#a'), $('.about')),
  projects: new Content($('#p'), $('.projects')),
  resume: new Content($('.r'), $('.resume'))
}

tabs.home.tab.on('click', function () {
  tabs.home.contentSlide()
})
tabs.about.tab.on('click', function () {
  tabs.about.contentSlide()
})
tabs.projects.tab.on('click', function () {
  tabs.projects.contentSlide()
})
tabs.resume.tab.on('click', function () {
  tabs.resume.contentSlide()
})

window.onload = function () {
  let url = window.location.href.split('#')[1]
  tabs[url].contentSlide()
}
