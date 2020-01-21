class HelpData {
    pageUrl = '';
    elementId = '';
    msg = '';
    step = 0;
    position = 'right' | 'left';
}

class Util {
    static data = [];
    static deleteItem(d) {
        let o = Util.toObj(d);
        let found = Util.getItem(o.pageUrl, o.elementId, false, false);
        console.log('delete found', found);
        if (!found) {
            let index = Util.data.indexOf(found);
            Util.data.splice(index, 1);
        }
        else {
            console.log('not found', found);
        }
        console.log('data', Util.data);
    }
    static addItem(d) {
        debugger;
        let o = Util.toObj(d);
        let found = Util.getItem(o.pageUrl, o.elementId, true, true);
        if (!found) {
            console.log('adding', o);
            Util.data.push(o);
        }
        else {
            //console.log('already exists', found);
            found = { ...found, ...o };
            Util.updateItem(found);
        }
        console.log('data', Util.data);
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
        console.log('result', result);

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
        console.log('data', Util.data);
        let rtn = undefined;
        let found = false;
        Util.data.forEach((d, index, arr) => {
            if (d.pageUrl === pageUrl && d.elementId === elementId) {
                console.log('found at', index);
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
        rtn.step = step;
        position = (!position ? 'right' : position);
        rtn.position = position;
        let maxStep = 0;
        let foundCurrentStep = 0;
        Util.data.forEach((d, index, arr) => {
            if (d.pageUrl === pageUrl
                && rtn.elementId != d.elementId
                && maxStep < d.step) {
                maxStep = d.step;
            }
            if (d.pageUrl === pageUrl
                && rtn.elementId === d.elementId) {
                foundCurrentStep = d.step;
            }
        });
        if (maxStep > 0 && maxStep >= rtn.step) {
            rtn.step = maxStep + 1;
        }
        if (foundCurrentStep > 0) {
            rtn.step = foundCurrentStep;
        }
        return rtn;
    }

    static toObj(d) {
        let o = new HelpData();
        o = { ...d };
        return o;
    }

    static updateServer(apiUpdateUrl, obj, callbackSuccess, callbackFailure) {
        console.log('updateserver', apiUpdateUrl, obj);
        jQuery.ajax({
            type: "POST",
            url: apiUpdateUrl,
            data: obj,
            timeout: 60 * 1000,
            dataType: 'json',
            success: function (data) {
                console.log('success updateserver', data);
                callbackSuccess(data);
            },
            error: function (xhr, status, error) {
                console.log('error', status, xhr, error);
                callbackFailure(error);
            }
        });
    }
}