/**
 * 高度自适应
 */

 const ScreenHeight = {}
 ScreenHeight.install = function(Vue, options) {
   Vue.prototype.styleHeightView = function() {
     let screenHeight = document.getElementsByClassName('app-main')[0].clientHeight - document.getElementsByClassName('app-container')[0].clientHeight - 25
        console.log(screenHeight)
     if (document.getElementsByClassName('form_content').length > 0) {
       document.getElementsByClassName('form_content')[0].style.height = screenHeight + 'px'
       // return document.getElementsByClassName('form_content')[0].style.height
       return screenHeight - 80 + 'px'
     }
     if (document.getElementsByClassName('form_content_pagination').length > 0) {
       document.getElementsByClassName('form_content_pagination')[0].style.height = screenHeight + 'px'
       return screenHeight - 120 + 'px'
     }
     if (document.getElementsByClassName('form_content_pagination_T').length > 0) {
       document.getElementsByClassName('form_content_pagination_T')[0].style.height = screenHeight + 'px'
       return screenHeight - 100 + 'px'
     }
   }
 }
 export default ScreenHeight
 