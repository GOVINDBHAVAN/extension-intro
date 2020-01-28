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
    static getKey(pageUrl, elementId) {
        return pageUrl + '-' + elementId;
    }
    static deleteItem(d) {
        let o = Util.toObj(d);
        let found = Util.getItem(o.pageUrl, o.elementId, false, false);
        if (Util.log) console.log('delete found', found);
        if (!found) {
            let index = Util.data.indexOf(found);
            Util.data.splice(index, 1);
            Util.removeStorage(Util.getKey(found.pageUrl, found.elementId));
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
            found = o;
            Util.setStorage(Util.getKey(found.pageUrl, found.elementId), JSON.stringify(found), null);
        }
        else {
            found = { ...found, pageUrl: o.pageUrl, elementId: o.elementId, msg: o.msg, stepNumber: o.stepNumber, position: o.position };
            Util.updateItem(found);
        }
        if (Util.log) console.log('data', Util.data);
    }
    static updateItem(item) {
        Util.data.forEach((element, index) => {
            if (element.pageUrl === item.pageUrl && element.elementId === item.elementId) {
                Util.data[index] = item;
                Util.setStorage(Util.getKey(item.pageUrl, item.elementId), JSON.stringify(item), null);
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
        debugger;
        let pageUrl = result.txtIntroPageUrl;
        let elementId = result.txtIntroElementId;
        let msg = result.txtIntroMsg;
        let step = result.txtIntroStep || 1;
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
        if (Util.log) console.log('rtn before convert', rtn);
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
        let orgStep = step;
        if (step) {
            step = parseInt(step);
        }
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
        if (orgStep && parseInt(orgStep) > 0) {
            rtn.stepNumber = parseInt(orgStep);
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
        if (i >= 0) {
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
        // if (url.indexOf("_dc") >= 0) {
        //     debugger;
        // }
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
                    let v = s.substr(0, t.length);
                    if (t === v) {
                        //debugger;
                        ignore = true;
                        break;
                    }
                }
                if (!ignore) {
                    qs.push(s);
                }
            }
            if (qs && qs.length) {
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
        let relativeUrl = Util.getRelativeUrl();
        if (!relativeUrl) return;
        switch (relativeUrl.toLocaleLowerCase()) {
            case "about:blank": {
                return;
            }
        }
        let apiUpdateUrl = Util.getApiUrl('/api/help/getHelp')
        + '?pageUrl=' + relativeUrl;
        if (Util.log) console.log('apiUpdateUrl', apiUpdateUrl);
        if (!Util.data) {
            Util.data = [];
        }
        // if (apiUpdateUrl.toLocaleLowerCase() == 'employeemaster/employeemaster/index') {
        //     debugger;
        // }
        let cachedData = Util.getStorage(relativeUrl);
        if (cachedData) {
            let data = JSON.parse(cachedData);
            if (Util.log) console.log('loaded from cache', data, relativeUrl);
            Util.addItem(data);
            if (callbackSuccess) callbackSuccess();
            return;
        }
        jQuery.ajax({
            type: "POST",
            url: apiUpdateUrl,
            timeout: 60 * 1000,
            dataType: 'json',
            success: function (data) {
                // debugger;
                if (Util.log) console.log('success loadServerData', data);
                if (!data.length) {
                    let newObj = Util.toObj({ pageUrl: relativeUrl });
                    data.push(newObj);
                }
                if (data && data.length) {
                    for (let i = 0; i < data.length; i++) {
                        const d = data[i];
                        Util.addItem(d);
                    }
                }
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
                Util.addItem(data);
                if (callbackSuccess) callbackSuccess(data);
            },
            error: function (xhr, status, error) {
                if (Util.log) console.log('error', status, xhr, error);
                if (callbackFailure) callbackFailure(error);
            }
        });
    }
    static updateLocalStorageAll() {
        Util.data.forEach((element, index) => {
            let item = Util.data[index];
            Util.setStorage(Util.getKey(item.pageUrl, item.elementId), JSON.stringify(item), null);
        });
    }

    /*  removeStorage: removes a key from localStorage and its sibling expiracy key
    params:
        key <string>     : localStorage key to remove
    returns:
        <boolean> : telling if operation succeeded
 */
    static removeStorage(name) {
        try {
            localStorage.removeItem(name);
            localStorage.removeItem(name + '_expiresIn');
        } catch (e) {
            console.log('removeStorage: Error removing key [' + key + '] from localStorage: ' + JSON.stringify(e));
            return false;
        }
        return true;
    }
    /*  getStorage: retrieves a key from localStorage previously set with setStorage().
        params:
            key <string> : localStorage key
        returns:
            <string> : value of localStorage key
            null : in case of expired key or failure
     */
    static getStorage(key) {

        var now = Date.now();  //epoch time, lets deal only with integer
        // set expiration for storage
        var expiresIn = localStorage.getItem(key + '_expiresIn');
        if (expiresIn === undefined || expiresIn === null) { expiresIn = 0; }

        if (expiresIn < now) {// Expired
            Util.removeStorage(key);
            return null;
        } else {
            try {
                var value = localStorage.getItem(key);
                return value;
            } catch (e) {
                console.log('getStorage: Error reading key [' + key + '] from localStorage: ' + JSON.stringify(e));
                return null;
            }
        }
    }
    /*  setStorage: writes a key into localStorage setting a expire time
        params:
            key <string>     : localStorage key
            value <string>   : localStorage value
            expires <number> : number of seconds from now to expire the key
        returns:
            <boolean> : telling if operation succeeded
     */
    static setStorage(key, value, expires) {

        if (expires === undefined || expires === null) {
            //expires = (24 * 60 * 60);  // default: seconds for 1 day
            expires = 60;       //60 seconds
        } else {
            expires = Math.abs(expires); //make sure it's positive
        }

        var now = Date.now();  //millisecs since epoch time, lets deal only with integer
        var schedule = now + expires * 1000;
        try {
            localStorage.setItem(key, value);
            localStorage.setItem(key + '_expiresIn', schedule);
        } catch (e) {
            console.log('setStorage: Error setting key [' + key + '] in localStorage: ' + JSON.stringify(e));
            return false;
        }
        return true;
    }
}