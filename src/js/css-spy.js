// Convert RBG to Hex
function rgbToHex(a) {
    a = a.replace(/[^\d,]/g, "").split(",");
    return "#" + ((1 << 24) + (+a[0] << 16) + (+a[1] << 8) + +a[2]).toString(16).slice(1);
}

function camelToDash(s) {
    return s.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

function dashToCamel(s) {
    return s.replace(/[-_]([a-z])/g, function (g) {
        return g[1].toUpperCase();
    });
}

function getCSS(css, comparedCSS, settings, element, showCompared) {
    if (showCompared) {
        css1 = comparedCSS;
        css2 = css;
    } else {
        css1 = css;
        css2 = comparedCSS;
    }

    var style = [];
    $.each(css1, function (prop, value) {
        if (settings[dashToCamel(prop)]) {
            if (value === css2[prop]) {
                additionalClass = "css-spy-same";
            } else {
                additionalClass = "";
            }

            var html = "<div class='css-spy-value " + additionalClass + "'>" +
                "<span class='css-spy-prop'>" + prop +
                "</span>: " + value + ";</div>";

            if (/(.*?)?color/.test(prop)) {
                if (value === "rgba(0, 0, 0, 0)") {
                    return;
                }
                html = "<div class='css-spy-value " + additionalClass + "'>" +
                    "<span class='css-spy-prop'>" + prop +
                    "</span>: " + rgbToHex(value) + "; " +
                    "<span class='css-spy-color' style='background-color: " + value + "'>" +
                    "</span></div>";
            }

            if (/border(.*?)?/.test(prop)) {
                if (css1["border-width"] === "0px") {
                    return;
                }
            }

            if (prop === "border" && css1.border === "") {
                return;
            }

            style.push(html);
        }
    });
    newStyle = style.join("\r\n");
    var selector = jQuery(element).getSelector();
    var finalCSS = "<div class='css-spy-result'>" +
        "<div class='css-spy-meta'>" +
        "<span class='css-spy-selector'>" + selector[0] + "</span>" +
        "<span class='css-spy-closure'> {</span></div>" + newStyle +
        "<div class='css-spy-meta'><span class='css-spy-closure'>}</span>" +
        "</div>" +
        "</div>";
    return finalCSS;
}

// Function to call when click on element
var onClickProcess = function (element, settings, comparedCSS) {
    var cssProps = [];
    // Get all available css properties
    $.each(settings, function (prop, value) {
        cssProps.push(camelToDash(prop));
    });
    var css = $(element).css(cssProps);

    var tabs = "<div class='css-spy-tabs'>" +
        "<div class='css-spy-tab active' data-target='css-spy-intro'>Configure Instant Help</div>" +
        // "<div class='css-spy-tab' data-target='css-spy-element'>Element</div>" +
        // "<div class='css-spy-tab' data-target='css-spy-compare'>Compare</div>" +
        // "<div class='css-spy-tab' data-target='css-spy-settings'>Settings</div>" +
        "</div>";

    var compareHTML = "<div class='css-spy-compared-reset'><span>Reset compared element</span></div>" +
        "<div class='css-spy-compare-inner'>" +
        "<div class='css-spy-compare-element'>" + getCSS(css, comparedCSS, settings, element, true) + "</div>" +
        "<div class='css-spy-compare-element'>" + getCSS(css, comparedCSS, settings, element, false) + "</div>" +
        "</div>";

    if (Object.keys(comparedCSS).length === 0) {
        compareHTML = "<div class='css-spy-compare-inner css-spy-compare-empty'>Nothing to compare here.</div>";
    }

    // Process css value to show on setting tab
    var switchButton = function (prop, checked) {
        return "<div class=\"css-spy-onoffswitch\">" +
            "<input data-prop=\"" + prop + "\" type=\"checkbox\" name=\"onoffswitch\" class=\"css-spy-onoffswitch-checkbox\" id=\"myonoffswitch-" + prop + "\" " + (checked ? "checked" : "") + ">" +
            "<label class=\"css-spy-onoffswitch-label\" for=\"myonoffswitch-" + prop + "\">" +
            "<span class=\"css-spy-onoffswitch-inner\"></span>" +
            "<span class=\"css-spy-onoffswitch-switch\"></span>" +
            "</label>" +
            "</div>";
    };

    // var settingHTMLArray = [];
    // $.each(settings, function (prop, value) {
    //     var html = "<div><label for=\"myonoffswitch-" + prop + "\">" + camelToDash(prop) + "</label>" +
    //         "<div class=\"css-spy-switch-button\">" + switchButton(prop, value) + "</div></div>";
    //     settingHTMLArray.push(html);
    // });

    // var settingHTML = "<div class='css-spy-settings-content'>" +
    //     "<div class='css-spy-settings-label'>Choose CSS Properties to inspect:</div>" +
    //     "<div class='css-spy-settings-lists'>" + settingHTMLArray.join("\r\n") + "</div>" +
    //     "</div>";

    
    // console.log('settings', settings);

    //     var inputHTML = "<div id='myModal' class='modal'>"+
    //     "<div class='modal-content' style='display=block'>"+
    //       "<span class='close'>&times;</span>"+
    //       "<p>Some text in the Modal..</p>"+
    //       "</div>"+
    //   "</div>";


    var introHTMLArray = [];
    debugger;
    var pageUrl = Util.getRelativeUrl();
    var obj = Util.getItem(pageUrl, element.id, true, false);
    console.log('obj', obj);

    // var introInputProperties = [];
    // introInputProperties.push('msg', obj.msg);
    // introInputProperties.push('step', obj.step);
    // introInputProperties.push('position', obj.position);
    // console.log('introInputProperties', introInputProperties);
    var htmlMsg = "<form id=\"frmIntro\" action=\"api/help/update\"><div>"
        // if (!obj.msg) {
        //     obj.msg = "this is text"
        // }
        //    + "<input type=\"button\" value=\"Add to favorites\"><label for=\"myonoffswitch-msg\">Msg</label>"
        + "<label>Page Url</label><input placeholder=\"Element Id\" class=\"myText\" type=\"hidden\" id=\"txtIntroPageUrl\" name=\"txtIntroPageUrl\" value=\"" + obj.pageUrl + "\" >"
        + "<label>Element Id</label><input placeholder=\"Element Id\" required readonly class=\"myText\" type=\"text\" id=\"txtIntroElementId\" name=\"txtIntroElementId\" value=\"" + obj.elementId + "\" >"
        + "<label>Help Message</label><input placeholder=\"Enter Message\" required tabindex=\"1\" class=\"myText\" type=\"text\" id=\"txtIntroMsg\" name=\"txtIntroMsg\" value=\"" + obj.msg + "\" >"
        + "<label>Step Number</label><input placeholder=\"Enter Step Number\" required tabindex=\"2\" class=\"myText\" type=\"text\" id=\"txtIntroStep\" name=\"txtIntroStep\" value=\"" + obj.stepNumber + "\">"
        + "<label>Display Position</label><input placeholder=\"Enter Position (right or left)\" tabindex=\"3\" class=\"myText\" type=\"text\" id=\"txtIntroPosition\" name=\"txtIntroPosition\" value=\"" + obj.position + "\">"
        + "</div></form>";
    introHTMLArray.push(htmlMsg);
    // $.each(obj, function (prop, value) {
    //     var html = "<div><label for=\"myonoffswitch-" + prop + "\">" + camelToDash(prop) + "</label>" +
    //         "<div class=\"css-spy-switch-button\">" + switchButton(prop, value) + "</div></div>";
    //         introHTMLArray.push(html);
    // });

    var introHTML = "<div class='css-spy-settings-content'>" +
        // "<div class='css-spy-settings-label'>Properties:</div>" +
        "<div class='css-spy-settings-lists'>" + introHTMLArray.join("\r\n") + "</div>" +
        "</div>";
    var finalHTML = tabs + "<div class='css-spy-content'>" +
        "<div class='css-spy-intro'>" + introHTML + "</div>" +
        //"<div class='css-spy-element' style='display:none'>" + getCSS(css, comparedCSS, settings, element, false) + "</div>" +
        //"<div class='css-spy-compare' style='display:none'>" + compareHTML + "</div>" +
        //"<div class='css-spy-settings' style='display:none'>" + settingHTML + "</div>" +
        "</div>";

    // console.log('element', element);
    // console.log('window.top', window.top);
    // console.log('window.parent', window.parent);
    // console.log('window.frameElement', window.frameElement);

    setTimeout(function () { $("#txtIntroMsg").focus(); }, 500);

    swal({
        title: "Adding Help to <strong>" + pageUrl + "</strong>",
        showCancelButton: true,
        cancelButtonText: "Close",
        text: finalHTML,
        type: "success",
        confirmButtonText: "Update",
        html: true,
        closeOnConfirm: false
    }, function () {
        chrome.storage.sync.set({ comparedCSS: css }, function () {
            let form = $("#frmIntro");
            let obj = Util.getFormData(form);
            if (!obj.pageUrl || !obj.elementId) {
                swal("Please select element", "Element is not selected, please check", "failed");
            }
            else {
                let btnSubmit = jQuery(".confirm");
                btnSubmit.attr("disabled", true);
                let btnClose = jQuery(".cancel");
                btnClose.attr("disabled", true);
                Util.addItem(obj);
                let apiUpdateUrl = form.attr('action');
                apiUpdateUrl = Util.getApiUrl(apiUpdateUrl);
                Util.updateServer(apiUpdateUrl, obj
                    , function (data) {
                        btnSubmit.attr("disabled", false);
                        btnClose.attr("disabled", false);
                        swal("Good job!", "Successfully added help in system", "success");
                    }, function (data) {
                        btnSubmit.attr("disabled", false);
                        btnClose.attr("disabled", false);
                        swal("Error", "Error has occured while saving data on server please try again " + data, "error");
                    });
            }
        });
    });
};

var onClick = function (element) {
    chrome.storage.sync.get(['cssValue', 'comparedCSS'], function (data) {
        var cssValue = data.cssValue;
        var comparedCSS = data.comparedCSS;
        onClickProcess(element, cssValue, comparedCSS);
    });
};

var myDomOutline = DomOutline({
    onClick: onClick,
    filter: 'div',
    realtime: true,
    label: true,
    border: false
});

// Listen to background
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    var value = request.value;
    switch (request.type) {
        case "stateChange":
            if (value) {
                myDomOutline.start();
            } else {
                myDomOutline.stop();
            }
            break;
    }
});

