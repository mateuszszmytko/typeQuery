"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Http = (function () {
    function Http() {
    }
    Http.get = function (url, _settings) {
        return this.request('GET', url, _settings);
    };
    Http.post = function (url, _settings) {
        return this.request('POST', url, _settings);
    };
    Http.mergeSettings = function (settings) {
        var mergedSettings = {};
        for (var s in this.defaultSettings) {
            mergedSettings[s] = this.defaultSettings[s];
        }
        for (var s in settings) {
            mergedSettings[s] = settings[s];
        }
        return mergedSettings;
    };
    Http.request = function (requestType, url, _settings) {
        var http_request = undefined, settings = this.mergeSettings(_settings);
        if (XMLHttpRequest) {
            http_request = new XMLHttpRequest();
            if (http_request.overrideMimeType) {
                http_request.overrideMimeType('text/xml');
            }
        }
        else if (ActiveXObject) {
            try {
                http_request = new ActiveXObject("Msxml2.XMLHTTP");
            }
            catch (e) {
                try {
                    http_request = new ActiveXObject("Microsoft.XMLHTTP");
                }
                catch (e) { }
            }
        }
        if (!http_request) {
            return;
        }
        var promise = new Promise(function (resolve, reject) {
            http_request.onreadystatechange = function () {
                if (http_request.readyState == 4) {
                    if (http_request.status === 200) {
                        resolve(http_request);
                    }
                    else {
                        reject(http_request);
                    }
                }
            };
        });
        var dataString = this.parseData(settings.data);
        http_request.open(requestType, url + (dataString && requestType == 'GET' ? '?' + dataString : null), true, settings.user, settings.password);
        for (var header in settings.headers) {
            http_request.setRequestHeader(header, settings.headers[header]);
        }
        if (requestType == 'GET')
            http_request.send(dataString && requestType != 'GET' ? dataString : null);
        return promise;
    };
    Http.parseData = function (data) {
        var parsedData = '';
        for (var d in data) {
            parsedData += d + '=' + data[d] + '&';
        }
        if (parsedData.length > 1) {
            parsedData = parsedData.substring(0, parsedData.length - 1);
        }
        return parsedData;
    };
    return Http;
}());
Http.defaultSettings = {
    user: null,
    password: null,
    data: null,
    headers: {
        "Accept": "application/json, text/plain, */*"
    }
};
exports.Http = Http;
//# sourceMappingURL=http.js.map