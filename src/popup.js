// console.log('DomOutline', DomOutline);
var myExampleClickHandler = function (element) { console.log('Clicked element:', element); }
//var myDomOutline = DomOutline({ onClick: myExampleClickHandler, filter: 'div' });
var myDomOutline = DomOutline({ onClick: myExampleClickHandler });
console.log('$(#btnStart)', $('#btnStart'));

$(document).ready(function () {
  // Start outline:
  $('#btnStart').click(function (e) { console.log('start'); e.preventDefault(); myDomOutline.start() });
  // Stop outline (also stopped on escape/backspace/delete keys):
  $('#btnEnd').click(function (e) { console.log('end'); e.preventDefault(); myDomOutline.stop() });
});