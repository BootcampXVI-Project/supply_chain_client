import { AsyncSubject } from 'rxjs';
import { ScannerQRCodeConfig, ScannerQRCodeSelectedFiles } from './ngx-scanner-qrcode.options';
import * as i0 from "@angular/core";
export declare class NgxScannerQrcodeService {
    /**
     * loadFiles
     * @param files
     * @param quality
     * @param type
     * @returns
     */
    loadFiles(files?: File[], quality?: number, type?: string): AsyncSubject<ScannerQRCodeSelectedFiles[]>;
    /**
     * loadFilesToScan
     * @param files
     * @param config
     * @param quality
     * @param type
     * @returns
     */
    loadFilesToScan(files: File[] | undefined, config: ScannerQRCodeConfig, quality?: number, type?: string): AsyncSubject<ScannerQRCodeSelectedFiles[]>;
    /**
     * readAsDataURL
     * @param file
     * @returns
     */
    private readAsDataURL;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgxScannerQrcodeService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<NgxScannerQrcodeService>;
}
