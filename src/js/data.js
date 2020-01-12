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
        let o = this.toObj(d);
        let found = this.getItem(o.pageUrl, o.elementId);
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
        let o = this.toObj(d);
        let found = this.getItem(o.pageUrl, o.elementId);
        if (!found) {
            console.log('adding', o);
            Util.data.push(o);
        }
        else {
            console.log('already exists', found);
        }
        console.log('data', Util.data);
    }
    static getItem(pageUrl, elementId, createNew) {
        console.log('data', Util.data);
        let rtn = undefined;
        Util.data.forEach((d, index, arr) => {
            if (d.pageUrl === pageUrl && d.elementId === elementId) {
                console.log('found at', index);
                rtn = d;
                return d;
            }
          });
        if (createNew && !rtn) {
            rtn = new HelpData();
        }
        return rtn;
    }
    toObj(d) {
        let o = new HelpData();
        o = { ...d };
        return o;
    }
}