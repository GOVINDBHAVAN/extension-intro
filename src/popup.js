let overlay = document.querySelector('#mouseover_overlay');
document.addEventListener('mouseover', e => {
  
  let elem = e.target;
  let rect = elem.getBoundingClientRect();
  overlay.style.top = rect.top +'px';
  overlay.style.left = rect.left +'px';
  overlay.style.width = rect.width +'px';
  overlay.style.height = rect.height +'px';
});