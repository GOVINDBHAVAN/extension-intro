class HelpData {
    pageUrl = '';
    elementId = '';
    msg = '';
    stepNumber = 0;
    position = 'right' | 'left';
}

class Util {
    //factoHR ignore these query string
    static ignoreTags = ["_dc=", "empdata=", "empdataid=", "key=", "id=", "ignore=", "d=", "a=", "pageName="];
    static data = [];
    static log = true;
    static deleteItem(d) {
        let o = Util.toObj(d);
        let found = Util.getItem(o.pageUrl, o.elementId, false, false);
        if (Util.log) console.log('delete found', found);
        if (!found) {
            let index = Util.data.indexOf(found);
            Util.data.splice(index, 1);
        }
        else {
            if (Util.log) console.log('not found', found);
        }
        if (Util.log) console.log('data', Util.data);
    }
    static addItem(d) {
        let o = Util.toObj(d);
        let found = Util.getItem(o.pageUrl, o.elementId, true, true);
        if (!found) {
            if (Util.log) console.log('adding', o);
            Util.data.push(o);
        }
        else {
            found = { ...found, ...o };
            Util.updateItem(found);
        }
        if (Util.log) console.log('data', Util.data);
    }
    static updateItem(item) {
        Util.data.forEach((element, index) => {
            if (element.pageUrl === item.pageUrl && element.elementId === item.elementId) {
                Util.data[index] = item;
            }
        });
    }
    static getFormData(jqueryForm) {
        var formData = jqueryForm.serializeArray();
        var result = {};
        $.each(formData, function () {
            result[this.name] = this.value;
        });
        if (Util.log) console.log('result', result);

        let pageUrl = result.txtIntroPageUrl;
        let elementId = result.txtIntroElementId;
        let msg = result.txtIntroMsg;
        let step = result.txtIntroSte || 1;
        let position = result.txtIntroPosition || 'right';
        if (!pageUrl || !elementId) {
            return null;
        }
        else {
            let rtn = Util.convertToObj(null, pageUrl, elementId, msg, step, position);
            return rtn;
        }
    }
    static getItem(pageUrl, elementId, createNew, addToData) {
        if (Util.log) console.log('data', Util.data);
        let rtn = undefined;
        let found = false;
        Util.data.forEach((d, index, arr) => {
            if (d.pageUrl === pageUrl && d.elementId === elementId) {
                if (Util.log) console.log('found at', index);
                rtn = d;
                found = true;
                return d;
            }
        });
        if (createNew && !rtn) {
            rtn = Util.convertToObj(rtn, pageUrl, elementId, '', 1, 'right');
        }
        if (!found && addToData && rtn) {
            Util.data.push(rtn);
        }
        return rtn;
    }
    static convertToObj(rtn, pageUrl, elementId
        , msg, step, position) {
        if (!rtn) { rtn = new HelpData(); }
        rtn.pageUrl = pageUrl;
        rtn.elementId = elementId;
        rtn.msg = msg;
        step = (step < 0 ? 1 : step);
        rtn.stepNumber = step;
        position = (!position ? 'right' : position);
        rtn.position = position;
        let maxStep = 0;
        let foundCurrentStep = 0;
        Util.data.forEach((d, index, arr) => {
            if (d.pageUrl === pageUrl
                && rtn.elementId != d.elementId
                && maxStep < d.stepNumber) {
                maxStep = d.stepNumber;
            }
            if (d.pageUrl === pageUrl
                && rtn.elementId === d.elementId) {
                foundCurrentStep = d.stepNumber;
            }
        });
        if (maxStep > 0 && maxStep >= rtn.stepNumber) {
            rtn.stepNumber = maxStep + 1;
        }
        if (foundCurrentStep > 0) {
            rtn.stepNumber = foundCurrentStep;
        }
        return rtn;
    }

    static toObj(d) {
        let o = new HelpData();
        o = { ...d };
        return o;
    }

