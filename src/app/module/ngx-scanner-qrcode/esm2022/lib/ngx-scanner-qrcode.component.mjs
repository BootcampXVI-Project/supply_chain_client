import { Component, EventEmitter, ViewChild, ViewEncapsulation } from '@angular/core';
import { AsyncSubject, BehaviorSubject } from 'rxjs';
import { CONFIG_DEFAULT, MEDIA_STREAM_DEFAULT } from './ngx-scanner-qrcode.default';
import { ADD_JS_TO_ELEMENT, AS_COMPLETE, BLOB_TO_FILE, CANVAS_TO_BLOB, DRAW_RESULT_APPEND_CHILD, FILES_TO_SCAN, OVERRIDES, PLAY_AUDIO, REMOVE_RESULT_PANEL, RESET_CANVAS, UPDATE_WIDTH_HEIGHT_VIDEO, VIBRATE, WASM_READY } from './ngx-scanner-qrcode.helper';
import * as i0 from "@angular/core";
class NgxScannerQrcodeComponent {
    constructor(renderer) {
        this.renderer = renderer;
        /**
         * EventEmitter
         */
        this.event = new EventEmitter();
        /**
         * Input
         */
        this.src = CONFIG_DEFAULT.src;
        this.fps = CONFIG_DEFAULT.fps;
        this.vibrate = CONFIG_DEFAULT.vibrate;
        this.decode = CONFIG_DEFAULT.decode;
        this.isBeep = CONFIG_DEFAULT.isBeep;
        this.config = CONFIG_DEFAULT;
        this.constraints = CONFIG_DEFAULT.constraints;
        this.canvasStyles = CONFIG_DEFAULT.canvasStyles;
        /**
         * Export
        */
        this.isStart = false;
        this.isPause = false;
        this.isLoading = false;
        this.isTorch = false;
        this.data = new BehaviorSubject([]);
        this.devices = new BehaviorSubject([]);
        this.deviceIndexActive = 0;
        this.dataForResize = [];
        this.ready = new AsyncSubject();
        this.STATUS = {
            startON: () => this.isStart = true,
            pauseON: () => this.isPause = true,
            loadingON: () => this.isLoading = true,
            startOFF: () => this.isStart = false,
            pauseOFF: () => this.isPause = false,
            loadingOFF: () => this.isLoading = false,
            torchOFF: () => this.isTorch = false,
        };
    }
    ngOnInit() {
        this.overrideConfig();
        ADD_JS_TO_ELEMENT(this.ready, this.renderer).subscribe(() => {
            if (this.src) {
                this.loadImage(this.src);
            }
            this.resize();
        });
    }
    /**
     * start
     * @param playDeviceCustom
     * @returns
     */
    start(playDeviceCustom) {
        const as = new AsyncSubject();
        if (this.isStart) {
            // Reject
            AS_COMPLETE(as, false);
        }
        else {
            // fix safari
            this.safariWebRTC(as, playDeviceCustom);
        }
        return as;
    }
    /**
     * stop
     * @returns
     */
    stop() {
        this.STATUS.pauseOFF();
        this.STATUS.startOFF();
        this.STATUS.torchOFF();
        this.STATUS.loadingOFF();
        const as = new AsyncSubject();
        try {
            clearTimeout(this.rAF_ID);
            this.video.nativeElement.srcObject.getTracks().forEach((track) => {
                track.stop();
                AS_COMPLETE(as, true);
            });
            this.dataForResize = [];
            RESET_CANVAS(this.canvas.nativeElement);
            REMOVE_RESULT_PANEL(this.resultsPanel.nativeElement);
        }
        catch (error) {
            AS_COMPLETE(as, false, error);
        }
        return as;
    }
    /**
     * play
     * @returns
     */
    play() {
        const as = new AsyncSubject();
        if (this.isPause) {
            this.video.nativeElement.play();
            this.STATUS.pauseOFF();
            this.requestAnimationFrame(100);
            AS_COMPLETE(as, true);
        }
        else {
            AS_COMPLETE(as, false);
        }
        return as;
    }
    /**
     * pause
     * @returns
     */
    pause() {
        const as = new AsyncSubject();
        if (this.isStart) {
            clearTimeout(this.rAF_ID);
            this.video.nativeElement.pause();
            this.STATUS.pauseON();
            AS_COMPLETE(as, true);
        }
        else {
            AS_COMPLETE(as, false);
        }
        return as;
    }
    /**
     * playDevice
     * @param deviceId
     * @param as
     * @returns
     */
    playDevice(deviceId, as = new AsyncSubject()) {
        const constraints = this.getConstraints();
        const existDeviceId = (this.isStart && constraints) ? constraints.deviceId !== deviceId : true;
        switch (true) {
            case deviceId === 'null' || deviceId === 'undefined' || !deviceId:
                stop();
                this.stop();
                AS_COMPLETE(as, false);
                break;
            case deviceId && existDeviceId:
                stop();
                this.stop();
                // Loading on
                this.STATUS.loadingON();
                this.deviceIndexActive = this.devices.value.findIndex((f) => f.deviceId === deviceId);
                const constraints = { ...this.constraints, audio: false, video: { deviceId: deviceId, ...this.constraints.video } };
                // MediaStream
                navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
                    this.video.nativeElement.srcObject = stream;
                    this.video.nativeElement.onloadedmetadata = () => {
                        this.video.nativeElement.play();
                        this.requestAnimationFrame();
                        AS_COMPLETE(as, true);
                        this.STATUS.startON();
                        this.STATUS.loadingOFF();
                    };
                }).catch((error) => {
                    this.eventEmit(false);
                    AS_COMPLETE(as, false, error);
                    this.STATUS.startOFF();
                    this.STATUS.loadingOFF();
                });
                break;
            default:
                AS_COMPLETE(as, false);
                this.STATUS.loadingOFF();
                break;
        }
        return as;
    }
    /**
     * loadImage
     * @param src
     * @returns
     */
    loadImage(src) {
        const as = new AsyncSubject();
        // Loading on
        this.STATUS.startOFF();
        this.STATUS.loadingON();
        // Set the src of this Image object.
        const image = new Image();
        // Setting cross origin value to anonymous
        image.setAttribute('crossOrigin', 'anonymous');
        // When our image has loaded.
        image.onload = () => {
            WASM_READY() && this.drawImage(image, (flag) => {
                AS_COMPLETE(as, flag);
                this.STATUS.startOFF();
                this.STATUS.loadingOFF();
            });
        };
        // Set src
        image.src = src;
        return as;
    }
    /**
     * torcher
     * @returns
     */
    torcher() {
        const as = this.applyConstraints({ advanced: [{ torch: this.isTorch }] });
        as.subscribe(() => false, () => this.isTorch = !this.isTorch);
        return as;
    }
    /**
     * applyConstraints
     * @param constraints
     * @param deviceIndex
     * @returns
     */
    applyConstraints(constraints, deviceIndex = 0) {
        const as = new AsyncSubject();
        const stream = this.video.nativeElement.srcObject;
        if (deviceIndex !== null || deviceIndex !== undefined || !Number.isNaN(deviceIndex)) {
            const videoTrack = stream.getVideoTracks()[deviceIndex];
            const imageCapture = new window.ImageCapture(videoTrack);
            imageCapture.getPhotoCapabilities().then(async () => {
                await videoTrack.applyConstraints(constraints);
                UPDATE_WIDTH_HEIGHT_VIDEO(this.video.nativeElement, this.canvas.nativeElement);
                AS_COMPLETE(as, true);
            }).catch((error) => {
                switch (error?.name) {
                    case 'NotFoundError':
                    case 'DevicesNotFoundError':
                        AS_COMPLETE(as, false, 'Required track is missing');
                        break;
                    case 'NotReadableError':
                    case 'TrackStartError':
                        AS_COMPLETE(as, false, 'Webcam or mic are already in use');
                        break;
                    case 'OverconstrainedError':
                    case 'ConstraintNotSatisfiedError':
                        AS_COMPLETE(as, false, 'Constraints can not be satisfied by avb. devices');
                        break;
                    case 'NotAllowedError':
                    case 'PermissionDeniedError':
                        AS_COMPLETE(as, false, 'Permission denied in browser');
                        break;
                    case 'TypeError':
                        AS_COMPLETE(as, false, 'Empty constraints object');
                        break;
                    default:
                        AS_COMPLETE(as, false, error);
                        break;
                }
            });
        }
        else {
            AS_COMPLETE(as, false, 'Please check again deviceIndex');
        }
        return as;
    }
    ;
    /**
     * getConstraints
     * @param deviceIndex
     * @returns
     */
    getConstraints(deviceIndex = 0) {
        const stream = this.video.nativeElement.srcObject;
        const videoTrack = stream?.getVideoTracks()[deviceIndex];
        return videoTrack?.getConstraints();
    }
    /**
     * download
     * @param fileName
     * @param quality
     * @param type
     * @returns
     */
    download(fileName = `ngx-scanner-qrcode-${Date.now()}.png`, quality, type) {
        const as = new AsyncSubject();
        (async () => {
            const blob = await CANVAS_TO_BLOB(this.canvas.nativeElement);
            const file = BLOB_TO_FILE(blob, fileName);
            FILES_TO_SCAN([file], this.config, quality, type, as).subscribe((res) => {
                res.forEach((item) => {
                    if (item?.data?.length) {
                        const link = document.createElement('a');
                        link.href = item.url;
                        link.download = item.name;
                        link.click();
                        link.remove();
                    }
                });
            });
        })();
        return as;
    }
    /**
     * resize
     */
    resize() {
        window.addEventListener("resize", () => {
            DRAW_RESULT_APPEND_CHILD(this.dataForResize, this.canvas.nativeElement, this.resultsPanel.nativeElement, this.canvasStyles);
            UPDATE_WIDTH_HEIGHT_VIDEO(this.video.nativeElement, this.canvas.nativeElement);
        });
    }
    /**
     * overrideConfig
     */
    overrideConfig() {
        if (this.config?.src)
            this.src = this.config.src;
        if (this.config?.fps)
            this.fps = this.config.fps;
        if (this.config?.vibrate)
            this.vibrate = this.config.vibrate;
        if (this.config?.decode)
            this.decode = this.config.decode;
        if (this.config?.isBeep)
            this.isBeep = this.config.isBeep;
        if (this.config?.constraints)
            this.constraints = OVERRIDES('constraints', this.config, MEDIA_STREAM_DEFAULT);
        if (this.config?.canvasStyles)
            this.canvasStyles = this.config.canvasStyles;
    }
    /**
     * safariWebRTC
     * Fix issue on safari
     * https://webrtchacks.com/guide-to-safari-webrtc
     * @param as
     * @param playDeviceCustom
     */
    safariWebRTC(as, playDeviceCustom) {
        // Loading on
        this.STATUS.startOFF();
        this.STATUS.loadingON();
        navigator.mediaDevices.getUserMedia(this.constraints).then((stream) => {
            stream.getTracks().forEach(track => track.stop());
            this.loadAllDevices(as, playDeviceCustom);
        }).catch((error) => {
            AS_COMPLETE(as, false, error);
            this.STATUS.startOFF();
            this.STATUS.loadingOFF();
        });
    }
    /**
     * loadAllDevices
     * @param as
     * @param playDeviceCustom
     */
    loadAllDevices(as, playDeviceCustom) {
        navigator.mediaDevices.enumerateDevices().then(devices => {
            let cameraDevices = devices.filter(f => f.kind == 'videoinput');
            this.devices.next(cameraDevices);
            if (cameraDevices?.length > 0) {
                AS_COMPLETE(as, cameraDevices);
                playDeviceCustom ? playDeviceCustom(cameraDevices) : this.playDevice(cameraDevices[0].deviceId);
            }
            else {
                AS_COMPLETE(as, false, 'No camera detected.');
                this.STATUS.startOFF();
                this.STATUS.loadingOFF();
            }
        }).catch((error) => {
            AS_COMPLETE(as, false, error);
            this.STATUS.startOFF();
            this.STATUS.loadingOFF();
        });
    }
    /**
     * drawImage
     * @param element
     * @param callback
     */
    async drawImage(element, callback = () => { }) {
        // Get the canvas element by using the getElementById method.
        const canvas = this.canvas.nativeElement;
        // Get a 2D drawing context for the canvas.
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        // HTMLImageElement size
        if (element instanceof HTMLImageElement) {
            canvas.width = element.naturalWidth;
            canvas.height = element.naturalHeight;
            element.style.visibility = '';
            this.video.nativeElement.style.visibility = 'hidden';
        }
        // HTMLVideoElement size
        if (element instanceof HTMLVideoElement) {
            canvas.width = element.videoWidth;
            canvas.height = element.videoHeight;
            element.style.visibility = '';
            this.canvas.nativeElement.style.visibility = 'hidden';
        }
        // Set width, height for video element
        UPDATE_WIDTH_HEIGHT_VIDEO(this.video.nativeElement, canvas);
        // clear frame
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Draw image
        ctx.drawImage(element, 0, 0, canvas.width, canvas.height);
        // Data image
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        // Draw frame
        const code = await zbarWasm.scanImageData(imageData);
        if (code?.length) {
            // Decode
            code.forEach((s) => s.value = s.decode(this.decode?.toLocaleLowerCase()));
            // Overlay
            DRAW_RESULT_APPEND_CHILD(code, Object.freeze(this.canvas.nativeElement), this.resultsPanel.nativeElement, this.canvasStyles);
            // To blob and emit data
            const EMIT_DATA = () => {
                this.eventEmit(code);
                this.dataForResize = code;
            };
            // HTMLImageElement
            if (element instanceof HTMLImageElement) {
                callback(true);
                EMIT_DATA();
                VIBRATE(this.vibrate);
                PLAY_AUDIO(this.isBeep);
            }
            // HTMLVideoElement
            if (element instanceof HTMLVideoElement) {
                EMIT_DATA();
                VIBRATE(this.vibrate);
                PLAY_AUDIO(this.isBeep);
            }
        }
        else {
            callback(false);
            REMOVE_RESULT_PANEL(this.resultsPanel.nativeElement);
            this.dataForResize = [];
        }
    }
    /**
     * eventEmit
     * @param response
     */
    eventEmit(response = false) {
        (response !== false) && this.data.next(response || []);
        (response !== false) && this.event.emit(response || []);
    }
    /**
     * Single-thread
     * Loop Recording on Camera
     * Must be destroy request
     * Not using: requestAnimationFrame
     * @param delay
     */
    requestAnimationFrame(delay = 0) {
        clearTimeout(this.rAF_ID);
        this.rAF_ID = setTimeout(() => {
            if (this.video.nativeElement.readyState === this.video.nativeElement.HAVE_ENOUGH_DATA) {
                delay = 0; // Appy first request
                WASM_READY() && this.drawImage(this.video.nativeElement);
                this.isStart && !this.isPause && this.requestAnimationFrame(delay);
            }
        }, /*avoid cache mediaStream*/ delay || this.fps);
    }
    /**
     * isReady
     */
    get isReady() {
        return this.ready;
    }
    ngOnDestroy() {
        this.pause();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.3", ngImport: i0, type: NgxScannerQrcodeComponent, deps: [{ token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.3", type: NgxScannerQrcodeComponent, selector: "ngx-scanner-qrcode", inputs: { src: "src", fps: "fps", vibrate: "vibrate", decode: "decode", isBeep: "isBeep", config: "config", constraints: "constraints", canvasStyles: "canvasStyles" }, outputs: { event: "event" }, host: { classAttribute: "ngx-scanner-qrcode" }, viewQueries: [{ propertyName: "video", first: true, predicate: ["video"], descendants: true }, { propertyName: "canvas", first: true, predicate: ["canvas"], descendants: true }, { propertyName: "resultsPanel", first: true, predicate: ["resultsPanel"], descendants: true }], exportAs: ["scanner"], ngImport: i0, template: `<div #resultsPanel class="origin-overlay"></div><canvas #canvas class="origin-canvas"></canvas><video #video playsinline class="origin-video"></video>`, isInline: true, styles: [".ngx-scanner-qrcode{display:block;position:relative}.origin-overlay{width:100%;position:absolute}.origin-overlay span{z-index:2;color:red;text-align:left;position:absolute}.origin-overlay .qrcode-polygon{z-index:1;position:absolute}.origin-canvas{width:100%;position:absolute}.origin-video{width:100%;background-color:#262626}.qrcode-tooltip{z-index:3;position:absolute}.qrcode-tooltip:hover .qrcode-tooltip-temp{display:block;position:absolute}.qrcode-tooltip-temp{bottom:0;left:50%;padding:5px;color:#fff;text-align:left;display:none;max-width:450px;border-radius:5px;width:max-content;word-wrap:break-word;transform:translate(-50%);transform-style:preserve-3d;background-color:#000000d0;box-shadow:1px 1px 20px #000000e0}.qrcode-tooltip-temp .qrcode-tooltip-clipboard{cursor:pointer;margin-left:5px;fill:#fff}.qrcode-tooltip-temp .qrcode-tooltip-clipboard:active{fill:#afafaf}\n"], encapsulation: i0.ViewEncapsulation.None }); }
}
export { NgxScannerQrcodeComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.3", ngImport: i0, type: NgxScannerQrcodeComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-scanner-qrcode', template: `<div #resultsPanel class="origin-overlay"></div><canvas #canvas class="origin-canvas"></canvas><video #video playsinline class="origin-video"></video>`, host: { 'class': 'ngx-scanner-qrcode' }, exportAs: 'scanner', inputs: ['src', 'fps', 'vibrate', 'decode', 'isBeep', 'config', 'constraints', 'canvasStyles'], outputs: ['event'], queries: {
                        video: new ViewChild('video'),
                        canvas: new ViewChild('canvas'),
                        resultsPanel: new ViewChild('resultsPanel')
                    }, encapsulation: ViewEncapsulation.None, styles: [".ngx-scanner-qrcode{display:block;position:relative}.origin-overlay{width:100%;position:absolute}.origin-overlay span{z-index:2;color:red;text-align:left;position:absolute}.origin-overlay .qrcode-polygon{z-index:1;position:absolute}.origin-canvas{width:100%;position:absolute}.origin-video{width:100%;background-color:#262626}.qrcode-tooltip{z-index:3;position:absolute}.qrcode-tooltip:hover .qrcode-tooltip-temp{display:block;position:absolute}.qrcode-tooltip-temp{bottom:0;left:50%;padding:5px;color:#fff;text-align:left;display:none;max-width:450px;border-radius:5px;width:max-content;word-wrap:break-word;transform:translate(-50%);transform-style:preserve-3d;background-color:#000000d0;box-shadow:1px 1px 20px #000000e0}.qrcode-tooltip-temp .qrcode-tooltip-clipboard{cursor:pointer;margin-left:5px;fill:#fff}.qrcode-tooltip-temp .qrcode-tooltip-clipboard:active{fill:#afafaf}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.Renderer2 }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXNjYW5uZXItcXJjb2RlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1zY2FubmVyLXFyY29kZS9zcmMvbGliL25neC1zY2FubmVyLXFyY29kZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBYyxZQUFZLEVBQWdDLFNBQVMsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNoSSxPQUFPLEVBQUUsWUFBWSxFQUFFLGVBQWUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUNyRCxPQUFPLEVBQUUsY0FBYyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFDcEYsT0FBTyxFQUFFLGlCQUFpQixFQUFFLFdBQVcsRUFBRSxZQUFZLEVBQUUsY0FBYyxFQUFFLHdCQUF3QixFQUFFLGFBQWEsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLG1CQUFtQixFQUFFLFlBQVksRUFBRSx5QkFBeUIsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sNkJBQTZCLENBQUM7O0FBSTlQLE1BZWEseUJBQXlCO0lBdURwQyxZQUFvQixRQUFtQjtRQUFuQixhQUFRLEdBQVIsUUFBUSxDQUFXO1FBN0N2Qzs7V0FFRztRQUNJLFVBQUssR0FBRyxJQUFJLFlBQVksRUFBeUIsQ0FBQztRQUV6RDs7V0FFRztRQUNJLFFBQUcsR0FBdUIsY0FBYyxDQUFDLEdBQUcsQ0FBQztRQUM3QyxRQUFHLEdBQXVCLGNBQWMsQ0FBQyxHQUFHLENBQUM7UUFDN0MsWUFBTyxHQUF1QixjQUFjLENBQUMsT0FBTyxDQUFDO1FBQ3JELFdBQU0sR0FBdUIsY0FBYyxDQUFDLE1BQU0sQ0FBQztRQUNuRCxXQUFNLEdBQXdCLGNBQWMsQ0FBQyxNQUFNLENBQUM7UUFDcEQsV0FBTSxHQUF3QixjQUFjLENBQUM7UUFDN0MsZ0JBQVcsR0FBaUMsY0FBYyxDQUFD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VDt3QkFDUCxLQUFLLEVBQUUsSUFBSSxTQUFTLENBQUMsT0FBTyxDQUFDO3dCQUM3QixNQUFNLEVBQUUsSUFBSSxTQUFTLENBQUMsUUFBUSxDQUFDO3dCQUMvQixZQUFZLEVBQUUsSUFBSSxTQUFTLENBQUMsY0FBYyxDQUFDO3FCQUM1QyxpQkFDYyxpQkFBaUIsQ0FBQyxJQUFJIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBFdmVudEVtaXR0ZXIsIE9uRGVzdHJveSwgT25Jbml0LCBSZW5kZXJlcjIsIFZpZXdDaGlsZCwgVmlld0VuY2Fwc3VsYXRpb24gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQXN5bmNTdWJqZWN0LCBCZWhhdmlvclN1YmplY3QgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgQ09ORklHX0RFRkFVTFQsIE1FRElBX1NUUkVBTV9ERUZBVUxUIH0gZnJvbSAnLi9uZ3gtc2Nhbm5lci1xcmNvZGUuZGVmYXVsdCc7XHJcbmltcG9ydCB7IEFERF9KU19UT19FTEVNRU5ULCBBU19DT01QTEVURSwgQkxPQl9UT19GSUxFLCBDQU5WQVNfVE9fQkxPQiwgRFJBV19SRVNVTFRfQVBQRU5EX0NISUxELCBGSUxFU19UT19TQ0FOLCBPVkVSUklERVMsIFBMQVlfQVVESU8sIFJFTU9WRV9SRVNVTFRfUEFORUwsIFJFU0VUX0NBTlZBUywgVVBEQVRFX1dJRFRIX0hFSUdIVF9WSURFTywgVklCUkFURSwgV0FTTV9SRUFEWSB9IGZyb20gJy4vbmd4LXNjYW5uZXItcXJjb2RlLmhlbHBlcic7XHJcbmltcG9ydCB7IFNjYW5uZXJRUkNvZGVDb25maWcsIFNjYW5uZXJRUkNvZGVEZXZpY2UsIFNjYW5uZXJRUkNvZGVSZXN1bHQsIFNjYW5uZXJRUkNvZGVTZWxlY3RlZEZpbGVzIH0gZnJvbSAnLi9uZ3gtc2Nhbm5lci1xcmNvZGUub3B0aW9ucyc7XHJcbmRlY2xhcmUgY29uc3QgemJhcldhc206IGFueTtcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnbmd4LXNjYW5uZXItcXJjb2RlJyxcclxuICB0ZW1wbGF0ZTogYDxkaXYgI3Jlc3VsdHNQYW5lbCBjbGFzcz1cIm9yaWdpbi1vdmVybGF5XCI+PC9kaXY+PGNhbnZhcyAjY2FudmFzIGNsYXNzPVwib3JpZ2luLWNhbnZhc1wiPjwvY2FudmFzPjx2aWRlbyAjdmlkZW8gcGxheXNpbmxpbmUgY2xhc3M9XCJvcmlnaW4tdmlkZW9cIj48L3ZpZGVvPmAsXHJcbiAgc3R5bGVVcmxzOiBbJy4vbmd4LXNjYW5uZXItcXJjb2RlLmNvbXBvbmVudC5zY3NzJ10sXHJcbiAgaG9zdDogeyAnY2xhc3MnOiAnbmd4LXNjYW5uZXItcXJjb2RlJyB9LFxyXG4gIGV4cG9ydEFzOiAnc2Nhbm5lcicsXHJcbiAgaW5wdXRzOiBbJ3NyYycsICdmcHMnLCAndmlicmF0ZScsICdkZWNvZGUnLCAnaXNCZWVwJywgJ2NvbmZpZycsICdjb25zdHJhaW50cycsICdjYW52YXNTdHlsZXMnXSxcclxuICBvdXRwdXRzOiBbJ2V2ZW50J10sXHJcbiAgcXVlcmllczoge1xyXG4gICAgdmlkZW86IG5ldyBWaWV3Q2hpbGQoJ3ZpZGVvJyksXHJcbiAgICBjYW52YXM6IG5ldyBWaWV3Q2hpbGQoJ2NhbnZhcycpLFxyXG4gICAgcmVzdWx0c1BhbmVsOiBuZXcgVmlld0NoaWxkKCdyZXN1bHRzUGFuZWwnKVxyXG4gIH0sXHJcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZVxyXG59KVxyXG5leHBvcnQgY2xhc3MgTmd4U2Nhbm5lclFyY29kZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcclxuXHJcbiAgLyoqXHJcbiAgICogRWxlbWVudFxyXG4gICAqIHBsYXlzaW5saW5lIHJlcXVpcmVkIHRvIHRlbGwgaU9TIHNhZmFyaSB3ZSBkb24ndCB3YW50IGZ1bGxzY3JlZW5cclxuICAgKi9cclxuICBwdWJsaWMgdmlkZW8hOiBFbGVtZW50UmVmPEhUTUxWaWRlb0VsZW1lbnQ+O1xyXG4gIHB1YmxpYyBjYW52YXMhOiBFbGVtZW50UmVmPEhUTUxDYW52YXNFbGVtZW50PjtcclxuICBwdWJsaWMgcmVzdWx0c1BhbmVsITogRWxlbWVudFJlZjxIVE1MRGl2RWxlbWVudD47XHJcblxyXG4gIC8qKlxyXG4gICAqIEV2ZW50RW1pdHRlclxyXG4gICAqL1xyXG4gIHB1YmxpYyBldmVudCA9IG5ldyBFdmVudEVtaXR0ZXI8U2Nhbm5lclFSQ29kZVJlc3VsdFtdPigpO1xyXG5cclxuICAvKipcclxuICAgKiBJbnB1dFxyXG4gICAqL1xyXG4gIHB1YmxpYyBzcmM6IHN0cmluZyB8IHVuZGVmaW5lZCA9IENPTkZJR19ERUZBVUxULnNyYztcclxuICBwdWJsaWMgZnBzOiBudW1iZXIgfCB1bmRlZmluZWQgPSBDT05GSUdfREVGQVVMVC5mcHM7XHJcbiAgcHVibGljIHZpYnJhdGU6IG51bWJlciB8IHVuZGVmaW5lZCA9IENPTkZJR19ERUZBVUxULnZpYnJhdGU7XHJcbiAgcHVibGljIGRlY29kZTogc3RyaW5nIHwgdW5kZWZpbmVkID0gQ09ORklHX0RFRkFVTFQuZGVjb2RlO1xyXG4gIHB1YmxpYyBpc0JlZXA6IGJvb2xlYW4gfCB1bmRlZmluZWQgPSBDT05GSUdfREVGQVVMVC5pc0JlZXA7XHJcbiAgcHVibGljIGNvbmZpZzogU2Nhbm5lclFSQ29kZUNvbmZpZyA9IENPTkZJR19ERUZBVUxUO1xyXG4gIHB1YmxpYyBjb25zdHJhaW50czogTWVkaWFTdHJlYW1Db25zdHJhaW50cyB8IGFueSA9IENPTkZJR19ERUZBVUxULmNvbnN0cmFpbnRzO1xyXG4gIHB1YmxpYyBjYW52YXNTdHlsZXM6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCB8IGFueSA9IENPTkZJR19ERUZBVUxULmNhbnZhc1N0eWxlcztcclxuXHJcbiAgLyoqXHJcbiAgICogRXhwb3J0XHJcbiAgKi9cclxuICBwdWJsaWMgaXNTdGFydDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIHB1YmxpYyBpc1BhdXNlOiBib29sZWFuID0gZmFsc2U7XHJcbiAgcHVibGljIGlzTG9hZGluZzogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIHB1YmxpYyBpc1RvcmNoOiBib29sZWFuID0gZmFsc2U7XHJcbiAgcHVibGljIGRhdGEgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PFNjYW5uZXJRUkNvZGVSZXN1bHRbXT4oW10pO1xyXG4gIHB1YmxpYyBkZXZpY2VzID0gbmV3IEJlaGF2aW9yU3ViamVjdDxTY2FubmVyUVJDb2RlRGV2aWNlW10+KFtdKTtcclxuICBwdWJsaWMgZGV2aWNlSW5kZXhBY3RpdmU6IG51bWJlciA9IDA7XHJcblxyXG4gIC8qKlxyXG4gICAqIFByaXZhdGVcclxuICAqL1xyXG4gIHByaXZhdGUgckFGX0lEOiBhbnk7XHJcbiAgcHJpdmF0ZSBkYXRhRm9yUmVzaXplOiBTY2FubmVyUVJDb2RlUmVzdWx0W10gPSBbXTtcclxuICBwcml2YXRlIHJlYWR5ID0gbmV3IEFzeW5jU3ViamVjdDxib29sZWFuPigpO1xyXG5cclxuICBwcml2YXRlIFNUQVRVUyA9IHtcclxuICAgIHN0YXJ0T046ICgpID0+IHRoaXMuaXNTdGFydCA9IHRydWUsXHJcbiAgICBwYXVzZU9OOiAoKSA9PiB0aGlzLmlzUGF1c2UgPSB0cnVlLFxyXG4gICAgbG9hZGluZ09OOiAoKSA9PiB0aGlzLmlzTG9hZGluZyA9IHRydWUsXHJcbiAgICBzdGFydE9GRjogKCkgPT4gdGhpcy5pc1N0YXJ0ID0gZmFsc2UsXHJcbiAgICBwYXVzZU9GRjogKCkgPT4gdGhpcy5pc1BhdXNlID0gZmFsc2UsXHJcbiAgICBsb2FkaW5nT0ZGOiAoKSA9PiB0aGlzLmlzTG9hZGluZyA9IGZhbHNlLFxyXG4gICAgdG9yY2hPRkY6ICgpID0+IHRoaXMuaXNUb3JjaCA9IGZhbHNlLFxyXG4gIH1cclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyKSB7IH1cclxuXHJcbiAgbmdPbkluaXQoKTogdm9pZCB7XHJcbiAgICB0aGlzLm92ZXJyaWRlQ29uZmlnKCk7XHJcbiAgICBBRERfSlNfVE9fRUxFTUVOVCh0aGlzLnJlYWR5LCB0aGlzLnJlbmRlcmVyKS5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICBpZiAodGhpcy5zcmMpIHtcclxuICAgICAgICB0aGlzLmxvYWRJbWFnZSh0aGlzLnNyYyk7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5yZXNpemUoKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogc3RhcnRcclxuICAgKiBAcGFyYW0gcGxheURldmljZUN1c3RvbSBcclxuICAgKiBAcmV0dXJucyBcclxuICAgKi9cclxuICBwdWJsaWMgc3RhcnQocGxheURldmljZUN1c3RvbT86IEZ1bmN0aW9uKTogQXN5bmNTdWJqZWN0PGFueT4ge1xyXG4gICAgY29uc3QgYXMgPSBuZXcgQXN5bmNTdWJqZWN0PGFueT4oKTtcclxuICAgIGlmICh0aGlzLmlzU3RhcnQpIHtcclxuICAgICAgLy8gUmVqZWN0XHJcbiAgICAgIEFTX0NPTVBMRVRFKGFzLCBmYWxzZSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyBmaXggc2FmYXJpXHJcbiAgICAgIHRoaXMuc2FmYXJpV2ViUlRDKGFzLCBwbGF5RGV2aWNlQ3VzdG9tKTtcclxuICAgIH1cclxuICAgIHJldHVybiBhcztcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIHN0b3BcclxuICAgKiBAcmV0dXJucyBcclxuICAgKi9cclxuICBwdWJsaWMgc3RvcCgpOiBBc3luY1N1YmplY3Q8YW55PiB7XHJcbiAgICB0aGlzLlNUQVRVUy5wYXVzZU9GRigpO1xyXG4gICAgdGhpcy5TVEFUVVMuc3RhcnRPRkYoKTtcclxuICAgIHRoaXMuU1RBVFVTLnRvcmNoT0ZGKCk7XHJcbiAgICB0aGlzLlNUQVRVUy5sb2FkaW5nT0ZGKCk7XHJcbiAgICBjb25zdCBhcyA9IG5ldyBBc3luY1N1YmplY3Q8YW55PigpO1xyXG4gICAgdHJ5IHtcclxuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuckFGX0lEKTtcclxuICAgICAgKHRoaXMudmlkZW8ubmF0aXZlRWxlbWVudC5zcmNPYmplY3QgYXMgTWVkaWFTdHJlYW0pLmdldFRyYWNrcygpLmZvckVhY2goKHRyYWNrOiBNZWRpYVN0cmVhbVRyYWNrKSA9PiB7XHJcbiAgICAgICAgdHJhY2suc3RvcCgpO1xyXG4gICAgICAgIEFTX0NPTVBMRVRFKGFzLCB0cnVlKTtcclxuICAgICAgfSk7XHJcbiAgICAgIHRoaXMuZGF0YUZvclJlc2l6ZSA9IFtdO1xyXG4gICAgICBSRVNFVF9DQU5WQVModGhpcy5jYW52YXMubmF0aXZlRWxlbWVudCk7XHJcbiAgICAgIFJFTU9WRV9SRVNVTFRfUEFORUwodGhpcy5yZXN1bHRzUGFuZWwubmF0aXZlRWxlbWVudCk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICBBU19DT01QTEVURShhcywgZmFsc2UsIGVycm9yIGFzIGFueSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXM7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBwbGF5XHJcbiAgICogQHJldHVybnMgXHJcbiAgICovXHJcbiAgcHVibGljIHBsYXkoKTogQXN5bmNTdWJqZWN0PGFueT4ge1xyXG4gICAgY29uc3QgYXMgPSBuZXcgQXN5bmNTdWJqZWN0PGFueT4oKTtcclxuICAgIGlmICh0aGlzLmlzUGF1c2UpIHtcclxuICAgICAgdGhpcy52aWRlby5uYXRpdmVFbGVtZW50LnBsYXkoKTtcclxuICAgICAgdGhpcy5TVEFUVVMucGF1c2VPRkYoKTtcclxuICAgICAgdGhpcy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoMTAwKTtcclxuICAgICAgQVNfQ09NUExFVEUoYXMsIHRydWUpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgQVNfQ09NUExFVEUoYXMsIGZhbHNlKTtcclxuICAgIH1cclxuICAgIHJldHVybiBhcztcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIHBhdXNlXHJcbiAgICogQHJldHVybnMgXHJcbiAgICovXHJcbiAgcHVibGljIHBhdXNlKCk6IEFzeW5jU3ViamVjdDxhbnk+IHtcclxuICAgIGNvbnN0IGFzID0gbmV3IEFzeW5jU3ViamVjdDxhbnk+KCk7XHJcbiAgICBpZiAodGhpcy5pc1N0YXJ0KSB7XHJcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLnJBRl9JRCk7XHJcbiAgICAgIHRoaXMudmlkZW8ubmF0aXZlRWxlbWVudC5wYXVzZSgpO1xyXG4gICAgICB0aGlzLlNUQVRVUy5wYXVzZU9OKCk7XHJcbiAgICAgIEFTX0NPTVBMRVRFKGFzLCB0cnVlKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIEFTX0NPTVBMRVRFKGFzLCBmYWxzZSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXM7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBwbGF5RGV2aWNlXHJcbiAgICogQHBhcmFtIGRldmljZUlkIFxyXG4gICAqIEBwYXJhbSBhcyBcclxuICAgKiBAcmV0dXJucyBcclxuICAgKi9cclxuICBwdWJsaWMgcGxheURldmljZShkZXZpY2VJZDogc3RyaW5nLCBhczogQXN5bmNTdWJqZWN0PGFueT4gPSBuZXcgQXN5bmNTdWJqZWN0PGFueT4oKSk6IEFzeW5jU3ViamVjdDxhbnk+IHtcclxuICAgIGNvbnN0IGNvbnN0cmFpbnRzID0gdGhpcy5nZXRDb25zdHJhaW50cygpO1xyXG4gICAgY29uc3QgZXhpc3REZXZpY2VJZCA9ICh0aGlzLmlzU3RhcnQgJiYgY29uc3RyYWludHMpID8gY29uc3RyYWludHMuZGV2aWNlSWQgIT09IGRldmljZUlkIDogdHJ1ZTtcclxuICAgIHN3aXRjaCAodHJ1ZSkge1xyXG4gICAgICBjYXNlIGRldmljZUlkID09PSAnbnVsbCcgfHwgZGV2aWNlSWQgPT09ICd1bmRlZmluZWQnIHx8ICFkZXZpY2VJZDpcclxuICAgICAgICBzdG9wKCk7XHJcbiAgICAgICAgdGhpcy5zdG9wKCk7XHJcbiAgICAgICAgQVNfQ09NUExFVEUoYXMsIGZhbHNlKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBkZXZpY2VJZCAmJiBleGlzdERldmljZUlkOlxyXG4gICAgICAgIHN0b3AoKTtcclxuICAgICAgICB0aGlzLnN0b3AoKTtcclxuICAgICAgICAvLyBMb2FkaW5nIG9uXHJcbiAgICAgICAgdGhpcy5TVEFUVVMubG9hZGluZ09OKCk7XHJcbiAgICAgICAgdGhpcy5kZXZpY2VJbmRleEFjdGl2ZSA9IHRoaXMuZGV2aWNlcy52YWx1ZS5maW5kSW5kZXgoKGY6IFNjYW5uZXJRUkNvZGVEZXZpY2UpID0+IGYuZGV2aWNlSWQgPT09IGRldmljZUlkKTtcclxuICAgICAgICBjb25zdCBjb25zdHJhaW50cyA9IHsgLi4udGhpcy5jb25zdHJhaW50cywgYXVkaW86IGZhbHNlLCB2aWRlbzogeyBkZXZpY2VJZDogZGV2aWNlSWQsIC4uLnRoaXMuY29uc3RyYWludHMudmlkZW8gfSB9O1xyXG4gICAgICAgIC8vIE1lZGlhU3RyZWFtXHJcbiAgICAgICAgbmF2aWdhdG9yLm1lZGlhRGV2aWNlcy5nZXRVc2VyTWVkaWEoY29uc3RyYWludHMpLnRoZW4oKHN0cmVhbTogTWVkaWFTdHJlYW0pID0+IHtcclxuICAgICAgICAgIHRoaXMudmlkZW8ubmF0aXZlRWxlbWVudC5zcmNPYmplY3QgPSBzdHJlYW07XHJcbiAgICAgICAgICB0aGlzLnZpZGVvLm5hdGl2ZUVsZW1lbnQub25sb2FkZWRtZXRhZGF0YSA9ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy52aWRlby5uYXRpdmVFbGVtZW50LnBsYXkoKTtcclxuICAgICAgICAgICAgdGhpcy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKTtcclxuICAgICAgICAgICAgQVNfQ09NUExFVEUoYXMsIHRydWUpO1xyXG4gICAgICAgICAgICB0aGlzLlNUQVRVUy5zdGFydE9OKCk7XHJcbiAgICAgICAgICAgIHRoaXMuU1RBVFVTLmxvYWRpbmdPRkYoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KS5jYXRjaCgoZXJyb3I6IGFueSkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5ldmVudEVtaXQoZmFsc2UpO1xyXG4gICAgICAgICAgQVNfQ09NUExFVEUoYXMsIGZhbHNlLCBlcnJvcik7XHJcbiAgICAgICAgICB0aGlzLlNUQVRVUy5zdGFydE9GRigpO1xyXG4gICAgICAgICAgdGhpcy5TVEFUVVMubG9hZGluZ09GRigpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIEFTX0NPTVBMRVRFKGFzLCBmYWxzZSk7XHJcbiAgICAgICAgdGhpcy5TVEFUVVMubG9hZGluZ09GRigpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFzO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogbG9hZEltYWdlXHJcbiAgICogQHBhcmFtIHNyYyBcclxuICAgKiBAcmV0dXJucyBcclxuICAgKi9cclxuICBwdWJsaWMgbG9hZEltYWdlKHNyYzogc3RyaW5nKTogQXN5bmNTdWJqZWN0PGFueT4ge1xyXG4gICAgY29uc3QgYXMgPSBuZXcgQXN5bmNTdWJqZWN0PGFueT4oKTtcclxuICAgIC8vIExvYWRpbmcgb25cclxuICAgIHRoaXMuU1RBVFVTLnN0YXJ0T0ZGKCk7XHJcbiAgICB0aGlzLlNUQVRVUy5sb2FkaW5nT04oKTtcclxuICAgIC8vIFNldCB0aGUgc3JjIG9mIHRoaXMgSW1hZ2Ugb2JqZWN0LlxyXG4gICAgY29uc3QgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcclxuICAgIC8vIFNldHRpbmcgY3Jvc3Mgb3JpZ2luIHZhbHVlIHRvIGFub255bW91c1xyXG4gICAgaW1hZ2Uuc2V0QXR0cmlidXRlKCdjcm9zc09yaWdpbicsICdhbm9ueW1vdXMnKTtcclxuICAgIC8vIFdoZW4gb3VyIGltYWdlIGhhcyBsb2FkZWQuXHJcbiAgICBpbWFnZS5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgIFdBU01fUkVBRFkoKSAmJiB0aGlzLmRyYXdJbWFnZShpbWFnZSwgKGZsYWc6IGJvb2xlYW4pID0+IHtcclxuICAgICAgICBBU19DT01QTEVURShhcywgZmxhZyk7XHJcbiAgICAgICAgdGhpcy5TVEFUVVMuc3RhcnRPRkYoKTtcclxuICAgICAgICB0aGlzLlNUQVRVUy5sb2FkaW5nT0ZGKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIC8vIFNldCBzcmNcclxuICAgIGltYWdlLnNyYyA9IHNyYztcclxuICAgIHJldHVybiBhcztcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIHRvcmNoZXJcclxuICAgKiBAcmV0dXJucyBcclxuICAgKi9cclxuICBwdWJsaWMgdG9yY2hlcigpOiBBc3luY1N1YmplY3Q8YW55PiB7XHJcbiAgICBjb25zdCBhcyA9IHRoaXMuYXBwbHlDb25zdHJhaW50cyh7IGFkdmFuY2VkOiBbeyB0b3JjaDogdGhpcy5pc1RvcmNoIH1dIH0pO1xyXG4gICAgYXMuc3Vic2NyaWJlKCgpID0+IGZhbHNlLCAoKSA9PiB0aGlzLmlzVG9yY2ggPSAhdGhpcy5pc1RvcmNoKTtcclxuICAgIHJldHVybiBhcztcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIGFwcGx5Q29uc3RyYWludHNcclxuICAgKiBAcGFyYW0gY29uc3RyYWludHMgXHJcbiAgICogQHBhcmFtIGRldmljZUluZGV4IFxyXG4gICAqIEByZXR1cm5zIFxyXG4gICAqL1xyXG4gIHB1YmxpYyBhcHBseUNvbnN0cmFpbnRzKGNvbnN0cmFpbnRzOiBNZWRpYVRyYWNrQ29uc3RyYWludFNldCB8IE1lZGlhVHJhY2tDb25zdHJhaW50cyB8IGFueSwgZGV2aWNlSW5kZXggPSAwKTogQXN5bmNTdWJqZWN0PGFueT4ge1xyXG4gICAgY29uc3QgYXMgPSBuZXcgQXN5bmNTdWJqZWN0PGFueT4oKTtcclxuICAgIGNvbnN0IHN0cmVhbSA9IHRoaXMudmlkZW8ubmF0aXZlRWxlbWVudC5zcmNPYmplY3QgYXMgTWVkaWFTdHJlYW07XHJcbiAgICBpZiAoZGV2aWNlSW5kZXggIT09IG51bGwgfHwgZGV2aWNlSW5kZXggIT09IHVuZGVmaW5lZCB8fCAhTnVtYmVyLmlzTmFOKGRldmljZUluZGV4KSkge1xyXG4gICAgICBjb25zdCB2aWRlb1RyYWNrID0gc3RyZWFtLmdldFZpZGVvVHJhY2tzKClbZGV2aWNlSW5kZXhdIGFzIE1lZGlhU3RyZWFtVHJhY2s7XHJcbiAgICAgIGNvbnN0IGltYWdlQ2FwdHVyZSA9IG5ldyAod2luZG93IGFzIGFueSkuSW1hZ2VDYXB0dXJlKHZpZGVvVHJhY2spO1xyXG4gICAgICBpbWFnZUNhcHR1cmUuZ2V0UGhvdG9DYXBhYmlsaXRpZXMoKS50aGVuKGFzeW5jICgpID0+IHtcclxuICAgICAgICBhd2FpdCB2aWRlb1RyYWNrLmFwcGx5Q29uc3RyYWludHMoY29uc3RyYWludHMpO1xyXG4gICAgICAgIFVQREFURV9XSURUSF9IRUlHSFRfVklERU8odGhpcy52aWRlby5uYXRpdmVFbGVtZW50LCB0aGlzLmNhbnZhcy5uYXRpdmVFbGVtZW50KTtcclxuICAgICAgICBBU19DT01QTEVURShhcywgdHJ1ZSk7XHJcbiAgICAgIH0pLmNhdGNoKChlcnJvcjogYW55KSA9PiB7XHJcbiAgICAgICAgc3dpdGNoIChlcnJvcj8ubmFtZSkge1xyXG4gICAgICAgICAgY2FzZSAnTm90Rm91bmRFcnJvcic6XHJcbiAgICAgICAgICBjYXNlICdEZXZpY2VzTm90Rm91bmRFcnJvcic6XHJcbiAgICAgICAgICAgIEFTX0NPTVBMRVRFKGFzLCBmYWxzZSwgJ1JlcXVpcmVkIHRyYWNrIGlzIG1pc3NpbmcnIGFzIHN0cmluZyk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgY2FzZSAnTm90UmVhZGFibGVFcnJvcic6XHJcbiAgICAgICAgICBjYXNlICdUcmFja1N0YXJ0RXJyb3InOlxyXG4gICAgICAgICAgICBBU19DT01QTEVURShhcywgZmFsc2UsICdXZWJjYW0gb3IgbWljIGFyZSBhbHJlYWR5IGluIHVzZScgYXMgc3RyaW5nKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICBjYXNlICdPdmVyY29uc3RyYWluZWRFcnJvcic6XHJcbiAgICAgICAgICBjYXNlICdDb25zdHJhaW50Tm90U2F0aXNmaWVkRXJyb3InOlxyXG4gICAgICAgICAgICBBU19DT01QTEVURShhcywgZmFsc2UsICdDb25zdHJhaW50cyBjYW4gbm90IGJlIHNhdGlzZmllZCBieSBhdmIuIGRldmljZXMnIGFzIHN0cmluZyk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgY2FzZSAnTm90QWxsb3dlZEVycm9yJzpcclxuICAgICAgICAgIGNhc2UgJ1Blcm1pc3Npb25EZW5pZWRFcnJvcic6XHJcbiAgICAgICAgICAgIEFTX0NPTVBMRVRFKGFzLCBmYWxzZSwgJ1Blcm1pc3Npb24gZGVuaWVkIGluIGJyb3dzZXInIGFzIHN0cmluZyk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgY2FzZSAnVHlwZUVycm9yJzpcclxuICAgICAgICAgICAgQVNfQ09NUExFVEUoYXMsIGZhbHNlLCAnRW1wdHkgY29uc3RyYWludHMgb2JqZWN0JyBhcyBzdHJpbmcpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIEFTX0NPTVBMRVRFKGFzLCBmYWxzZSwgZXJyb3IgYXMgYW55KTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIEFTX0NPTVBMRVRFKGFzLCBmYWxzZSwgJ1BsZWFzZSBjaGVjayBhZ2FpbiBkZXZpY2VJbmRleCcgYXMgc3RyaW5nKTtcclxuICAgIH1cclxuICAgIHJldHVybiBhcztcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBnZXRDb25zdHJhaW50c1xyXG4gICAqIEBwYXJhbSBkZXZpY2VJbmRleCBcclxuICAgKiBAcmV0dXJucyBcclxuICAgKi9cclxuICBwdWJsaWMgZ2V0Q29uc3RyYWludHMoZGV2aWNlSW5kZXggPSAwKTogTWVkaWFUcmFja0NvbnN0cmFpbnRTZXQgfCBNZWRpYVRyYWNrQ29uc3RyYWludHMge1xyXG4gICAgY29uc3Qgc3RyZWFtID0gdGhpcy52aWRlby5uYXRpdmVFbGVtZW50LnNyY09iamVjdCBhcyBNZWRpYVN0cmVhbTtcclxuICAgIGNvbnN0IHZpZGVvVHJhY2sgPSBzdHJlYW0/LmdldFZpZGVvVHJhY2tzKClbZGV2aWNlSW5kZXhdIGFzIE1lZGlhU3RyZWFtVHJhY2s7XHJcbiAgICByZXR1cm4gdmlkZW9UcmFjaz8uZ2V0Q29uc3RyYWludHMoKSBhcyBNZWRpYVRyYWNrQ29uc3RyYWludHM7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBkb3dubG9hZFxyXG4gICAqIEBwYXJhbSBmaWxlTmFtZSBcclxuICAgKiBAcGFyYW0gcXVhbGl0eSBcclxuICAgKiBAcGFyYW0gdHlwZSBcclxuICAgKiBAcmV0dXJucyBcclxuICAgKi9cclxuICBwdWJsaWMgZG93bmxvYWQoZmlsZU5hbWU6IHN0cmluZyA9IGBuZ3gtc2Nhbm5lci1xcmNvZGUtJHtEYXRlLm5vdygpfS5wbmdgLCBxdWFsaXR5PzogbnVtYmVyLCB0eXBlPzogc3RyaW5nKTogQXN5bmNTdWJqZWN0PFNjYW5uZXJRUkNvZGVTZWxlY3RlZEZpbGVzW10+IHtcclxuICAgIGNvbnN0IGFzID0gbmV3IEFzeW5jU3ViamVjdDxhbnk+KCk7XHJcbiAgICAoYXN5bmMgKCkgPT4ge1xyXG4gICAgICBjb25zdCBibG9iID0gYXdhaXQgQ0FOVkFTX1RPX0JMT0IodGhpcy5jYW52YXMubmF0aXZlRWxlbWVudCk7XHJcbiAgICAgIGNvbnN0IGZpbGUgPSBCTE9CX1RPX0ZJTEUoYmxvYiwgZmlsZU5hbWUpO1xyXG4gICAgICBGSUxFU19UT19TQ0FOKFtmaWxlXSwgdGhpcy5jb25maWcsIHF1YWxpdHksIHR5cGUsIGFzKS5zdWJzY3JpYmUoKHJlczogU2Nhbm5lclFSQ29kZVNlbGVjdGVkRmlsZXNbXSkgPT4ge1xyXG4gICAgICAgIHJlcy5mb3JFYWNoKChpdGVtOiBTY2FubmVyUVJDb2RlU2VsZWN0ZWRGaWxlcykgPT4ge1xyXG4gICAgICAgICAgaWYgKGl0ZW0/LmRhdGE/Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICBjb25zdCBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xyXG4gICAgICAgICAgICBsaW5rLmhyZWYgPSBpdGVtLnVybDtcclxuICAgICAgICAgICAgbGluay5kb3dubG9hZCA9IGl0ZW0ubmFtZTtcclxuICAgICAgICAgICAgbGluay5jbGljaygpO1xyXG4gICAgICAgICAgICBsaW5rLnJlbW92ZSgpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH0pKCk7XHJcbiAgICByZXR1cm4gYXM7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiByZXNpemVcclxuICAgKi9cclxuICBwcml2YXRlIHJlc2l6ZSgpOiB2b2lkIHtcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicmVzaXplXCIsICgpID0+IHtcclxuICAgICAgRFJBV19SRVNVTFRfQVBQRU5EX0NISUxEKHRoaXMuZGF0YUZvclJlc2l6ZSBhcyBhbnksIHRoaXMuY2FudmFzLm5hdGl2ZUVsZW1lbnQsIHRoaXMucmVzdWx0c1BhbmVsLm5hdGl2ZUVsZW1lbnQsIHRoaXMuY2FudmFzU3R5bGVzKTtcclxuICAgICAgVVBEQVRFX1dJRFRIX0hFSUdIVF9WSURFTyh0aGlzLnZpZGVvLm5hdGl2ZUVsZW1lbnQsIHRoaXMuY2FudmFzLm5hdGl2ZUVsZW1lbnQpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBvdmVycmlkZUNvbmZpZ1xyXG4gICAqL1xyXG4gIHByaXZhdGUgb3ZlcnJpZGVDb25maWcoKTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5jb25maWc/LnNyYykgdGhpcy5zcmMgPSB0aGlzLmNvbmZpZy5zcmM7XHJcbiAgICBpZiAodGhpcy5jb25maWc/LmZwcykgdGhpcy5mcHMgPSB0aGlzLmNvbmZpZy5mcHM7XHJcbiAgICBpZiAodGhpcy5jb25maWc/LnZpYnJhdGUpIHRoaXMudmlicmF0ZSA9IHRoaXMuY29uZmlnLnZpYnJhdGU7XHJcbiAgICBpZiAodGhpcy5jb25maWc/LmRlY29kZSkgdGhpcy5kZWNvZGUgPSB0aGlzLmNvbmZpZy5kZWNvZGU7XHJcbiAgICBpZiAodGhpcy5jb25maWc/LmlzQmVlcCkgdGhpcy5pc0JlZXAgPSB0aGlzLmNvbmZpZy5pc0JlZXA7XHJcbiAgICBpZiAodGhpcy5jb25maWc/LmNvbnN0cmFpbnRzKSB0aGlzLmNvbnN0cmFpbnRzID0gT1ZFUlJJREVTKCdjb25zdHJhaW50cycsIHRoaXMuY29uZmlnLCBNRURJQV9TVFJFQU1fREVGQVVMVCk7XHJcbiAgICBpZiAodGhpcy5jb25maWc/LmNhbnZhc1N0eWxlcykgdGhpcy5jYW52YXNTdHlsZXMgPSB0aGlzLmNvbmZpZy5jYW52YXNTdHlsZXM7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBzYWZhcmlXZWJSVENcclxuICAgKiBGaXggaXNzdWUgb24gc2FmYXJpXHJcbiAgICogaHR0cHM6Ly93ZWJydGNoYWNrcy5jb20vZ3VpZGUtdG8tc2FmYXJpLXdlYnJ0Y1xyXG4gICAqIEBwYXJhbSBhcyBcclxuICAgKiBAcGFyYW0gcGxheURldmljZUN1c3RvbSBcclxuICAgKi9cclxuICBwcml2YXRlIHNhZmFyaVdlYlJUQyhhczogQXN5bmNTdWJqZWN0PGFueT4sIHBsYXlEZXZpY2VDdXN0b20/OiBGdW5jdGlvbik6IHZvaWQge1xyXG4gICAgLy8gTG9hZGluZyBvblxyXG4gICAgdGhpcy5TVEFUVVMuc3RhcnRPRkYoKTtcclxuICAgIHRoaXMuU1RBVFVTLmxvYWRpbmdPTigpO1xyXG4gICAgbmF2aWdhdG9yLm1lZGlhRGV2aWNlcy5nZXRVc2VyTWVkaWEodGhpcy5jb25zdHJhaW50cykudGhlbigoc3RyZWFtOiBNZWRpYVN0cmVhbSkgPT4ge1xyXG4gICAgICBzdHJlYW0uZ2V0VHJhY2tzKCkuZm9yRWFjaCh0cmFjayA9PiB0cmFjay5zdG9wKCkpO1xyXG4gICAgICB0aGlzLmxvYWRBbGxEZXZpY2VzKGFzLCBwbGF5RGV2aWNlQ3VzdG9tKTtcclxuICAgIH0pLmNhdGNoKChlcnJvcjogYW55KSA9PiB7XHJcbiAgICAgIEFTX0NPTVBMRVRFKGFzLCBmYWxzZSwgZXJyb3IpO1xyXG4gICAgICB0aGlzLlNUQVRVUy5zdGFydE9GRigpO1xyXG4gICAgICB0aGlzLlNUQVRVUy5sb2FkaW5nT0ZGKCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIGxvYWRBbGxEZXZpY2VzXHJcbiAgICogQHBhcmFtIGFzIFxyXG4gICAqIEBwYXJhbSBwbGF5RGV2aWNlQ3VzdG9tIFxyXG4gICAqL1xyXG4gIHByaXZhdGUgbG9hZEFsbERldmljZXMoYXM6IEFzeW5jU3ViamVjdDxhbnk+LCBwbGF5RGV2aWNlQ3VzdG9tPzogRnVuY3Rpb24pOiB2b2lkIHtcclxuICAgIG5hdmlnYXRvci5tZWRpYURldmljZXMuZW51bWVyYXRlRGV2aWNlcygpLnRoZW4oZGV2aWNlcyA9PiB7XHJcbiAgICAgIGxldCBjYW1lcmFEZXZpY2VzOiBTY2FubmVyUVJDb2RlRGV2aWNlW10gPSBkZXZpY2VzLmZpbHRlcihmID0+IGYua2luZCA9PSAndmlkZW9pbnB1dCcpO1xyXG4gICAgICB0aGlzLmRldmljZXMubmV4dChjYW1lcmFEZXZpY2VzKTtcclxuICAgICAgaWYgKGNhbWVyYURldmljZXM/Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICBBU19DT01QTEVURShhcywgY2FtZXJhRGV2aWNlcyk7XHJcbiAgICAgICAgcGxheURldmljZUN1c3RvbSA/IHBsYXlEZXZpY2VDdXN0b20oY2FtZXJhRGV2aWNlcykgOiB0aGlzLnBsYXlEZXZpY2UoY2FtZXJhRGV2aWNlc1swXS5kZXZpY2VJZCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgQVNfQ09NUExFVEUoYXMsIGZhbHNlLCAnTm8gY2FtZXJhIGRldGVjdGVkLicgYXMgYW55KTtcclxuICAgICAgICB0aGlzLlNUQVRVUy5zdGFydE9GRigpO1xyXG4gICAgICAgIHRoaXMuU1RBVFVTLmxvYWRpbmdPRkYoKTtcclxuICAgICAgfVxyXG4gICAgfSkuY2F0Y2goKGVycm9yOiBhbnkpID0+IHtcclxuICAgICAgQVNfQ09NUExFVEUoYXMsIGZhbHNlLCBlcnJvcik7XHJcbiAgICAgIHRoaXMuU1RBVFVTLnN0YXJ0T0ZGKCk7XHJcbiAgICAgIHRoaXMuU1RBVFVTLmxvYWRpbmdPRkYoKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogZHJhd0ltYWdlXHJcbiAgICogQHBhcmFtIGVsZW1lbnQgXHJcbiAgICogQHBhcmFtIGNhbGxiYWNrIFxyXG4gICAqL1xyXG4gIHByaXZhdGUgYXN5bmMgZHJhd0ltYWdlKGVsZW1lbnQ6IEhUTUxJbWFnZUVsZW1lbnQgfCBIVE1MVmlkZW9FbGVtZW50LCBjYWxsYmFjazogRnVuY3Rpb24gPSAoKSA9PiB7IH0pOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIC8vIEdldCB0aGUgY2FudmFzIGVsZW1lbnQgYnkgdXNpbmcgdGhlIGdldEVsZW1lbnRCeUlkIG1ldGhvZC5cclxuICAgIGNvbnN0IGNhbnZhcyA9IHRoaXMuY2FudmFzLm5hdGl2ZUVsZW1lbnQ7XHJcbiAgICAvLyBHZXQgYSAyRCBkcmF3aW5nIGNvbnRleHQgZm9yIHRoZSBjYW52YXMuXHJcbiAgICBjb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnLCB7IHdpbGxSZWFkRnJlcXVlbnRseTogdHJ1ZSB9KSBhcyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XHJcbiAgICAvLyBIVE1MSW1hZ2VFbGVtZW50IHNpemVcclxuICAgIGlmIChlbGVtZW50IGluc3RhbmNlb2YgSFRNTEltYWdlRWxlbWVudCkge1xyXG4gICAgICBjYW52YXMud2lkdGggPSBlbGVtZW50Lm5hdHVyYWxXaWR0aDtcclxuICAgICAgY2FudmFzLmhlaWdodCA9IGVsZW1lbnQubmF0dXJhbEhlaWdodDtcclxuICAgICAgZWxlbWVudC5zdHlsZS52aXNpYmlsaXR5ID0gJyc7XHJcbiAgICAgIHRoaXMudmlkZW8ubmF0aXZlRWxlbWVudC5zdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbic7XHJcbiAgICB9XHJcbiAgICAvLyBIVE1MVmlkZW9FbGVtZW50IHNpemVcclxuICAgIGlmIChlbGVtZW50IGluc3RhbmNlb2YgSFRNTFZpZGVvRWxlbWVudCkge1xyXG4gICAgICBjYW52YXMud2lkdGggPSBlbGVtZW50LnZpZGVvV2lkdGg7XHJcbiAgICAgIGNhbnZhcy5oZWlnaHQgPSBlbGVtZW50LnZpZGVvSGVpZ2h0O1xyXG4gICAgICBlbGVtZW50LnN0eWxlLnZpc2liaWxpdHkgPSAnJztcclxuICAgICAgdGhpcy5jYW52YXMubmF0aXZlRWxlbWVudC5zdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbic7XHJcbiAgICB9XHJcbiAgICAvLyBTZXQgd2lkdGgsIGhlaWdodCBmb3IgdmlkZW8gZWxlbWVudFxyXG4gICAgVVBEQVRFX1dJRFRIX0hFSUdIVF9WSURFTyh0aGlzLnZpZGVvLm5hdGl2ZUVsZW1lbnQsIGNhbnZhcyk7XHJcbiAgICAvLyBjbGVhciBmcmFtZVxyXG4gICAgY3R4LmNsZWFyUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpXHJcbiAgICAvLyBEcmF3IGltYWdlXHJcbiAgICBjdHguZHJhd0ltYWdlKGVsZW1lbnQsIDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XHJcbiAgICAvLyBEYXRhIGltYWdlXHJcbiAgICBjb25zdCBpbWFnZURhdGEgPSBjdHguZ2V0SW1hZ2VEYXRhKDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XHJcbiAgICAvLyBEcmF3IGZyYW1lXHJcbiAgICBjb25zdCBjb2RlID0gYXdhaXQgemJhcldhc20uc2NhbkltYWdlRGF0YShpbWFnZURhdGEpO1xyXG4gICAgaWYgKGNvZGU/Lmxlbmd0aCkge1xyXG4gICAgICAvLyBEZWNvZGVcclxuICAgICAgY29kZS5mb3JFYWNoKChzOiBhbnkpID0+IHMudmFsdWUgPSBzLmRlY29kZSh0aGlzLmRlY29kZT8udG9Mb2NhbGVMb3dlckNhc2UoKSkpO1xyXG4gICAgICAvLyBPdmVybGF5XHJcbiAgICAgIERSQVdfUkVTVUxUX0FQUEVORF9DSElMRChjb2RlLCBPYmplY3QuZnJlZXplKHRoaXMuY2FudmFzLm5hdGl2ZUVsZW1lbnQpLCB0aGlzLnJlc3VsdHNQYW5lbC5uYXRpdmVFbGVtZW50LCB0aGlzLmNhbnZhc1N0eWxlcyk7XHJcbiAgICAgIC8vIFRvIGJsb2IgYW5kIGVtaXQgZGF0YVxyXG4gICAgICBjb25zdCBFTUlUX0RBVEEgPSAoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5ldmVudEVtaXQoY29kZSk7XHJcbiAgICAgICAgdGhpcy5kYXRhRm9yUmVzaXplID0gY29kZTtcclxuICAgICAgfTtcclxuICAgICAgLy8gSFRNTEltYWdlRWxlbWVudFxyXG4gICAgICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIEhUTUxJbWFnZUVsZW1lbnQpIHtcclxuICAgICAgICBjYWxsYmFjayh0cnVlKTtcclxuICAgICAgICBFTUlUX0RBVEEoKTtcclxuICAgICAgICBWSUJSQVRFKHRoaXMudmlicmF0ZSk7XHJcbiAgICAgICAgUExBWV9BVURJTyh0aGlzLmlzQmVlcCk7XHJcbiAgICAgIH1cclxuICAgICAgLy8gSFRNTFZpZGVvRWxlbWVudFxyXG4gICAgICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIEhUTUxWaWRlb0VsZW1lbnQpIHtcclxuICAgICAgICBFTUlUX0RBVEEoKTtcclxuICAgICAgICBWSUJSQVRFKHRoaXMudmlicmF0ZSk7XHJcbiAgICAgICAgUExBWV9BVURJTyh0aGlzLmlzQmVlcCk7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNhbGxiYWNrKGZhbHNlKTtcclxuICAgICAgUkVNT1ZFX1JFU1VMVF9QQU5FTCh0aGlzLnJlc3VsdHNQYW5lbC5uYXRpdmVFbGVtZW50KTtcclxuICAgICAgdGhpcy5kYXRhRm9yUmVzaXplID0gW107XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBldmVudEVtaXRcclxuICAgKiBAcGFyYW0gcmVzcG9uc2UgXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBldmVudEVtaXQocmVzcG9uc2U6IGFueSA9IGZhbHNlKTogdm9pZCB7XHJcbiAgICAocmVzcG9uc2UgIT09IGZhbHNlKSAmJiB0aGlzLmRhdGEubmV4dChyZXNwb25zZSB8fCBbXSk7XHJcbiAgICAocmVzcG9uc2UgIT09IGZhbHNlKSAmJiB0aGlzLmV2ZW50LmVtaXQocmVzcG9uc2UgfHwgW10pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2luZ2xlLXRocmVhZFxyXG4gICAqIExvb3AgUmVjb3JkaW5nIG9uIENhbWVyYVxyXG4gICAqIE11c3QgYmUgZGVzdHJveSByZXF1ZXN0IFxyXG4gICAqIE5vdCB1c2luZzogcmVxdWVzdEFuaW1hdGlvbkZyYW1lXHJcbiAgICogQHBhcmFtIGRlbGF5XHJcbiAgICovXHJcbiAgcHJpdmF0ZSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZGVsYXk6IG51bWJlciA9IDApOiB2b2lkIHtcclxuICAgIGNsZWFyVGltZW91dCh0aGlzLnJBRl9JRCk7XHJcbiAgICB0aGlzLnJBRl9JRCA9IHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICBpZiAodGhpcy52aWRlby5uYXRpdmVFbGVtZW50LnJlYWR5U3RhdGUgPT09IHRoaXMudmlkZW8ubmF0aXZlRWxlbWVudC5IQVZFX0VOT1VHSF9EQVRBKSB7XHJcbiAgICAgICAgZGVsYXkgPSAwOyAvLyBBcHB5IGZpcnN0IHJlcXVlc3RcclxuICAgICAgICBXQVNNX1JFQURZKCkgJiYgdGhpcy5kcmF3SW1hZ2UodGhpcy52aWRlby5uYXRpdmVFbGVtZW50KTtcclxuICAgICAgICB0aGlzLmlzU3RhcnQgJiYgIXRoaXMuaXNQYXVzZSAmJiB0aGlzLnJlcXVlc3RBbmltYXRpb25GcmFtZShkZWxheSk7XHJcbiAgICAgIH1cclxuICAgIH0sIC8qYXZvaWQgY2FjaGUgbWVkaWFTdHJlYW0qLyBkZWxheSB8fCB0aGlzLmZwcyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBpc1JlYWR5XHJcbiAgICovXHJcbiAgZ2V0IGlzUmVhZHkoKTogQXN5bmNTdWJqZWN0PGJvb2xlYW4+IHtcclxuICAgIHJldHVybiB0aGlzLnJlYWR5O1xyXG4gIH1cclxuXHJcbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XHJcbiAgICB0aGlzLnBhdXNlKCk7XHJcbiAgfVxyXG59XHJcbiJdfQ==