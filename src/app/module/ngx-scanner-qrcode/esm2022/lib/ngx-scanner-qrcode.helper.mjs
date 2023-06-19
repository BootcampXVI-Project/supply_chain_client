import { AsyncSubject } from "rxjs";
import { CONFIG_DEFAULT, WASMPROJECT, WASMREMOTE, WASMREMOTELATEST } from "./ngx-scanner-qrcode.default";
/**
 * WASM_READY
 * @returns
 */
export const WASM_READY = () => ('zbarWasm' in window);
/**
 * OVERRIDES
 * @param variableKey
 * @param config
 * @param defaultConfig
 * @returns
 */
export const OVERRIDES = (variableKey, config, defaultConfig) => {
    if (config && Object.keys(config[variableKey]).length) {
        for (const key in defaultConfig) {
            const cloneDeep = JSON.parse(JSON.stringify({ ...config[variableKey], ...{ [key]: defaultConfig[key] } }));
            config[variableKey] = config[variableKey].hasOwnProperty(key) ? config[variableKey] : cloneDeep;
        }
        return config[variableKey];
    }
    else {
        return defaultConfig;
    }
};
/**
 * AS_COMPLETE
 * @param as
 * @param data
 * @param error
 */
export const AS_COMPLETE = (as, data, error) => {
    error ? as.error(error) : as.next(data);
    as.complete();
};
/**
 * PLAY_AUDIO
 * @param isPlay
 * @returns
 */
export const PLAY_AUDIO = (isPlay = false) => {
    if (isPlay === false)
        return;
    const audio = new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU' + Array(300).join('101'));
    // when the sound has been loaded, execute your code
    audio.oncanplaythrough = () => {
        const promise = audio.play();
        if (promise) {
            promise.catch((e) => {
                if (e.name === "NotAllowedError" || e.name === "NotSupportedError") {
                    // console.log(e.name);
                }
            });
        }
    };
};
/**
 * DRAW_RESULT_APPEND_CHILD
 * @param code
 * @param oriCanvas
 * @param elTarget
 * @param canvasStyles
 */