    static getPageUrl() {
        var pageUrl = document.URL;
        if (window.frameElement) {
            pageUrl = window.frameElement.src;
        }
        return pageUrl;
    }
    static getRelativeUrl() {
        let url = Util.getPageUrl();
        let i = url.indexOf("://");
        if (i >= 0)  {
            url = url.substr(i + 3);
        }
        i = url.indexOf('/');
        if (i >= 0) {
            url = url.substr(i + 1);
        }
        let clientCode = Util.getClientCode();
        i = url.indexOf(clientCode + '/');
        if (i >= 0) {
            url = url.substr(i + clientCode.length + 1);
        }
        if (url.startsWith('/')) {
            url = url.substr(1);
        }
        let pageUrl = url;
        //let getUrl = window.location;
        //let baseUrl = getUrl.protocol + "//" + getUrl.host; // + "/" + getUrl.pathname.split('/')[1];
        //let pageUrl = getUrl.pathname.split('/')[1];
        if (url.indexOf("_dc") >= 0) {
            debugger;
        }
        let list = pageUrl.split('?');
        let rtn = list[0];
        if (list.length > 1) {
            let qs = [];
            let qsValue = list[1].split('&');
            for (let i = 0; i < qsValue.length; i++) {
                let s = qsValue[i].toLocaleLowerCase();
                let ignore = false;
                for (let j = 0; j < Util.ignoreTags.length; j++) {
                    let t = Util.ignoreTags[j].toLocaleLowerCase();
                    let v = s.substr(0, t.length - 1);
                    if (t === v) {
                        debugger;
                        ignore = true;
                        break;
                    }
                }
                if (!ignore) {
                    qs.push(s);
                }
            }
            if (qs) {
                rtn += '?' + qs.join('&');
            }
        }
        return rtn;
    }

    static getClientCode() {
        let clientCode = Util.getCookie("Client");
        return clientCode;
    }
    static getApiUrl(formActionUrl) {
        let clientCode = Util.getClientCode();
        // http://localhost:3423/EmployeeMaster/EmployeeMaster/api/help/update
        let getUrl = window.location;
        // let pageUrl = Util.getPageUrl();
        //var pageUrl = document.URL;
        let baseUrl = getUrl.protocol + "//" + getUrl.host; // + "/" + pageUrl.pathname.split('/')[1];
        let i = formActionUrl.indexOf('api/');
        let apiUrl = formActionUrl.substring(i);
        if (!baseUrl.endsWith('/')) {
            baseUrl += '/';
        }
        let newUrl = baseUrl + clientCode + '/' + apiUrl
        return newUrl;
    }

    static getCookie = function (cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    static loadServerData(callbackSuccess) {
        let relativeUrl = this.getRelativeUrl();
        let apiUpdateUrl = this.getApiUrl('/api/help/getHelp')
            + '?pageUrl=' + relativeUrl;
        if (Util.log) console.log('apiUpdateUrl', apiUpdateUrl);
        Util.data = [];
        jQuery.ajax({
            type: "POST",
            url: apiUpdateUrl,
            timeout: 60 * 1000,
            dataType: 'json',
            success: function (data) {
                if (Util.log) console.log('success loadServerData', data);
                Util.data = data;
                if (callbackSuccess) callbackSuccess();
            },
            error: function (xhr, status, error) {
                if (Util.log) console.log('error', status, xhr, error);
            }
        });
    }
    static updateServer(apiUpdateUrl, obj, callbackSuccess, callbackFailure) {
        if (Util.log) console.log('updateserver', apiUpdateUrl, obj);
        jQuery.ajax({
            type: "POST",
            url: apiUpdateUrl,
            data: obj,
            timeout: 60 * 1000,
            dataType: 'json',
            success: function (data) {
                if (Util.log) console.log('success updateserver', data);
                if (callbackSuccess) callbackSuccess(data);
            },
            error: function (xhr, status, error) {
                if (Util.log) console.log('error', status, xhr, error);
                if (callbackFailure) callbackFailure(error);
            }
        });
    }
}