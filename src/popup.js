$(document).ready(function () {
    let body = $('body');
    // console.log('DomOutline', DomOutline);
    var myExampleClickHandler = function (element) { console.log('Clicked element:', element); }
    //var myDomOutline = DomOutline({ onClick: myExampleClickHandler, filter: 'div' });
    var myDomOutline = DomOutline({ onClick: myExampleClickHandler, body: body, namespace: 'global' });
    // console.log('$(#btnStart)', $('#btnStart'));

    // Start outline:
    $('#btnStart').click(function (e) { console.log('start'); e.preventDefault(); myDomOutline.start() });
    // Stop outline (also stopped on escape/backspace/delete keys):
    $('#btnEnd').click(function (e) { console.log('end'); e.preventDefault(); myDomOutline.stop() });

    let c = jQuery('<div>NEW HELLO</div>').appendTo(body);
        console.log('c',c);

    // THIS SHOULD WORK FOR YOUR MAIN PAGE
    $('body').mousemove(function (e) {
        var id = e.target.id;
        console.log('main id:', id, (e.target ? 'object' : 'no'));
    });
    // THIS SHOULD WORK FOR YOUR IFRAME
    $("#iFrame").contents().find('body').mousemove(function (e) {
        var details = e.target.id;
        console.log('iframe', details);
    });
});