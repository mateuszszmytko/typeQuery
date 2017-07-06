declare var ActiveXObject;
type HttpSettings = {
    user?:string;
    password?:string;
    data?:{[key:string]: string};
    headers?:{[key:string]: string};

}

export class Http {
    public static defaultSettings:HttpSettings = {
        user: null,
        password: null,
        data: null,
        headers: {
            "Accept": "application/json, text/plain, */*"
        }
    }

	public static get(url:string, _settings?:HttpSettings):Promise<XMLHttpRequest> {
		return this.request('GET', url, _settings);
	}

    public static post(url:string, _settings?:HttpSettings):Promise<XMLHttpRequest> {
        return this.request('POST', url, _settings);
    }

    private static mergeSettings(settings:HttpSettings):HttpSettings {
        let mergedSettings:HttpSettings = {};
        for(let s in this.defaultSettings) {
            mergedSettings[s] = this.defaultSettings[s];
        }

        for(let s in settings) {
            mergedSettings[s] = settings[s];
        }
        return mergedSettings;
    }

    private static request(requestType:'GET'|'POST'|'PUT'|'UPDATE', url:string, _settings:HttpSettings):Promise<XMLHttpRequest> {
        let http_request:XMLHttpRequest = undefined,
            settings = this.mergeSettings(_settings);

        if (XMLHttpRequest) { // Mozilla, Safari,...
            http_request = new XMLHttpRequest();
            if (http_request.overrideMimeType) {
                http_request.overrideMimeType('text/xml');
            }
        } else if (ActiveXObject) { // IE
            try {
                http_request = new ActiveXObject("Msxml2.XMLHTTP");
            } catch (e) {
                try {
                    http_request = new ActiveXObject("Microsoft.XMLHTTP");
                } catch (e) {}
            }
        }

        if (!http_request) {
            return;
        }
        let promise = new Promise((resolve:(req:XMLHttpRequest) => any, reject) => {
            http_request.onreadystatechange = () => {
                if(http_request.readyState == 4) {
                    if(http_request.status === 200) {
                        resolve(http_request);
                    } else {
                        reject(http_request);
                    }
                    
                }
            };
        });
        let dataString = this.parseData(settings.data);
        http_request.open(requestType, url+(dataString && requestType == 'GET'?'?'+dataString:''), true, settings.user, settings.password);
        for(let header in settings.headers) {
            http_request.setRequestHeader(header, settings.headers[header]);
        }
        if(requestType == 'GET')
        http_request.send(dataString && requestType != 'GET'?dataString:'');

        return promise;
    }

    private static parseData(data:{[key:string]: string}):string {
        let parsedData:string = '';
        for(let d in data) {
            parsedData += d+'='+data[d]+'&';
        }

        if(parsedData.length > 1) {
            parsedData = parsedData.substring(0, parsedData.length - 1);
        }

        return parsedData;
    }
}