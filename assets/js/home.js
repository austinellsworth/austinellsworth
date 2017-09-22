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
  let url = window.location.href.split('#')[1]
  tabs[url].contentSlide()
}
//
