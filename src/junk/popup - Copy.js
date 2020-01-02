console.log('popup start');

// document.documentElement.style.height = '100%';
// document.body.style.height = '100%';
// document.documentElement.style.width = '100%';
// document.body.style.width = '100%';

//  var div = document.createElement( 'div' );
//  var btnForm = document.createElement( 'form' );
//  var btn = document.createElement( 'input' );

// //append all elements
// document.body.appendChild( div );
// div.appendChild( btnForm );
// btnForm.appendChild( btn );
// //set attributes for div
// div.id = 'myDivId';
// div.style.position = 'fixed';
// div.style.top = '50%';
// div.style.left = '50%';
// div.style.width = '100%';   
// div.style.height = '100%';
// div.style.backgroundColor = 'red';

//set attributes for btnForm
// btnForm.action = '';

//set attributes for btn
//"btn.removeAttribute( 'style' );
// btn.type = 'button';
// btn.value = 'hello';
// btn.style.position = 'absolute';
// btn.style.top = '50%';
// btn.style.left = '50%';

console.log('popup end');

//  $('body').css('background-color', 'blue'); // just for testing
//  $('body').append("<div>hello world</div>");

let overlay=document.createElement("div"); 
overlay.id = 'mouseover_overlay';
document.body.appendChild(overlay); 
//overlay.innerText="";
console.log('popup init', overlay);

document.addEventListener('mouseover', e => {
  console.log('mouseover over on', e);
  
  let elem = e.target;
  let rect = elem.getBoundingClientRect();
  overlay.style.top = rect.top +'px';
  overlay.style.left = rect.left +'px';
  overlay.style.width = rect.width +'px';
  overlay.style.height = rect.height +'px';
});