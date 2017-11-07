function Content (tab, div) {
  this.tab = tab
  this.div = div
}

Content.prototype.contentSlide = function () {
  $('.navbar li a').removeClass('active')
  this.tab.addClass('active')
  $('.content').css('opacity', '0')
  setTimeout(function () {
    $('.content').css('display', 'none')
    this.div.css('display', 'block')
    setTimeout(function () {
      this.div.css('opacity', '1')
    }.bind(this), 10)
  }.bind(this), 550)
}
Content.prototype.listener = function () {
  this.tab.on('click', function () {
    this.contentSlide()
  }.bind(this))
}

const tabs = {
  home: new Content($('#h'), $('.main')),
  about: new Content($('#a'), $('.about')),
  projects: new Content($('#p'), $('.projects')),
  resume: new Content($('.r'), $('.resume'))
}

for (item in tabs) {
  tabs[item].listener()
}

window.onload = function () {
  setTimeout(function () {
    for (let i = 0; i < $('#title-name span').length; i++) {
      setTimeout(function () { $('#title-name span')[i].style.opacity = 1 }, (i * 100))
    }
  }, 500)
  let url = window.location.href.split('#')[1]
  if (!url) {
    url = 'home'
  }
  tabs[url].contentSlide()
}