export const DRAW_RESULT_APPEND_CHILD = (code, oriCanvas, elTarget, canvasStyles) => {
    let widthZoom;
    let heightZoom;
    let oriWidth = oriCanvas.width;
    let oriHeight = oriCanvas.height;
    let oriWHRatio = oriWidth / oriHeight;
    let imgWidth = parseInt(getComputedStyle(oriCanvas).width);
    let imgHeight = parseInt(getComputedStyle(oriCanvas).height);
    let imgWHRatio = imgWidth / imgHeight;
    elTarget.innerHTML = '';
    if (oriWHRatio > imgWHRatio) {
        widthZoom = imgWidth / oriWidth;
        heightZoom = imgWidth / oriWHRatio / oriHeight;
    }
    else {
        heightZoom = imgHeight / oriHeight;
        widthZoom = (imgHeight * oriWHRatio) / oriWidth;
    }
    for (let i = 0; i < code.length; i++) {
        const _code = code[i];
        // New canvas
        let cvs = document.createElement("canvas");
        let ctx = cvs.getContext('2d', { willReadFrequently: true });
        let loc = {};
        let X = [];
        let Y = [];
        let fontSize = 0;
        let svgSize = 0;
        let num = canvasStyles?.font?.replace(/[^0-9]/g, '');
        if (/[0-9]/g.test(num)) {
            fontSize = parseFloat(num);
            svgSize = (widthZoom || 1) * fontSize;
            if (Number.isNaN(svgSize)) {
                svgSize = fontSize;
            }
        }
        // Point x,y
        const points = _code.points;
        for (let j = 0; j < points.length; j++) {
            const xj = points?.[j]?.x ?? 0;
            const yj = points?.[j]?.y ?? 0;
            loc[`x${j + 1}`] = xj;
            loc[`y${j + 1}`] = yj;
            X.push(xj);
            Y.push(yj);
        }
        // Min max
        let maxX = Math.max(...X);
        let minX = Math.min(...X);
        let maxY = Math.max(...Y);
        let minY = Math.min(...Y);
        // Add class
        cvs.setAttribute('class', 'qrcode-polygon');
        // Size with screen zoom
        if (oriWHRatio > imgWHRatio) {
            cvs.style.top = minY * heightZoom + (imgHeight - imgWidth / oriWHRatio) * 0.5 + "px";
            cvs.style.left = minX * widthZoom + "px";
            cvs.width = (maxX - minX) * widthZoom;
            cvs.height = (maxY - minY) * widthZoom;
        }
        else {
            cvs.style.top = minY * heightZoom + "px";
            cvs.style.left = minX * widthZoom + (imgWidth - imgHeight * oriWHRatio) * 0.5 + "px";
            cvs.width = (maxX - minX) * heightZoom;
            cvs.height = (maxY - minY) * heightZoom;
        }
        // Style for canvas
        for (const key in canvasStyles) {
            ctx[key] = canvasStyles[key];
        }
        // polygon [x,y, x,y, x,y.....];
        const polygon = [];
        for (let k = 0; k < X.length; k++) {
            polygon.push((loc[`x${k + 1}`] - minX) * heightZoom);
            polygon.push((loc[`y${k + 1}`] - minY) * widthZoom);
        }
        // Copy array
        const shape = polygon.slice(0);
        // Draw polygon
        ctx.beginPath();
        ctx.moveTo(shape.shift(), shape.shift());
        while (shape.length) {
            ctx.lineTo(shape.shift(), shape.shift()); //x,y
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        if (fontSize) {
            // Tooltip result
            const qrcodeTooltipTemp = document.createElement('div');
            qrcodeTooltipTemp.setAttribute('class', 'qrcode-tooltip-temp');
            qrcodeTooltipTemp.innerText = _code.value;
            const xmlString = `<?xml version="1.0" encoding="utf-8"?><svg version="1.1" class="qrcode-tooltip-clipboard" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${svgSize}" height="${svgSize}" x="0px" y="0px" viewBox="0 0 115.77 122.88" xml:space="preserve"><g><path d="M89.62,13.96v7.73h12.19h0.01v0.02c3.85,0.01,7.34,1.57,9.86,4.1c2.5,2.51,4.06,5.98,4.07,9.82h0.02v0.02 v73.27v0.01h-0.02c-0.01,3.84-1.57,7.33-4.1,9.86c-2.51,2.5-5.98,4.06-9.82,4.07v0.02h-0.02h-61.7H40.1v-0.02 c-3.84-0.01-7.34-1.57-9.86-4.1c-2.5-2.51-4.06-5.98-4.07-9.82h-0.02v-0.02V92.51H13.96h-0.01v-0.02c-3.84-0.01-7.34-1.57-9.86-4.1 c-2.5-2.51-4.06-5.98-4.07-9.82H0v-0.02V13.96v-0.01h0.02c0.01-3.85,1.58-7.34,4.1-9.86c2.51-2.5,5.98-4.06,9.82-4.07V0h0.02h61.7 h0.01v0.02c3.85,0.01,7.34,1.57,9.86,4.1c2.5,2.51,4.06,5.98,4.07,9.82h0.02V13.96L89.62,13.96z M79.04,21.69v-7.73v-0.02h0.02 c0-0.91-0.39-1.75-1.01-2.37c-0.61-0.61-1.46-1-2.37-1v0.02h-0.01h-61.7h-0.02v-0.02c-0.91,0-1.75,0.39-2.37,1.01 c-0.61,0.61-1,1.46-1,2.37h0.02v0.01v64.59v0.02h-0.02c0,0.91,0.39,1.75,1.01,2.37c0.61,0.61,1.46,1,2.37,1v-0.02h0.01h12.19V35.65 v-0.01h0.02c0.01-3.85,1.58-7.34,4.1-9.86c2.51-2.5,5.98-4.06,9.82-4.07v-0.02h0.02H79.04L79.04,21.69z M105.18,108.92V35.65v-0.02 h0.02c0-0.91-0.39-1.75-1.01-2.37c-0.61-0.61-1.46-1-2.37-1v0.02h-0.01h-61.7h-0.02v-0.02c-0.91,0-1.75,0.39-2.37,1.01 c-0.61,0.61-1,1.46-1,2.37h0.02v0.01v73.27v0.02h-0.02c0,0.91,0.39,1.75,1.01,2.37c0.61,0.61,1.46,1,2.37,1v-0.02h0.01h61.7h0.02 v0.02c0.91,0,1.75-0.39,2.37-1.01c0.61-0.61,1-1.46,1-2.37h-0.02V108.92L105.18,108.92z"></path></g></svg> `;
            const xmlDom = new DOMParser().parseFromString(xmlString, 'application/xml');
            const svgDom = qrcodeTooltipTemp.ownerDocument.importNode(xmlDom.documentElement, true);
            qrcodeTooltipTemp.appendChild(svgDom);
            svgDom.addEventListener("click", () => window.navigator['clipboard'].writeText(_code.value));
            // Tooltip box
            const qrcodeTooltip = document.createElement('div');
            qrcodeTooltip.setAttribute('class', 'qrcode-tooltip');
            qrcodeTooltip.appendChild(qrcodeTooltipTemp);
            heightZoom = imgHeight / oriHeight;
            widthZoom = (imgHeight * oriWHRatio) / oriWidth;
            qrcodeTooltip.style.fontSize = widthZoom * fontSize + 'px';
            qrcodeTooltip.style.top = minY * heightZoom + "px";
            qrcodeTooltip.style.left = minX * widthZoom + (imgWidth - imgHeight * oriWHRatio) * 0.5 + "px";
            qrcodeTooltip.style.width = (maxX - minX) * heightZoom + "px";
            qrcodeTooltip.style.height = (maxY - minY) * heightZoom + "px";
            // Result text
            const resultText = document.createElement('span');
            resultText.innerText = _code.value;
            resultText.style.fontSize = widthZoom * fontSize + 'px';
            // Set position result text
            resultText.style.top = minY * heightZoom + (-20 * heightZoom) + "px";
            resultText.style.left = minX * widthZoom + (imgWidth - imgHeight * oriWHRatio) * 0.5 + "px";
            elTarget?.appendChild(qrcodeTooltip);
            elTarget?.appendChild(resultText);
        }
        elTarget?.appendChild(cvs);
    }
    ;
};
/**
 * DRAW_RESULT_ON_CANVAS
 * @param code
 * @param cvs
 * @param canvasStyles
 */
export const DRAW_RESULT_ON_CANVAS = (code, cvs, canvasStyles) => {
    let ctx = cvs.getContext('2d', { willReadFrequently: true });
    for (let i = 0; i < code.length; i++) {
        const _code = code[i];
        let loc = {};
        let X = [];
        let Y = [];
        // Point x,y
        const points = _code.points;
        for (let j = 0; j < points.length; j++) {
            const xj = points?.[j]?.x ?? 0;
            const yj = points?.[j]?.y ?? 0;
            loc[`x${j + 1}`] = xj;
            loc[`y${j + 1}`] = yj;
            X.push(xj);
            Y.push(yj);
        }
        // Min max
        let minX = Math.min(...X);
        let minY = Math.min(...Y);
        // Style for canvas
        for (const key in canvasStyles) {
            ctx[key] = canvasStyles[key];
        }
        ctx.font = canvasStyles?.font ?? `15px serif`;
        FILL_TEXT_MULTI_LINE(ctx, _code.value, minX, minY - 5);
        // polygon [x,y, x,y, x,y.....];
        const polygon = [];
        for (let k = 0; k < X.length; k++) {
            polygon.push(loc[`x${k + 1}`]);
            polygon.push(loc[`y${k + 1}`]);
        }
        // Copy array
        const shape = polygon.slice(0);
        // Draw polygon
        ctx.beginPath();
        ctx.moveTo(shape.shift(), shape.shift());
        while (shape.length) {
            ctx.lineTo(shape.shift(), shape.shift()); //x,y
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
    ;
};
/**
 * READ_AS_DATA_URL
 * @param file
 * @param configs
 * @returns
 */
export const READ_AS_DATA_URL = (file, configs) => {
    /** overrides **/
    let decode = configs?.decode ?? CONFIG_DEFAULT.decode;
    let canvasStyles = configs?.canvasStyles ?? CONFIG_DEFAULT.canvasStyles;
    let isBeep = configs?.isBeep ?? CONFIG_DEFAULT.isBeep;
    /** drawImage **/
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onload = () => {
            const objectFile = {
                name: file.name,
                file: file,
                url: URL.createObjectURL(file)
            };
            // Set the src of this Image object.
            const image = new Image();
            // Setting cross origin value to anonymous
            image.setAttribute('crossOrigin', 'anonymous');
            // When our image has loaded.
            image.onload = async () => {
                // Get the canvas element by using the getElementById method.
                const canvas = document.createElement('canvas');
                // HTMLImageElement size
                canvas.width = image.naturalWidth || image.width;
                canvas.height = image.naturalHeight || image.height;
                // Get a 2D drawing context for the canvas.
                const ctx = canvas.getContext('2d');
                // Draw image
                ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                // Data image
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                // Scanner
                if ('zbarWasm' in window) {
                    const code = await zbarWasm.scanImageData(imageData);
                    if (code?.length) {
                        // Decode
                        code.forEach((s) => s.value = s.decode(decode?.toLocaleLowerCase()));
                        // Overlay
                        DRAW_RESULT_ON_CANVAS(code, canvas, canvasStyles);
                        // Emit object
                        const blob = await CANVAS_TO_BLOB(canvas);
                        const url = URL.createObjectURL(blob);
                        const blobToFile = (theBlob, fileName) => new File([theBlob], fileName, { lastModified: new Date().getTime(), type: theBlob.type });
                        resolve(Object.assign({}, objectFile, { data: code, url: url, canvas: canvas, file: blobToFile(blob, objectFile.name) }));
                        PLAY_AUDIO(isBeep);
                    }
                    else {
                        resolve(Object.assign({}, objectFile, { data: code, canvas: canvas }));
                    }
                }
            };
            // Set src
            image.src = objectFile.url;
        };
        fileReader.onerror = (error) => reject(error);
        fileReader.readAsDataURL(file);
    });
};
/**
 * Convert canvas to blob
 * canvas.toBlob((blob) => { .. }, 'image/jpeg', 0.95); // JPEG at 95% quality
 * @param canvas
 * @param type
 * @returns
 */
export const CANVAS_TO_BLOB = (canvas, type) => {
    return new Promise((resolve, reject) => canvas.toBlob(blob => resolve(blob), type));
};
/**
 * Convert blob to file
 * @param theBlob
 * @param fileName
 * @returns
 */
export const BLOB_TO_FILE = (theBlob, fileName) => {
    return new File([theBlob], fileName, { lastModified: new Date().getTime(), type: theBlob.type });
};
/**
 * FILES_TO_SCAN
 * @param files
 * @param configs
 * @param quality
 * @param type
 * @param as
 * @returns
 */
export const FILES_TO_SCAN = (files = [], configs, quality, type, as = new AsyncSubject()) => {
    COMPRESS_IMAGE_FILE(files, quality, type).then((_files) => {
        Promise.all(Object.assign([], files).map(m => READ_AS_DATA_URL(m, configs))).then((img) => {
            AS_COMPLETE(as, img);
        }).catch((error) => AS_COMPLETE(as, null, error));
    });
    return as;
};
/**
 * FILL_TEXT_MULTI_LINE
 * @param ctx
 * @param text
 * @param x
 * @param y
 */
export const FILL_TEXT_MULTI_LINE = (ctx, text, x, y) => {
    let lineHeight = ctx.measureText("M").width * 1.2;
    let lines = text.split("\n");
    for (var i = 0; i < lines.length; ++i) {
        ctx.fillText(lines[i], x, y);
        ctx.strokeText(lines[i], x, y);
        y += lineHeight;
    }
};
/**
 * ADD_JS_TO_ELEMENT
 * @param as
 * @param renderer
 * @returns
 */
export const ADD_JS_TO_ELEMENT = (as, renderer) => {
    const R = () => {
        let timeoutId;
        const L = () => {
            clearTimeout(timeoutId);
            WASM_READY() ? setTimeout(() => AS_COMPLETE(as, true)) : timeoutId = setTimeout(() => L());
        };
        setTimeout(() => L());
        setTimeout(() => clearTimeout(timeoutId), 3000);
    };
    const scriptRemote = document.querySelectorAll(`script[src="${WASMREMOTE}"]`);
    const scriptRemoteLatest = document.querySelectorAll(`script[src="${WASMREMOTELATEST}"]`);
    if (scriptRemote.length || scriptRemoteLatest.length) {
        R();
    }
    else {
        const scriptProject = document.querySelectorAll(`script[src="${WASMPROJECT}"]`);
        if (scriptProject.length === 1) {
            R();
        }
        else {
            scriptProject.forEach(f => f.remove());
            const script = renderer.createElement("script");
            renderer.setAttribute(script, "type", "text/javascript");
            renderer.setAttribute(script, "src", WASMPROJECT);
            renderer.appendChild(document.body, script);
            script.onload = () => R();
            script.onerror = () => AS_COMPLETE(as, false, 'Could not load script ' + WASMPROJECT);
        }
    }
    return as;
};
/**
 * COMPRESS_IMAGE_FILE
 * @param files
 * @param quality
 * @param type
 * @returns
 */
export const COMPRESS_IMAGE_FILE = async (files, quality = 0.5, type = "image/jpeg") => {
    // No files selected
    if (!files.length || quality === 1)
        return files;
    const compressImage = async (file) => {
        // Get as image data
        const imageBitmap = await createImageBitmap(file);
        // Draw to canvas
        const canvas = document.createElement('canvas');
        canvas.width = imageBitmap.width;
        canvas.height = imageBitmap.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(imageBitmap, 0, 0);
        // Turn into Blob
        const blob = await new Promise((resolve) => canvas.toBlob(resolve, type, quality));
        // Turn Blob into File
        return new File([blob], file.name, {
            type: blob.type,
        });
    };
    // We'll store the files in this data transfer object
    const dataTransfer = new DataTransfer();
    // For every file in the files list
    await (async () => {
        for (const file of files) {
            // We don't have to compress files that aren't images
            if (!file.type.startsWith('image')) {
                // Ignore this file, but do add it to our result
                dataTransfer.items.add(file);
                continue;
            }
            // We compress the file by 50%
            const compressedFile = await compressImage(file);
            // Save back the compressed file instead of the original file
            dataTransfer.items.add(compressedFile);
        }
    })();
    // return value new files list
    return dataTransfer.files;
};
/**
 * REMOVE_RESULT_PANEL
 * @param element
 */
export const REMOVE_RESULT_PANEL = (element) => {
    // clear text result and tooltip
    Object.assign([], element.childNodes).forEach(el => element.removeChild(el));
};
/**
 * RESET_CANVAS
 * @param canvas
 */
export const RESET_CANVAS = (canvas) => {
    // reset canvas
    const context = canvas.getContext('2d', { willReadFrequently: true });
    // clear frame when reloop
    context.clearRect(0, 0, canvas.width, canvas.height);
};
/**
 * UPDATE_WIDTH_HEIGHT_VIDEO
 * @param video
 * @param canvas
 */
export const UPDATE_WIDTH_HEIGHT_VIDEO = (video, canvas) => {
    video.style.width = canvas.offsetWidth + 'px';
    video.style.height = canvas.offsetHeight + 'px';
};
/**
 * VIBRATE
 * @param time
 */
export const VIBRATE = (time = 300) => {
    time && IS_MOBILE() && window?.navigator?.vibrate(time);
};
/**
 * IS_MOBILE
 * @returns
 */
export const IS_MOBILE = () => {
    const vendor = navigator.userAgent || navigator['vendor'] || window['opera'];
    const phone = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i;
    const version = /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw-(n|u)|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do(c|p)o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(-|_)|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-(m|p|t)|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c(-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac( |-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel(i|m)|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i;
    const isSafari = /^((?!chrome|android).)*safari/i;
    return !!(phone.test(vendor) || version.test(vendor.substr(0, 4))) && !isSafari.test(vendor);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXNjYW5uZXItcXJjb2RlLmhlbHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1zY2FubmVyLXFyY29kZS9zcmMvbGliL25neC1zY2FubmVyLXFyY29kZS5oZWxwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUNwQyxPQUFPLEVBQUUsY0FBYyxFQUFFLFdBQVcsRUFBRSxVQUFVLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUl6Rzs7O0dBR0c7QUFDSCxNQUFNLENBQUMsTUFBTSxVQUFVLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBQyxVQUFVLElBQUksTUFBTSxDQUFDLENBQUM7QUFFdkQ7Ozs7OztHQU1HO0FBQ0gsTUFBTSxDQUFDLE1BQU0sU0FBUyxHQUFHLENBQUMsV0FBbUIsRUFBRSxNQUFXLEVBQUUsYUFBa0IsRUFBRSxFQUFFO0lBQ2hGLElBQUksTUFBTSxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFO1FBQ3JELEtBQUssTUFBTSxHQUFHLElBQUksYUFBYSxFQUFFO1lBQy9CLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFHLGFBQXFCLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNwSCxNQUFNLENBQUMsV0FBVyxDQUFDLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7U0FD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QUFDSCxNQUFNLENBQUMsTUFBTSxTQUFTLEdBQUcsR0FBRyxFQUFFO0lBQzVCLE1BQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQyxTQUFTLElBQUksU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFLLE1BQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN0RixNQUFNLEtBQUssR0FBRyxxVkFBcVYsQ0FBQztJQUNwVyxNQUFNLE9BQU8sR0FBRywyaERBQTJoRCxDQUFDO0lBQzVpRCxNQUFNLFFBQVEsR0FBRyxnQ0FBZ0MsQ0FBQztJQUNsRCxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQy9GLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFJlbmRlcmVyMiB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XHJcbmltcG9ydCB7IEFzeW5jU3ViamVjdCB9IGZyb20gXCJyeGpzXCI7XHJcbmltcG9ydCB7IENPTkZJR19ERUZBVUxULCBXQVNNUFJPSkVDVCwgV0FTTVJFTU9URSwgV0FTTVJFTU9URUxBVEVTVCB9IGZyb20gXCIuL25neC1zY2FubmVyLXFyY29kZS5kZWZhdWx0XCI7XHJcbmltcG9ydCB7IFNjYW5uZXJRUkNvZGVDb25maWcsIFNjYW5uZXJRUkNvZGVTZWxlY3RlZEZpbGVzIH0gZnJvbSBcIi4vbmd4LXNjYW5uZXItcXJjb2RlLm9wdGlvbnNcIjtcclxuZGVjbGFyZSBjb25zdCB6YmFyV2FzbTogYW55O1xyXG5cclxuLyoqXHJcbiAqIFdBU01fUkVBRFlcclxuICogQHJldHVybnMgXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgV0FTTV9SRUFEWSA9ICgpID0+ICgnemJhcldhc20nIGluIHdpbmRvdyk7XHJcblxyXG4vKipcclxuICogT1ZFUlJJREVTXHJcbiAqIEBwYXJhbSB2YXJpYWJsZUtleSBcclxuICogQHBhcmFtIGNvbmZpZyBcclxuICogQHBhcmFtIGRlZmF1bHRDb25maWcgXHJcbiAqIEByZXR1cm5zIFxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IE9WRVJSSURFUyA9ICh2YXJpYWJsZUtleTogc3RyaW5nLCBjb25maWc6IGFueSwgZGVmYXVsdENvbmZpZzogYW55KSA9PiB7XHJcbiAgaWYgKGNvbmZpZyAmJiBPYmplY3Qua2V5cyhjb25maWdbdmFyaWFibGVLZXldKS5sZW5ndGgpIHtcclxuICAgIGZvciAoY29uc3Qga2V5IGluIGRlZmF1bHRDb25maWcpIHtcclxuICAgICAgY29uc3QgY2xvbmVEZWVwID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeSh7IC4uLmNvbmZpZ1t2YXJpYWJsZUtleV0sIC4uLnsgW2tleV06IChkZWZhdWx0Q29uZmlnIGFzIGFueSlba2V5XSB9IH0pKTtcclxuICAgICAgY29uZmlnW3ZhcmlhYmxlS2V5XSA9IGNvbmZpZ1t2YXJpYWJsZUtleV0uaGFzT3duUHJvcGVydHkoa2V5KSA/IGNvbmZpZ1t2YXJpYWJsZUtleV0gOiBjbG9uZURlZXA7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gY29uZmlnW3ZhcmlhYmxlS2V5XTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIGRlZmF1bHRDb25maWc7XHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEFTX0NPTVBMRVRFXHJcbiAqIEBwYXJhbSBhcyBcclxuICogQHBhcmFtIGRhdGEgXHJcbiAqIEBwYXJhbSBlcnJvciBcclxuICovXHJcbmV4cG9ydCBjb25zdCBBU19DT01QTEVURSA9IChhczogQXN5bmNTdWJqZWN0PGFueT4sIGRhdGE6IGFueSwgZXJyb3I/OiBhbnkpID0+IHtcclxuICBlcnJvciA/IGFzLmVycm9yKGVycm9yKSA6IGFzLm5leHQoZGF0YSk7XHJcbiAgYXMuY29tcGxldGUoKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBQTEFZX0FVRElPXHJcbiAqIEBwYXJhbSBpc1BsYXkgXHJcbiAqIEByZXR1cm5zIFxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IFBMQVlfQVVESU8gPSAoaXNQbGF5OiBib29sZWFuID0gZmFsc2UpID0+IHtcclxuICBpZiAoaXNQbGF5ID09PSBmYWxzZSkgcmV0dXJuO1xyXG4gIGNvbnN0IGF1ZGlvID0gbmV3IEF1ZGlvKCdkYXRhOmF1ZGlvL3dhdjtiYXNlNjQsVWtsR1JsOXZUMTlYUVZaRlptMTBJQkFBQUFBQkFBRUFRQjhBQUVBZkFBQUJBQWdBWkdGMFlVJyArIEFycmF5KDMwMCkuam9pbignMTAxJykpO1xyXG4gIC8vIHdoZW4gdGhlIHNvdW5kIGhhcyBiZWVuIGxvYWRlZCwgZXhlY3V0ZSB5b3VyIGNvZGVcclxuICBhdWRpby5vbmNhbnBsYXl0aHJvdWdoID0gKCkgPT4ge1xyXG4gICAgY29uc3QgcHJvbWlzZSA9IGF1ZGlvLnBsYXkoKTtcclxuICAgIGlmIChwcm9taXNlKSB7XHJcbiAgICAgIHByb21pc2UuY2F0Y2goKGUpID0+IHtcclxuICAgICAgICBpZiAoZS5uYW1lID09PSBcIk5vdEFsbG93ZWRFcnJvclwiIHx8IGUubmFtZSA9PT0gXCJOb3RTdXBwb3J0ZWRFcnJvclwiKSB7XHJcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyhlLm5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBEUkFXX1JFU1VMVF9BUFBFTkRfQ0hJTERcclxuICogQHBhcmFtIGNvZGUgXHJcbiAqIEBwYXJhbSBvcmlDYW52YXMgXHJcbiAqIEBwYXJhbSBlbFRhcmdldCBcclxuICogQHBhcmFtIGNhbnZhc1N0eWxlcyBcclxuICovXHJcbmV4cG9ydCBjb25zdCBEUkFXX1JFU1VMVF9BUFBFTkRfQ0hJTEQgPSAoY29kZTogYW55W10sIG9yaUNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQsIGVsVGFyZ2V0OiBIVE1MQ2FudmFzRWxlbWVudCB8IEhUTUxEaXZFbGVtZW50LCBjYW52YXNTdHlsZXM6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCkgPT4ge1xyXG4gIGxldCB3aWR0aFpvb207XHJcbiAgbGV0IGhlaWdodFpvb207XHJcbiAgbGV0IG9yaVdpZHRoID0gb3JpQ2FudmFzLndpZHRoO1xyXG4gIGxldCBvcmlIZWlnaHQgPSBvcmlDYW52YXMuaGVpZ2h0O1xyXG4gIGxldCBvcmlXSFJhdGlvID0gb3JpV2lkdGggLyBvcmlIZWlnaHQ7XHJcbiAgbGV0IGltZ1dpZHRoID0gcGFyc2VJbnQoZ2V0Q29tcHV0ZWRTdHlsZShvcmlDYW52YXMpLndpZHRoKTtcclxuICBsZXQgaW1nSGVpZ2h0ID0gcGFyc2VJbnQoZ2V0Q29tcHV0ZWRTdHlsZShvcmlDYW52YXMpLmhlaWdodCk7XHJcbiAgbGV0IGltZ1dIUmF0aW8gPSBpbWdXaWR0aCAvIGltZ0hlaWdodDtcclxuICBlbFRhcmdldC5pbm5lckhUTUwgPSAnJztcclxuXHJcbiAgaWYgKG9yaVdIUmF0aW8gPiBpbWdXSFJhdGlvKSB7XHJcbiAgICB3aWR0aFpvb20gPSBpbWdXaWR0aCAvIG9yaVdpZHRoO1xyXG4gICAgaGVpZ2h0Wm9vbSA9IGltZ1dpZHRoIC8gb3JpV0hSYXRpbyAvIG9yaUhlaWdodDtcclxuICB9IGVsc2Uge1xyXG4gICAgaGVpZ2h0Wm9vbSA9IGltZ0hlaWdodCAvIG9yaUhlaWdodDtcclxuICAgIHdpZHRoWm9vbSA9IChpbWdIZWlnaHQgKiBvcmlXSFJhdGlvKSAvIG9yaVdpZHRoO1xyXG4gIH1cclxuXHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb2RlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBjb25zdCBfY29kZSA9IGNvZGVbaV07XHJcbiAgICAvLyBOZXcgY2FudmFzXHJcbiAgICBsZXQgY3ZzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcclxuICAgIGxldCBjdHggPSBjdnMuZ2V0Q29udGV4dCgnMmQnLCB7IHdpbGxSZWFkRnJlcXVlbnRseTogdHJ1ZSB9KSBhcyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XHJcbiAgICBsZXQgbG9jOiBhbnkgPSB7fTtcclxuICAgIGxldCBYOiBhbnkgPSBbXTtcclxuICAgIGxldCBZOiBhbnkgPSBbXTtcclxuICAgIGxldCBmb250U2l6ZSA9IDA7XHJcbiAgICBsZXQgc3ZnU2l6ZSA9IDA7XHJcblxyXG4gICAgbGV0IG51bSA9IGNhbnZhc1N0eWxlcz8uZm9udD8ucmVwbGFjZSgvW14wLTldL2csICcnKTtcclxuICAgIGlmICgvWzAtOV0vZy50ZXN0KG51bSkpIHtcclxuICAgICAgZm9udFNpemUgPSBwYXJzZUZsb2F0KG51bSk7XHJcbiAgICAgIHN2Z1NpemUgPSAod2lkdGhab29tIHx8IDEpICogZm9udFNpemU7XHJcbiAgICAgIGlmIChOdW1iZXIuaXNOYU4oc3ZnU2l6ZSkpIHtcclxuICAgICAgICBzdmdTaXplID0gZm9udFNpemU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBQb2ludCB4LHlcclxuICAgIGNvbnN0IHBvaW50cyA9IF9jb2RlLnBvaW50cztcclxuICAgIGZvciAobGV0IGogPSAwOyBqIDwgcG9pbnRzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgIGNvbnN0IHhqID0gcG9pbnRzPy5bal0/LnggPz8gMDtcclxuICAgICAgY29uc3QgeWogPSBwb2ludHM/LltqXT8ueSA/PyAwO1xyXG4gICAgICBsb2NbYHgke2ogKyAxfWBdID0geGo7XHJcbiAgICAgIGxvY1tgeSR7aiArIDF9YF0gPSB5ajtcclxuICAgICAgWC5wdXNoKHhqKTtcclxuICAgICAgWS5wdXNoKHlqKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBNaW4gbWF4XHJcbiAgICBsZXQgbWF4WCA9IE1hdGgubWF4KC4uLlgpO1xyXG4gICAgbGV0IG1pblggPSBNYXRoLm1pbiguLi5YKTtcclxuICAgIGxldCBtYXhZID0gTWF0aC5tYXgoLi4uWSk7XHJcbiAgICBsZXQgbWluWSA9IE1hdGgubWluKC4uLlkpO1xyXG5cclxuICAgIC8vIEFkZCBjbGFzc1xyXG4gICAgY3ZzLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAncXJjb2RlLXBvbHlnb24nKTtcclxuXHJcbiAgICAvLyBTaXplIHdpdGggc2NyZWVuIHpvb21cclxuICAgIGlmIChvcmlXSFJhdGlvID4gaW1nV0hSYXRpbykge1xyXG4gICAgICBjdnMuc3R5bGUudG9wID0gbWluWSAqIGhlaWdodFpvb20gKyAoaW1nSGVpZ2h0IC0gaW1nV2lkdGggLyBvcmlXSFJhdGlvKSAqIDAuNSArIFwicHhcIjtcclxuICAgICAgY3ZzLnN0eWxlLmxlZnQgPSBtaW5YICogd2lkdGhab29tICsgXCJweFwiO1xyXG4gICAgICBjdnMud2lkdGggPSAobWF4WCAtIG1pblgpICogd2lkdGhab29tO1xyXG4gICAgICBjdnMuaGVpZ2h0ID0gKG1heFkgLSBtaW5ZKSAqIHdpZHRoWm9vbTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGN2cy5zdHlsZS50b3AgPSBtaW5ZICogaGVpZ2h0Wm9vbSArIFwicHhcIjtcclxuICAgICAgY3ZzLnN0eWxlLmxlZnQgPSBtaW5YICogd2lkdGhab29tICsgKGltZ1dpZHRoIC0gaW1nSGVpZ2h0ICogb3JpV0hSYXRpbykgKiAwLjUgKyBcInB4XCI7XHJcbiAgICAgIGN2cy53aWR0aCA9IChtYXhYIC0gbWluWCkgKiBoZWlnaHRab29tO1xyXG4gICAgICBjdnMuaGVpZ2h0ID0gKG1heFkgLSBtaW5ZKSAqIGhlaWdodFpvb207XHJcbiAgICB9XHJcblxyXG4gICAgLy8gU3R5bGUgZm9yIGNhbnZhc1xyXG4gICAgZm9yIChjb25zdCBrZXkgaW4gY2FudmFzU3R5bGVzKSB7XHJcbiAgICAgIChjdHggYXMgYW55KVtrZXldID0gKGNhbnZhc1N0eWxlcyBhcyBhbnkpW2tleV07XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcG9seWdvbiBbeCx5LCB4LHksIHgseS4uLi4uXTtcclxuICAgIGNvbnN0IHBvbHlnb24gPSBbXTtcclxuICAgIGZvciAobGV0IGsgPSAwOyBrIDwgWC5sZW5ndGg7IGsrKykge1xyXG4gICAgICBwb2x5Z29uLnB1c2goKGxvY1tgeCR7ayArIDF9YF0gLSBtaW5YKSAqIGhlaWdodFpvb20pO1xyXG4gICAgICBwb2x5Z29uLnB1c2goKGxvY1tgeSR7ayArIDF9YF0gLSBtaW5ZKSAqIHdpZHRoWm9vbSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQ29weSBhcnJheVxyXG4gICAgY29uc3Qgc2hhcGUgPSBwb2x5Z29uLnNsaWNlKDApIGFzIGFueTtcclxuXHJcbiAgICAvLyBEcmF3IHBvbHlnb25cclxuICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgIGN0eC5tb3ZlVG8oc2hhcGUuc2hpZnQoKSwgc2hhcGUuc2hpZnQoKSk7XHJcbiAgICB3aGlsZSAoc2hhcGUubGVuZ3RoKSB7XHJcbiAgICAgIGN0eC5saW5lVG8oc2hhcGUuc2hpZnQoKSwgc2hhcGUuc2hpZnQoKSk7IC8veCx5XHJcbiAgICB9XHJcbiAgICBjdHguY2xvc2VQYXRoKCk7XHJcbiAgICBjdHguZmlsbCgpO1xyXG4gICAgY3R4LnN0cm9rZSgpO1xyXG5cclxuICAgIGlmIChmb250U2l6ZSkge1xyXG4gICAgICAvLyBUb29sdGlwIHJlc3VsdFxyXG4gICAgICBjb25zdCBxcmNvZGVUb29sdGlwVGVtcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICBxcmNvZGVUb29sdGlwVGVtcC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3FyY29kZS10b29sdGlwLXRlbXAnKTtcclxuICAgICAgcXJjb2RlVG9vbHRpcFRlbXAuaW5uZXJUZXh0ID0gX2NvZGUudmFsdWU7XHJcbiAgICAgIGNvbnN0IHhtbFN0cmluZyA9IGA8P3htbCB2ZXJzaW9uPVwiMS4wXCIgZW5jb2Rpbmc9XCJ1dGYtOFwiPz48c3ZnIHZlcnNpb249XCIxLjFcIiBjbGFzcz1cInFyY29kZS10b29sdGlwLWNsaXBib2FyZFwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB4bWxuczp4bGluaz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIiB3aWR0aD1cIiR7c3ZnU2l6ZX1cIiBoZWlnaHQ9XCIke3N2Z1NpemV9XCIgeD1cIjBweFwiIHk9XCIwcHhcIiB2aWV3Qm94PVwiMCAwIDExNS43NyAxMjIuODhcIiB4bWw6c3BhY2U9XCJwcmVzZXJ2ZVwiPjxnPjxwYXRoIGQ9XCJNODkuNjIsMTMuOTZ2Ny43M2gxMi4xOWgwLjAxdjAuMDJjMy44NSwwLjAxLDcuMzQsMS41Nyw5Ljg2LDQuMWMyLjUsMi41MSw0LjA2LDUuOTgsNC4wNyw5LjgyaDAuMDJ2MC4wMiB2NzMuMjd2MC4wMWgtMC4wMmMtMC4wMSwzLjg0LTEuNTcsNy4zMy00LjEsOS44NmMtMi41MSwyLjUtNS45OCw0LjA2LTkuODIsNC4wN3YwLjAyaC0wLjAyaC02MS43SDQwLjF2LTAuMDIgYy0zLjg0LTAuMDEtNy4zNC0xLjU3LTkuODYtNC4xYy0yLjUtMi41MS00LjA2LTUuOTgtNC4wNy05LjgyaC0wLjAydi0wLjAyVjkyLjUxSDEzLjk2aC0wLjAxdi0wLjAyYy0zLjg0LTAuMDEtNy4zNC0xLjU3LTkuODYtNC4xIGMtMi41LTIuNTEtNC4wNi01Ljk4LTQuMDctOS44Mkgwdi0wLjAyVjEzLjk2di0wLjAxaDAuMDJjMC4wMS0zLjg1LDEuNTgtNy4zNCw0LjEtOS44NmMyLjUxLTIuNSw1Ljk4LTQuMDYsOS44Mi00LjA3VjBoMC4wMmg2MS43IGgwLjAxdjAuMDJjMy44NSwwLjAxLDcuMzQsMS41Nyw5Ljg2LDQuMWMyLjUsMi41MSw0LjA2LDUuOTgsNC4wNyw5LjgyaDAuMDJWMTMuOTZMODkuNjIsMTMuOTZ6IE03OS4wNCwyMS42OXYtNy43M3YtMC4wMmgwLjAyIGMwLTAuOTEtMC4zOS0xLjc1LTEuMDEtMi4zN2MtMC42MS0wLjYxLTEuNDYtMS0yLjM3LTF2MC4wMmgtMC4wMWgtNjEuN2gtMC4wMnYtMC4wMmMtMC45MSwwLTEuNzUsMC4zOS0yLjM3LDEuMDEgYy0wLjYxLDAuNjEtMSwxLjQ2LTEsMi4zN2gwLjAydjAuMDF2NjQuNTl2MC4wMmgtMC4wMmMwLDAuOTEsMC4zOSwxLjc1LDEuMDEsMi4zN2MwLjYxLDAuNjEsMS40NiwxLDIuMzcsMXYtMC4wMmgwLjAxaDEyLjE5VjM1LjY1IHYtMC4wMWgwLjAyYzAuMDEtMy44NSwxLjU4LTcuMzQsNC4xLTkuODZjMi41MS0yLjUsNS45OC00LjA2LDkuODItNC4wN3YtMC4wMmgwLjAySDc5LjA0TDc5LjA0LDIxLjY5eiBNMTA1LjE4LDEwOC45MlYzNS42NXYtMC4wMiBoMC4wMmMwLTAuOTEtMC4zOS0xLjc1LTEuMDEtMi4zN2MtMC42MS0wLjYxLTEuNDYtMS0yLjM3LTF2MC4wMmgtMC4wMWgtNjEuN2gtMC4wMnYtMC4wMmMtMC45MSwwLTEuNzUsMC4zOS0yLjM3LDEuMDEgYy0wLjYxLDAuNjEtMSwxLjQ2LTEsMi4zN2gwLjAydjAuMDF2NzMuMjd2MC4wMmgtMC4wMmMwLDAuOTEsMC4zOSwxLjc1LDEuMDEsMi4zN2MwLjYxLDAuNjEsMS40NiwxLDIuMzcsMXYtMC4wMmgwLjAxaDYxLjdoMC4wMiB2MC4wMmMwLjkxLDAsMS43NS0wLjM5LDIuMzctMS4wMWMwLjYxLTAuNjEsMS0xLjQ2LDEtMi4zN2gtMC4wMlYxMDguOTJMMTA1LjE4LDEwOC45MnpcIj48L3BhdGg+PC9nPjwvc3ZnPiBgO1xyXG4gICAgICBjb25zdCB4bWxEb20gPSBuZXcgRE9NUGFyc2VyKCkucGFyc2VGcm9tU3RyaW5nKHhtbFN0cmluZywgJ2FwcGxpY2F0aW9uL3htbCcpO1xyXG4gICAgICBjb25zdCBzdmdEb20gPSBxcmNvZGVUb29sdGlwVGVtcC5vd25lckRvY3VtZW50LmltcG9ydE5vZGUoeG1sRG9tLmRvY3VtZW50RWxlbWVudCwgdHJ1ZSk7XHJcbiAgICAgIHFyY29kZVRvb2x0aXBUZW1wLmFwcGVuZENoaWxkKHN2Z0RvbSk7XHJcbiAgICAgIHN2Z0RvbS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gd2luZG93Lm5hdmlnYXRvclsnY2xpcGJvYXJkJ10ud3JpdGVUZXh0KF9jb2RlLnZhbHVlKSk7XHJcblxyXG4gICAgICAvLyBUb29sdGlwIGJveFxyXG4gICAgICBjb25zdCBxcmNvZGVUb29sdGlwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgIHFyY29kZVRvb2x0aXAuc2V0QXR0cmlidXRlKCdjbGFzcycsICdxcmNvZGUtdG9vbHRpcCcpO1xyXG4gICAgICBxcmNvZGVUb29sdGlwLmFwcGVuZENoaWxkKHFyY29kZVRvb2x0aXBUZW1wKTtcclxuICAgICAgaGVpZ2h0Wm9vbSA9IGltZ0hlaWdodCAvIG9yaUhlaWdodDtcclxuICAgICAgd2lkdGhab29tID0gKGltZ0hlaWdodCAqIG9yaVdIUmF0aW8pIC8gb3JpV2lkdGg7XHJcbiAgICAgIHFyY29kZVRvb2x0aXAuc3R5bGUuZm9udFNpemUgPSB3aWR0aFpvb20gKiBmb250U2l6ZSArICdweCc7XHJcbiAgICAgIHFyY29kZVRvb2x0aXAuc3R5bGUudG9wID0gbWluWSAqIGhlaWdodFpvb20gKyBcInB4XCI7XHJcbiAgICAgIHFyY29kZVRvb2x0aXAuc3R5bGUubGVmdCA9IG1pblggKiB3aWR0aFpvb20gKyAoaW1nV2lkdGggLSBpbWdIZWlnaHQgKiBvcmlXSFJhdGlvKSAqIDAuNSArIFwicHhcIjtcclxuICAgICAgcXJjb2RlVG9vbHRpcC5zdHlsZS53aWR0aCA9IChtYXhYIC0gbWluWCkgKiBoZWlnaHRab29tICsgXCJweFwiO1xyXG4gICAgICBxcmNvZGVUb29sdGlwLnN0eWxlLmhlaWdodCA9IChtYXhZIC0gbWluWSkgKiBoZWlnaHRab29tICsgXCJweFwiO1xyXG5cclxuICAgICAgLy8gUmVzdWx0IHRleHRcclxuICAgICAgY29uc3QgcmVzdWx0VGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuICAgICAgcmVzdWx0VGV4dC5pbm5lclRleHQgPSBfY29kZS52YWx1ZTtcclxuICAgICAgcmVzdWx0VGV4dC5zdHlsZS5mb250U2l6ZSA9IHdpZHRoWm9vbSAqIGZvbnRTaXplICsgJ3B4JztcclxuXHJcbiAgICAgIC8vIFNldCBwb3NpdGlvbiByZXN1bHQgdGV4dFxyXG4gICAgICByZXN1bHRUZXh0LnN0eWxlLnRvcCA9IG1pblkgKiBoZWlnaHRab29tICsgKC0yMCAqIGhlaWdodFpvb20pICsgXCJweFwiO1xyXG4gICAgICByZXN1bHRUZXh0LnN0eWxlLmxlZnQgPSBtaW5YICogd2lkdGhab29tICsgKGltZ1dpZHRoIC0gaW1nSGVpZ2h0ICogb3JpV0hSYXRpbykgKiAwLjUgKyBcInB4XCI7XHJcblxyXG4gICAgICBlbFRhcmdldD8uYXBwZW5kQ2hpbGQocXJjb2RlVG9vbHRpcCk7XHJcbiAgICAgIGVsVGFyZ2V0Py5hcHBlbmRDaGlsZChyZXN1bHRUZXh0KTtcclxuICAgIH1cclxuXHJcbiAgICBlbFRhcmdldD8uYXBwZW5kQ2hpbGQoY3ZzKTtcclxuICB9O1xyXG5cclxufVxyXG5cclxuLyoqXHJcbiAqIERSQVdfUkVTVUxUX09OX0NBTlZBU1xyXG4gKiBAcGFyYW0gY29kZSBcclxuICogQHBhcmFtIGN2cyBcclxuICogQHBhcmFtIGNhbnZhc1N0eWxlcyBcclxuICovXHJcbmV4cG9ydCBjb25zdCBEUkFXX1JFU1VMVF9PTl9DQU5WQVMgPSAoY29kZTogYW55W10sIGN2czogSFRNTENhbnZhc0VsZW1lbnQsIGNhbnZhc1N0eWxlcz86IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCkgPT4ge1xyXG4gIGxldCBjdHggPSBjdnMuZ2V0Q29udGV4dCgnMmQnLCB7IHdpbGxSZWFkRnJlcXVlbnRseTogdHJ1ZSB9KSBhcyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XHJcblxyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgY29kZS5sZW5ndGg7IGkrKykge1xyXG4gICAgY29uc3QgX2NvZGUgPSBjb2RlW2ldO1xyXG4gICAgbGV0IGxvYzogYW55ID0ge307XHJcbiAgICBsZXQgWDogYW55ID0gW107XHJcbiAgICBsZXQgWTogYW55ID0gW107XHJcblxyXG4gICAgLy8gUG9pbnQgeCx5XHJcbiAgICBjb25zdCBwb2ludHMgPSBfY29kZS5wb2ludHM7XHJcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IHBvaW50cy5sZW5ndGg7IGorKykge1xyXG4gICAgICBjb25zdCB4aiA9IHBvaW50cz8uW2pdPy54ID8/IDA7XHJcbiAgICAgIGNvbnN0IHlqID0gcG9pbnRzPy5bal0/LnkgPz8gMDtcclxuICAgICAgbG9jW2B4JHtqICsgMX1gXSA9IHhqO1xyXG4gICAgICBsb2NbYHkke2ogKyAxfWBdID0geWo7XHJcbiAgICAgIFgucHVzaCh4aik7XHJcbiAgICAgIFkucHVzaCh5aik7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gTWluIG1heFxyXG4gICAgbGV0IG1pblggPSBNYXRoLm1pbiguLi5YKTtcclxuICAgIGxldCBtaW5ZID0gTWF0aC5taW4oLi4uWSk7XHJcblxyXG4gICAgLy8gU3R5bGUgZm9yIGNhbnZhc1xyXG4gICAgZm9yIChjb25zdCBrZXkgaW4gY2FudmFzU3R5bGVzKSB7XHJcbiAgICAgIChjdHggYXMgYW55KVtrZXldID0gKGNhbnZhc1N0eWxlcyBhcyBhbnkpW2tleV07XHJcbiAgICB9XHJcbiAgICBjdHguZm9udCA9IGNhbnZhc1N0eWxlcz8uZm9udCA/PyBgMTVweCBzZXJpZmA7XHJcbiAgICBGSUxMX1RFWFRfTVVMVElfTElORShjdHgsIF9jb2RlLnZhbHVlLCBtaW5YLCBtaW5ZIC0gNSk7XHJcblxyXG4gICAgLy8gcG9seWdvbiBbeCx5LCB4LHksIHgseS4uLi4uXTtcclxuICAgIGNvbnN0IHBvbHlnb24gPSBbXTtcclxuICAgIGZvciAobGV0IGsgPSAwOyBrIDwgWC5sZW5ndGg7IGsrKykge1xyXG4gICAgICBwb2x5Z29uLnB1c2gobG9jW2B4JHtrICsgMX1gXSk7XHJcbiAgICAgIHBvbHlnb24ucHVzaChsb2NbYHkke2sgKyAxfWBdKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBDb3B5IGFycmF5XHJcbiAgICBjb25zdCBzaGFwZSA9IHBvbHlnb24uc2xpY2UoMCkgYXMgYW55O1xyXG5cclxuICAgIC8vIERyYXcgcG9seWdvblxyXG4gICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgY3R4Lm1vdmVUbyhzaGFwZS5zaGlmdCgpLCBzaGFwZS5zaGlmdCgpKTtcclxuICAgIHdoaWxlIChzaGFwZS5sZW5ndGgpIHtcclxuICAgICAgY3R4LmxpbmVUbyhzaGFwZS5zaGlmdCgpLCBzaGFwZS5zaGlmdCgpKTsgLy94LHlcclxuICAgIH1cclxuICAgIGN0eC5jbG9zZVBhdGgoKTtcclxuICAgIGN0eC5maWxsKCk7XHJcbiAgICBjdHguc3Ryb2tlKCk7XHJcbiAgfTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFJFQURfQVNfREFUQV9VUkxcclxuICogQHBhcmFtIGZpbGUgXHJcbiAqIEBwYXJhbSBjb25maWdzIFxyXG4gKiBAcmV0dXJucyBcclxuICovXHJcbmV4cG9ydCBjb25zdCBSRUFEX0FTX0RBVEFfVVJMID0gKGZpbGU6IEZpbGUsIGNvbmZpZ3M6IFNjYW5uZXJRUkNvZGVDb25maWcpOiBQcm9taXNlPFNjYW5uZXJRUkNvZGVTZWxlY3RlZEZpbGVzPiA9PiB7XHJcbiAgLyoqIG92ZXJyaWRlcyAqKi9cclxuICBsZXQgZGVjb2RlID0gY29uZmlncz8uZGVjb2RlID8/IENPTkZJR19ERUZBVUxULmRlY29kZTtcclxuICBsZXQgY2FudmFzU3R5bGVzID0gY29uZmlncz8uY2FudmFzU3R5bGVzID8/IENPTkZJR19ERUZBVUxULmNhbnZhc1N0eWxlcztcclxuICBsZXQgaXNCZWVwID0gY29uZmlncz8uaXNCZWVwID8/IENPTkZJR19ERUZBVUxULmlzQmVlcDtcclxuXHJcbiAgLyoqIGRyYXdJbWFnZSAqKi9cclxuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgY29uc3QgZmlsZVJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XHJcbiAgICBmaWxlUmVhZGVyLm9ubG9hZCA9ICgpID0+IHtcclxuICAgICAgY29uc3Qgb2JqZWN0RmlsZSA9IHtcclxuICAgICAgICBuYW1lOiBmaWxlLm5hbWUsXHJcbiAgICAgICAgZmlsZTogZmlsZSxcclxuICAgICAgICB1cmw6IFVSTC5jcmVhdGVPYmplY3RVUkwoZmlsZSlcclxuICAgICAgfTtcclxuICAgICAgLy8gU2V0IHRoZSBzcmMgb2YgdGhpcyBJbWFnZSBvYmplY3QuXHJcbiAgICAgIGNvbnN0IGltYWdlID0gbmV3IEltYWdlKCk7XHJcbiAgICAgIC8vIFNldHRpbmcgY3Jvc3Mgb3JpZ2luIHZhbHVlIHRvIGFub255bW91c1xyXG4gICAgICBpbWFnZS5zZXRBdHRyaWJ1dGUoJ2Nyb3NzT3JpZ2luJywgJ2Fub255bW91cycpO1xyXG4gICAgICAvLyBXaGVuIG91ciBpbWFnZSBoYXMgbG9hZGVkLlxyXG4gICAgICBpbWFnZS5vbmxvYWQgPSBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgLy8gR2V0IHRoZSBjYW52YXMgZWxlbWVudCBieSB1c2luZyB0aGUgZ2V0RWxlbWVudEJ5SWQgbWV0aG9kLlxyXG4gICAgICAgIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xyXG4gICAgICAgIC8vIEhUTUxJbWFnZUVsZW1lbnQgc2l6ZVxyXG4gICAgICAgIGNhbnZhcy53aWR0aCA9IGltYWdlLm5hdHVyYWxXaWR0aCB8fCBpbWFnZS53aWR0aDtcclxuICAgICAgICBjYW52YXMuaGVpZ2h0ID0gaW1hZ2UubmF0dXJhbEhlaWdodCB8fCBpbWFnZS5oZWlnaHQ7XHJcbiAgICAgICAgLy8gR2V0IGEgMkQgZHJhd2luZyBjb250ZXh0IGZvciB0aGUgY2FudmFzLlxyXG4gICAgICAgIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpIGFzIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcclxuICAgICAgICAvLyBEcmF3IGltYWdlXHJcbiAgICAgICAgY3R4LmRyYXdJbWFnZShpbWFnZSwgMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcclxuICAgICAgICAvLyBEYXRhIGltYWdlXHJcbiAgICAgICAgY29uc3QgaW1hZ2VEYXRhID0gY3R4LmdldEltYWdlRGF0YSgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xyXG4gICAgICAgIC8vIFNjYW5uZXJcclxuICAgICAgICBpZiAoJ3piYXJXYXNtJyBpbiB3aW5kb3cpIHtcclxuICAgICAgICAgIGNvbnN0IGNvZGUgPSBhd2FpdCB6YmFyV2FzbS5zY2FuSW1hZ2VEYXRhKGltYWdlRGF0YSk7XHJcbiAgICAgICAgICBpZiAoY29kZT8ubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIC8vIERlY29kZVxyXG4gICAgICAgICAgICBjb2RlLmZvckVhY2goKHM6IGFueSkgPT4gcy52YWx1ZSA9IHMuZGVjb2RlKGRlY29kZT8udG9Mb2NhbGVMb3dlckNhc2UoKSkpO1xyXG5cclxuICAgICAgICAgICAgLy8gT3ZlcmxheVxyXG4gICAgICAgICAgICBEUkFXX1JFU1VMVF9PTl9DQU5WQVMoY29kZSwgY2FudmFzLCBjYW52YXNTdHlsZXMpO1xyXG5cclxuICAgICAgICAgICAgLy8gRW1pdCBvYmplY3RcclxuICAgICAgICAgICAgY29uc3QgYmxvYiA9IGF3YWl0IENBTlZBU19UT19CTE9CKGNhbnZhcyk7XHJcbiAgICAgICAgICAgIGNvbnN0IHVybCA9IFVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYik7XHJcbiAgICAgICAgICAgIGNvbnN0IGJsb2JUb0ZpbGUgPSAodGhlQmxvYjogYW55LCBmaWxlTmFtZTogc3RyaW5nKSA9PiBuZXcgRmlsZShbdGhlQmxvYl0sIGZpbGVOYW1lLCB7IGxhc3RNb2RpZmllZDogbmV3IERhdGUoKS5nZXRUaW1lKCksIHR5cGU6IHRoZUJsb2IudHlwZSB9KTtcclxuICAgICAgICAgICAgcmVzb2x2ZShPYmplY3QuYXNzaWduKHt9LCBvYmplY3RGaWxlLCB7IGRhdGE6IGNvZGUsIHVybDogdXJsLCBjYW52YXM6IGNhbnZhcywgZmlsZTogYmxvYlRvRmlsZShibG9iLCBvYmplY3RGaWxlLm5hbWUpIH0pKTtcclxuXHJcbiAgICAgICAgICAgIFBMQVlfQVVESU8oaXNCZWVwKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJlc29sdmUoT2JqZWN0LmFzc2lnbih7fSwgb2JqZWN0RmlsZSwgeyBkYXRhOiBjb2RlLCBjYW52YXM6IGNhbnZhcyB9KSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9O1xyXG4gICAgICAvLyBTZXQgc3JjXHJcbiAgICAgIGltYWdlLnNyYyA9IG9iamVjdEZpbGUudXJsO1xyXG4gICAgfVxyXG4gICAgZmlsZVJlYWRlci5vbmVycm9yID0gKGVycm9yOiBhbnkpID0+IHJlamVjdChlcnJvcik7XHJcbiAgICBmaWxlUmVhZGVyLnJlYWRBc0RhdGFVUkwoZmlsZSk7XHJcbiAgfSlcclxufVxyXG5cclxuLyoqXHJcbiAqIENvbnZlcnQgY2FudmFzIHRvIGJsb2JcclxuICogY2FudmFzLnRvQmxvYigoYmxvYikgPT4geyAuLiB9LCAnaW1hZ2UvanBlZycsIDAuOTUpOyAvLyBKUEVHIGF0IDk1JSBxdWFsaXR5XHJcbiAqIEBwYXJhbSBjYW52YXMgXHJcbiAqIEBwYXJhbSB0eXBlIFxyXG4gKiBAcmV0dXJucyBcclxuICovXHJcbmV4cG9ydCBjb25zdCBDQU5WQVNfVE9fQkxPQiA9IChjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50LCB0eXBlPzogc3RyaW5nKTogUHJvbWlzZTxhbnk+ID0+IHtcclxuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4gY2FudmFzLnRvQmxvYihibG9iID0+IHJlc29sdmUoYmxvYiksIHR5cGUpKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIENvbnZlcnQgYmxvYiB0byBmaWxlXHJcbiAqIEBwYXJhbSB0aGVCbG9iIFxyXG4gKiBAcGFyYW0gZmlsZU5hbWUgXHJcbiAqIEByZXR1cm5zIFxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IEJMT0JfVE9fRklMRSA9ICh0aGVCbG9iOiBhbnksIGZpbGVOYW1lOiBzdHJpbmcpOiBGaWxlID0+IHtcclxuICByZXR1cm4gbmV3IEZpbGUoW3RoZUJsb2JdLCBmaWxlTmFtZSwgeyBsYXN0TW9kaWZpZWQ6IG5ldyBEYXRlKCkuZ2V0VGltZSgpLCB0eXBlOiB0aGVCbG9iLnR5cGUgfSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBGSUxFU19UT19TQ0FOXHJcbiAqIEBwYXJhbSBmaWxlcyBcclxuICogQHBhcmFtIGNvbmZpZ3MgXHJcbiAqIEBwYXJhbSBxdWFsaXR5IFxyXG4gKiBAcGFyYW0gdHlwZSBcclxuICogQHBhcmFtIGFzIFxyXG4gKiBAcmV0dXJucyBcclxuICovXHJcbmV4cG9ydCBjb25zdCBGSUxFU19UT19TQ0FOID0gKGZpbGVzOiBGaWxlW10gPSBbXSwgY29uZmlnczogU2Nhbm5lclFSQ29kZUNvbmZpZywgcXVhbGl0eT86IG51bWJlciwgdHlwZT86IHN0cmluZywgYXMgPSBuZXcgQXN5bmNTdWJqZWN0PFNjYW5uZXJRUkNvZGVTZWxlY3RlZEZpbGVzW10+KCkpOiBBc3luY1N1YmplY3Q8U2Nhbm5lclFSQ29kZVNlbGVjdGVkRmlsZXNbXT4gPT4ge1xyXG4gIENPTVBSRVNTX0lNQUdFX0ZJTEUoZmlsZXMsIHF1YWxpdHksIHR5cGUpLnRoZW4oKF9maWxlczogYW55KSA9PiB7XHJcbiAgICBQcm9taXNlLmFsbChPYmplY3QuYXNzaWduKFtdLCBmaWxlcykubWFwKG0gPT4gUkVBRF9BU19EQVRBX1VSTChtLCBjb25maWdzKSkpLnRoZW4oKGltZzogU2Nhbm5lclFSQ29kZVNlbGVjdGVkRmlsZXNbXSkgPT4ge1xyXG4gICAgICBBU19DT01QTEVURShhcywgaW1nKTtcclxuICAgIH0pLmNhdGNoKChlcnJvcjogYW55KSA9PiBBU19DT01QTEVURShhcywgbnVsbCwgZXJyb3IpKTtcclxuICB9KTtcclxuICByZXR1cm4gYXM7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBGSUxMX1RFWFRfTVVMVElfTElORVxyXG4gKiBAcGFyYW0gY3R4IFxyXG4gKiBAcGFyYW0gdGV4dCBcclxuICogQHBhcmFtIHggXHJcbiAqIEBwYXJhbSB5IFxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IEZJTExfVEVYVF9NVUxUSV9MSU5FID0gKGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCB0ZXh0OiBzdHJpbmcsIHg6IG51bWJlciwgeTogbnVtYmVyKSA9PiB7XHJcbiAgbGV0IGxpbmVIZWlnaHQgPSBjdHgubWVhc3VyZVRleHQoXCJNXCIpLndpZHRoICogMS4yO1xyXG4gIGxldCBsaW5lcyA9IHRleHQuc3BsaXQoXCJcXG5cIik7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaW5lcy5sZW5ndGg7ICsraSkge1xyXG4gICAgY3R4LmZpbGxUZXh0KGxpbmVzW2ldLCB4LCB5KTtcclxuICAgIGN0eC5zdHJva2VUZXh0KGxpbmVzW2ldLCB4LCB5KTtcclxuICAgIHkgKz0gbGluZUhlaWdodDtcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBRERfSlNfVE9fRUxFTUVOVFxyXG4gKiBAcGFyYW0gYXMgXHJcbiAqIEBwYXJhbSByZW5kZXJlciBcclxuICogQHJldHVybnMgXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgQUREX0pTX1RPX0VMRU1FTlQgPSAoYXM6IEFzeW5jU3ViamVjdDxib29sZWFuPiwgcmVuZGVyZXI6IFJlbmRlcmVyMik6IEFzeW5jU3ViamVjdDxib29sZWFuPiA9PiB7XHJcbiAgY29uc3QgUiA9ICgpID0+IHtcclxuICAgIGxldCB0aW1lb3V0SWQ6IGFueTtcclxuICAgIGNvbnN0IEwgPSAoKSA9PiB7XHJcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0SWQpO1xyXG4gICAgICBXQVNNX1JFQURZKCkgPyBzZXRUaW1lb3V0KCgpID0+IEFTX0NPTVBMRVRFKGFzLCB0cnVlKSkgOiB0aW1lb3V0SWQgPSBzZXRUaW1lb3V0KCgpID0+IEwoKSk7XHJcbiAgICB9XHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IEwoKSk7XHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IGNsZWFyVGltZW91dCh0aW1lb3V0SWQpLCAzMDAwKTtcclxuICB9XHJcbiAgY29uc3Qgc2NyaXB0UmVtb3RlID0gKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYHNjcmlwdFtzcmM9XCIke1dBU01SRU1PVEV9XCJdYCkgYXMgYW55IGFzIEFycmF5PEhUTUxFbGVtZW50Pik7XHJcbiAgY29uc3Qgc2NyaXB0UmVtb3RlTGF0ZXN0ID0gKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYHNjcmlwdFtzcmM9XCIke1dBU01SRU1PVEVMQVRFU1R9XCJdYCkgYXMgYW55IGFzIEFycmF5PEhUTUxFbGVtZW50Pik7XHJcbiAgaWYgKHNjcmlwdFJlbW90ZS5sZW5ndGggfHwgc2NyaXB0UmVtb3RlTGF0ZXN0Lmxlbmd0aCkge1xyXG4gICAgUigpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBjb25zdCBzY3JpcHRQcm9qZWN0ID0gKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYHNjcmlwdFtzcmM9XCIke1dBU01QUk9KRUNUfVwiXWApIGFzIGFueSBhcyBBcnJheTxIVE1MRWxlbWVudD4pO1xyXG4gICAgaWYgKHNjcmlwdFByb2plY3QubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgIFIoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHNjcmlwdFByb2plY3QuZm9yRWFjaChmID0+IGYucmVtb3ZlKCkpO1xyXG4gICAgICBjb25zdCBzY3JpcHQgPSByZW5kZXJlci5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpIGFzIEhUTUxTY3JpcHRFbGVtZW50O1xyXG4gICAgICByZW5kZXJlci5zZXRBdHRyaWJ1dGUoc2NyaXB0LCBcInR5cGVcIiwgXCJ0ZXh0L2phdmFzY3JpcHRcIik7XHJcbiAgICAgIHJlbmRlcmVyLnNldEF0dHJpYnV0ZShzY3JpcHQsIFwic3JjXCIsIFdBU01QUk9KRUNUKTtcclxuICAgICAgcmVuZGVyZXIuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuYm9keSwgc2NyaXB0KTtcclxuICAgICAgc2NyaXB0Lm9ubG9hZCA9ICgpID0+IFIoKTtcclxuICAgICAgc2NyaXB0Lm9uZXJyb3IgPSAoKSA9PiBBU19DT01QTEVURShhcywgZmFsc2UsICdDb3VsZCBub3QgbG9hZCBzY3JpcHQgJyArIFdBU01QUk9KRUNUKTtcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIGFzO1xyXG59XHJcblxyXG4vKipcclxuICogQ09NUFJFU1NfSU1BR0VfRklMRVxyXG4gKiBAcGFyYW0gZmlsZXMgXHJcbiAqIEBwYXJhbSBxdWFsaXR5IFxyXG4gKiBAcGFyYW0gdHlwZSBcclxuICogQHJldHVybnMgXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgQ09NUFJFU1NfSU1BR0VfRklMRSA9IGFzeW5jIChmaWxlczogRmlsZVtdLCBxdWFsaXR5ID0gMC41LCB0eXBlID0gXCJpbWFnZS9qcGVnXCIpID0+IHtcclxuICAvLyBObyBmaWxlcyBzZWxlY3RlZFxyXG4gIGlmICghZmlsZXMubGVuZ3RoIHx8IHF1YWxpdHkgPT09IDEpIHJldHVybiBmaWxlcztcclxuXHJcbiAgY29uc3QgY29tcHJlc3NJbWFnZSA9IGFzeW5jIChmaWxlOiBGaWxlKTogUHJvbWlzZTxGaWxlPiA9PiB7XHJcbiAgICAvLyBHZXQgYXMgaW1hZ2UgZGF0YVxyXG4gICAgY29uc3QgaW1hZ2VCaXRtYXAgPSBhd2FpdCBjcmVhdGVJbWFnZUJpdG1hcChmaWxlKTtcclxuXHJcbiAgICAvLyBEcmF3IHRvIGNhbnZhc1xyXG4gICAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XHJcbiAgICBjYW52YXMud2lkdGggPSBpbWFnZUJpdG1hcC53aWR0aDtcclxuICAgIGNhbnZhcy5oZWlnaHQgPSBpbWFnZUJpdG1hcC5oZWlnaHQ7XHJcbiAgICBjb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgIChjdHggYXMgYW55KS5kcmF3SW1hZ2UoaW1hZ2VCaXRtYXAsIDAsIDApO1xyXG5cclxuICAgIC8vIFR1cm4gaW50byBCbG9iXHJcbiAgICBjb25zdCBibG9iID0gYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+XHJcbiAgICAgIGNhbnZhcy50b0Jsb2IocmVzb2x2ZSwgdHlwZSwgcXVhbGl0eSlcclxuICAgICkgYXMgYW55O1xyXG5cclxuICAgIC8vIFR1cm4gQmxvYiBpbnRvIEZpbGVcclxuICAgIHJldHVybiBuZXcgRmlsZShbYmxvYl0sIGZpbGUubmFtZSwge1xyXG4gICAgICB0eXBlOiBibG9iLnR5cGUsXHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICAvLyBXZSdsbCBzdG9yZSB0aGUgZmlsZXMgaW4gdGhpcyBkYXRhIHRyYW5zZmVyIG9iamVjdFxyXG4gIGNvbnN0IGRhdGFUcmFuc2ZlciA9IG5ldyBEYXRhVHJhbnNmZXIoKTtcclxuXHJcbiAgLy8gRm9yIGV2ZXJ5IGZpbGUgaW4gdGhlIGZpbGVzIGxpc3RcclxuICBhd2FpdCAoYXN5bmMgKCkgPT4ge1xyXG4gICAgZm9yIChjb25zdCBmaWxlIG9mIGZpbGVzKSB7XHJcbiAgICAgIC8vIFdlIGRvbid0IGhhdmUgdG8gY29tcHJlc3MgZmlsZXMgdGhhdCBhcmVuJ3QgaW1hZ2VzXHJcbiAgICAgIGlmICghZmlsZS50eXBlLnN0YXJ0c1dpdGgoJ2ltYWdlJykpIHtcclxuICAgICAgICAvLyBJZ25vcmUgdGhpcyBmaWxlLCBidXQgZG8gYWRkIGl0IHRvIG91ciByZXN1bHRcclxuICAgICAgICBkYXRhVHJhbnNmZXIuaXRlbXMuYWRkKGZpbGUpO1xyXG4gICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBXZSBjb21wcmVzcyB0aGUgZmlsZSBieSA1MCVcclxuICAgICAgY29uc3QgY29tcHJlc3NlZEZpbGUgPSBhd2FpdCBjb21wcmVzc0ltYWdlKGZpbGUpO1xyXG5cclxuICAgICAgLy8gU2F2ZSBiYWNrIHRoZSBjb21wcmVzc2VkIGZpbGUgaW5zdGVhZCBvZiB0aGUgb3JpZ2luYWwgZmlsZVxyXG4gICAgICBkYXRhVHJhbnNmZXIuaXRlbXMuYWRkKGNvbXByZXNzZWRGaWxlKTtcclxuICAgIH1cclxuICB9KSgpO1xyXG5cclxuICAvLyByZXR1cm4gdmFsdWUgbmV3IGZpbGVzIGxpc3RcclxuICByZXR1cm4gZGF0YVRyYW5zZmVyLmZpbGVzO1xyXG59XHJcblxyXG4vKipcclxuICogUkVNT1ZFX1JFU1VMVF9QQU5FTFxyXG4gKiBAcGFyYW0gZWxlbWVudCBcclxuICovXHJcbmV4cG9ydCBjb25zdCBSRU1PVkVfUkVTVUxUX1BBTkVMID0gKGVsZW1lbnQ6IEhUTUxFbGVtZW50KSA9PiB7XHJcbiAgLy8gY2xlYXIgdGV4dCByZXN1bHQgYW5kIHRvb2x0aXBcclxuICBPYmplY3QuYXNzaWduKFtdLCBlbGVtZW50LmNoaWxkTm9kZXMpLmZvckVhY2goZWwgPT4gZWxlbWVudC5yZW1vdmVDaGlsZChlbCkpO1xyXG59XHJcblxyXG4vKipcclxuICogUkVTRVRfQ0FOVkFTXHJcbiAqIEBwYXJhbSBjYW52YXMgXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgUkVTRVRfQ0FOVkFTID0gKGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQpID0+IHtcclxuICAvLyByZXNldCBjYW52YXNcclxuICBjb25zdCBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJywgeyB3aWxsUmVhZEZyZXF1ZW50bHk6IHRydWUgfSkgYXMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xyXG4gIC8vIGNsZWFyIGZyYW1lIHdoZW4gcmVsb29wXHJcbiAgY29udGV4dC5jbGVhclJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFVQREFURV9XSURUSF9IRUlHSFRfVklERU9cclxuICogQHBhcmFtIHZpZGVvIFxyXG4gKiBAcGFyYW0gY2FudmFzIFxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IFVQREFURV9XSURUSF9IRUlHSFRfVklERU8gPSAodmlkZW86IEhUTUxWaWRlb0VsZW1lbnQsIGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQpOiB2b2lkID0+IHtcclxuICB2aWRlby5zdHlsZS53aWR0aCA9IGNhbnZhcy5vZmZzZXRXaWR0aCArICdweCc7XHJcbiAgdmlkZW8uc3R5bGUuaGVpZ2h0ID0gY2FudmFzLm9mZnNldEhlaWdodCArICdweCc7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBWSUJSQVRFXHJcbiAqIEBwYXJhbSB0aW1lIFxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IFZJQlJBVEUgPSAodGltZTogbnVtYmVyID0gMzAwKSA9PiB7XHJcbiAgdGltZSAmJiBJU19NT0JJTEUoKSAmJiB3aW5kb3c/Lm5hdmlnYXRvcj8udmlicmF0ZSh0aW1lKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBJU19NT0JJTEVcclxuICogQHJldHVybnMgXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgSVNfTU9CSUxFID0gKCkgPT4ge1xyXG4gIGNvbnN0IHZlbmRvciA9IG5hdmlnYXRvci51c2VyQWdlbnQgfHwgbmF2aWdhdG9yWyd2ZW5kb3InXSB8fCAod2luZG93IGFzIGFueSlbJ29wZXJhJ107XHJcbiAgY29uc3QgcGhvbmUgPSAvKGFuZHJvaWR8YmJcXGQrfG1lZWdvKS4rbW9iaWxlfGF2YW50Z298YmFkYVxcL3xibGFja2JlcnJ5fGJsYXplcnxjb21wYWx8ZWxhaW5lfGZlbm5lY3xoaXB0b3B8aWVtb2JpbGV8aXAoaG9uZXxvZCl8aXJpc3xraW5kbGV8bGdlIHxtYWVtb3xtaWRwfG1tcHxtb2JpbGUuK2ZpcmVmb3h8bmV0ZnJvbnR8b3BlcmEgbShvYnxpbilpfHBhbG0oIG9zKT98cGhvbmV8cChpeGl8cmUpXFwvfHBsdWNrZXJ8cG9ja2V0fHBzcHxzZXJpZXMoNHw2KTB8c3ltYmlhbnx0cmVvfHVwXFwuKGJyb3dzZXJ8bGluayl8dm9kYWZvbmV8d2FwfHdpbmRvd3MgY2V8eGRhfHhpaW5vfGFuZHJvaWR8aXBhZHxwbGF5Ym9va3xzaWxrL2k7XHJcbiAgY29uc3QgdmVyc2lvbiA9IC8xMjA3fDYzMTB8NjU5MHwzZ3NvfDR0aHB8NTBbMS02XWl8Nzcwc3w4MDJzfGEgd2F8YWJhY3xhYyhlcnxvb3xzLSl8YWkoa298cm4pfGFsKGF2fGNhfGNvKXxhbW9pfGFuKGV4fG55fHl3KXxhcHR1fGFyKGNofGdvKXxhcyh0ZXx1cyl8YXR0d3xhdShkaXwtbXxyIHxzICl8YXZhbnxiZShja3xsbHxucSl8YmkobGJ8cmQpfGJsKGFjfGF6KXxicihlfHYpd3xidW1ifGJ3LShufHUpfGM1NVxcL3xjYXBpfGNjd2F8Y2RtLXxjZWxsfGNodG18Y2xkY3xjbWQtfGNvKG1wfG5kKXxjcmF3fGRhKGl0fGxsfG5nKXxkYnRlfGRjLXN8ZGV2aXxkaWNhfGRtb2J8ZG8oY3xwKW98ZHMoMTJ8LWQpfGVsKDQ5fGFpKXxlbShsMnx1bCl8ZXIoaWN8azApfGVzbDh8ZXooWzQtN10wfG9zfHdhfHplKXxmZXRjfGZseSgtfF8pfGcxIHV8ZzU2MHxnZW5lfGdmLTV8Zy1tb3xnbyhcXC53fG9kKXxncihhZHx1bil8aGFpZXxoY2l0fGhkLShtfHB8dCl8aGVpLXxoaShwdHx0YSl8aHAoIGl8aXApfGhzLWN8aHQoYygtfCB8X3xhfGd8cHxzfHQpfHRwKXxodShhd3x0Yyl8aS0oMjB8Z298bWEpfGkyMzB8aWFjKCB8LXxcXC8pfGlicm98aWRlYXxpZzAxfGlrb218aW0xa3xpbm5vfGlwYXF8aXJpc3xqYSh0fHYpYXxqYnJvfGplbXV8amlnc3xrZGRpfGtlaml8a2d0KCB8XFwvKXxrbG9ufGtwdCB8a3djLXxreW8oY3xrKXxsZShub3x4aSl8bGcoIGd8XFwvKGt8bHx1KXw1MHw1NHwtW2Etd10pfGxpYnd8bHlueHxtMS13fG0zZ2F8bTUwXFwvfG1hKHRlfHVpfHhvKXxtYygwMXwyMXxjYSl8bS1jcnxtZShyY3xyaSl8bWkobzh8b2F8dHMpfG1tZWZ8bW8oMDF8MDJ8Yml8ZGV8ZG98dCgtfCB8b3x2KXx6eil8bXQoNTB8cDF8diApfG13YnB8bXl3YXxuMTBbMC0yXXxuMjBbMi0zXXxuMzAoMHwyKXxuNTAoMHwyfDUpfG43KDAoMHwxKXwxMCl8bmUoKGN8bSktfG9ufHRmfHdmfHdnfHd0KXxub2soNnxpKXxuenBofG8yaW18b3AodGl8d3YpfG9yYW58b3dnMXxwODAwfHBhbihhfGR8dCl8cGR4Z3xwZygxM3wtKFsxLThdfGMpKXxwaGlsfHBpcmV8cGwoYXl8dWMpfHBuLTJ8cG8oY2t8cnR8c2UpfHByb3h8cHNpb3xwdC1nfHFhLWF8cWMoMDd8MTJ8MjF8MzJ8NjB8LVsyLTddfGktKXxxdGVrfHIzODB8cjYwMHxyYWtzfHJpbTl8cm8odmV8em8pfHM1NVxcL3xzYShnZXxtYXxtbXxtc3xueXx2YSl8c2MoMDF8aC18b298cC0pfHNka1xcL3xzZShjKC18MHwxKXw0N3xtY3xuZHxyaSl8c2doLXxzaGFyfHNpZSgtfG0pfHNrLTB8c2woNDV8aWQpfHNtKGFsfGFyfGIzfGl0fHQ1KXxzbyhmdHxueSl8c3AoMDF8aC18di18diApfHN5KDAxfG1iKXx0MigxOHw1MCl8dDYoMDB8MTB8MTgpfHRhKGd0fGxrKXx0Y2wtfHRkZy18dGVsKGl8bSl8dGltLXx0LW1vfHRvKHBsfHNoKXx0cyg3MHxtLXxtM3xtNSl8dHgtOXx1cChcXC5ifGcxfHNpKXx1dHN0fHY0MDB8djc1MHx2ZXJpfHZpKHJnfHRlKXx2ayg0MHw1WzAtM118LXYpfHZtNDB8dm9kYXx2dWxjfHZ4KDUyfDUzfDYwfDYxfDcwfDgwfDgxfDgzfDg1fDk4KXx3M2MoLXwgKXx3ZWJjfHdoaXR8d2koZyB8bmN8bncpfHdtbGJ8d29udXx4NzAwfHlhcy18eW91cnx6ZXRvfHp0ZS0vaTtcclxuICBjb25zdCBpc1NhZmFyaSA9IC9eKCg/IWNocm9tZXxhbmRyb2lkKS4pKnNhZmFyaS9pO1xyXG4gIHJldHVybiAhIShwaG9uZS50ZXN0KHZlbmRvcikgfHwgdmVyc2lvbi50ZXN0KHZlbmRvci5zdWJzdHIoMCwgNCkpKSAmJiAhaXNTYWZhcmkudGVzdCh2ZW5kb3IpO1xyXG59O1xyXG4iXX0=