// Handle compared reset
jQuery(document).on("click", ".css-spy-compared-reset", function () {
    chrome.storage.sync.set({ comparedCSS: {} }, function () {
        jQuery(".css-spy-compare").html("<div class='css-spy-compare-inner css-spy-compare-empty'>Nothing to compare here.</div>");
    });
});

// Handle the switch button

jQuery(document).on("click", ".css-spy-onoffswitch-checkbox", function () {
    var prop = jQuery(this).data("prop");
    var value = $(this).is(':checked');
    chrome.storage.sync.get('cssValue', function (data) {
        var cssValue = data.cssValue;
        cssValue[prop] = value;
        // Save the setting
        chrome.storage.sync.set({ cssValue: cssValue });
    });
});


// Handle the tabs change
jQuery(document).on("click", ".css-spy-tab", function () {
    var target = jQuery(this).data("target");
    // Hide all tab content
    jQuery(".css-spy-content > div").hide();
    // Show just selected tab content
    jQuery("." + target).show();
    // Set tab as active
    jQuery(".css-spy-tab").removeClass("active");
    jQuery(this).addClass("active");
});


//GB:070120 to hide sweet-overlay for iframe content
$(function () {
    if (window.self != window.top) {
        $(document.body).addClass("in-iframe");
    }
    Util.loadServerData(null);
});