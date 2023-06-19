import { Injectable } from '@angular/core';
import { AsyncSubject } from 'rxjs';
import { AS_COMPLETE, COMPRESS_IMAGE_FILE, FILES_TO_SCAN } from './ngx-scanner-qrcode.helper';
import * as i0 from "@angular/core";
class NgxScannerQrcodeService {
    /**
     * loadFiles
     * @param files
     * @param quality
     * @param type
     * @returns
     */
    loadFiles(files = [], quality, type) {
        const as = new AsyncSubject();
        COMPRESS_IMAGE_FILE(files, quality, type).then((_files) => {
            Promise.all(Object.assign([], files).map(m => this.readAsDataURL(m))).then((img) => AS_COMPLETE(as, img)).catch((error) => AS_COMPLETE(as, null, error));
        });
        return as;
    }
    /**
     * loadFilesToScan
     * @param files
     * @param config
     * @param quality
     * @param type
     * @returns
     */
    loadFilesToScan(files = [], config, quality, type) {
        return FILES_TO_SCAN(files, config, quality, type);
    }
    /**
     * readAsDataURL
     * @param file
     * @returns
     */
    readAsDataURL(file) {
        /** drawImage **/
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.onload = () => {
                const objectFile = {
                    name: file.name,
                    file: file,
                    url: URL.createObjectURL(file)
                };
                resolve(objectFile);
            };
            fileReader.onerror = (error) => reject(error);
            fileReader.readAsDataURL(file);
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.3", ngImport: i0, type: NgxScannerQrcodeService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.0.3", ngImport: i0, type: NgxScannerQrcodeService, providedIn: 'root' }); }
}
export { NgxScannerQrcodeService };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.3", ngImport: i0, type: NgxScannerQrcodeService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXNjYW5uZXItcXJjb2RlLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtc2Nhbm5lci1xcmNvZGUvc3JjL2xpYi9uZ3gtc2Nhbm5lci1xcmNvZGUuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDcEMsT0FBTyxFQUFFLFdBQVcsRUFBRSxtQkFBbUIsRUFBRSxhQUFhLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQzs7QUFHOUYsTUFHYSx1QkFBdUI7SUFFbEM7Ozs7OztPQU1HO0lBQ0ksU0FBUyxDQUFDLFFBQWdCLEVBQUUsRUFBRSxPQUFnQixFQUFFLElBQWE7UUFDbEUsTUFBTSxFQUFFLEdBQUcsSUFBSSxZQUFZLEVBQWdDLENBQUM7UUFDNUQsbUJBQW1CLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFXLEVBQUUsRUFBRTtZQUM3RCxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQWlDLEVBQUUsRUFBRSxDQUFDLFdBQVcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFVLEVBQUUsRUFBRSxDQUFDLFdBQVcsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDOUwsQ0FBQyxDQUFDLENBQUM7UUFDSCxPQUFPLEVBQUUsQ0FBQztJQUNaLENBQUM7SUFFRDs7Ozs7OztPQU9HO0lBQ0ksZUFBZSxDQUFDLFFBQWdCLEVBQUUsRUFBRSxNQUEyQixFQUFFLE9BQWdCLEVBQUUsSUFBYTtRQUNyRyxPQUFPLGFBQWEsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNyRCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNLLGFBQWEsQ0FBQyxJQUFVO1FBQzlCLGlCQUFpQjtRQUNqQixPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1lBQ3JDLE1BQU0sVUFBVSxHQUFHLElBQUksVUFBVSxFQUFFLENBQUM7WUFDcEMsVUFBVSxDQUFDLE1BQU0sR0FBRyxHQUFHLEVBQUU7Z0JBQ3ZCLE1BQU0sVUFBVSxHQUFHO29CQUNqQixJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7b0JBQ2YsSUFBSSxFQUFFLElBQUk7b0JBQ1YsR0FBRyxFQUFFLEdBQUcsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDO2lCQUMvQixDQUFDO2dCQUNGLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUN0QixDQUFDLENBQUE7WUFDRCxVQUFVLENBQUMsT0FBTyxHQUFHLENBQUMsS0FBVSxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDbkQsVUFBVSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNqQyxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUM7OEdBakRVLHVCQUF1QjtrSEFBdkIsdUJBQXVCLGNBRnRCLE1BQU07O1NBRVAsdUJBQXVCOzJGQUF2Qix1QkFBdUI7a0JBSG5DLFVBQVU7bUJBQUM7b0JBQ1YsVUFBVSxFQUFFLE1BQU07aUJBQ25CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBBc3luY1N1YmplY3QgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgQVNfQ09NUExFVEUsIENPTVBSRVNTX0lNQUdFX0ZJTEUsIEZJTEVTX1RPX1NDQU4gfSBmcm9tICcuL25neC1zY2FubmVyLXFyY29kZS5oZWxwZXInO1xyXG5pbXBvcnQgeyBTY2FubmVyUVJDb2RlQ29uZmlnLCBTY2FubmVyUVJDb2RlU2VsZWN0ZWRGaWxlcyB9IGZyb20gJy4vbmd4LXNjYW5uZXItcXJjb2RlLm9wdGlvbnMnO1xyXG5cclxuQEluamVjdGFibGUoe1xyXG4gIHByb3ZpZGVkSW46ICdyb290J1xyXG59KVxyXG5leHBvcnQgY2xhc3MgTmd4U2Nhbm5lclFyY29kZVNlcnZpY2Uge1xyXG5cclxuICAvKipcclxuICAgKiBsb2FkRmlsZXNcclxuICAgKiBAcGFyYW0gZmlsZXMgXHJcbiAgICogQHBhcmFtIHF1YWxpdHkgXHJcbiAgICogQHBhcmFtIHR5cGUgXHJcbiAgICogQHJldHVybnMgXHJcbiAgICovXHJcbiAgcHVibGljIGxvYWRGaWxlcyhmaWxlczogRmlsZVtdID0gW10sIHF1YWxpdHk/OiBudW1iZXIsIHR5cGU/OiBzdHJpbmcpOiBBc3luY1N1YmplY3Q8U2Nhbm5lclFSQ29kZVNlbGVjdGVkRmlsZXNbXT4ge1xyXG4gICAgY29uc3QgYXMgPSBuZXcgQXN5bmNTdWJqZWN0PFNjYW5uZXJRUkNvZGVTZWxlY3RlZEZpbGVzW10+KCk7XHJcbiAgICBDT01QUkVTU19JTUFHRV9GSUxFKGZpbGVzLCBxdWFsaXR5LCB0eXBlKS50aGVuKChfZmlsZXM6IGFueSkgPT4ge1xyXG4gICAgICBQcm9taXNlLmFsbChPYmplY3QuYXNzaWduKFtdLCBmaWxlcykubWFwKG0gPT4gdGhpcy5yZWFkQXNEYXRhVVJMKG0pKSkudGhlbigoaW1nOiBTY2FubmVyUVJDb2RlU2VsZWN0ZWRGaWxlc1tdKSA9PiBBU19DT01QTEVURShhcywgaW1nKSkuY2F0Y2goKGVycm9yOiBhbnkpID0+IEFTX0NPTVBMRVRFKGFzLCBudWxsLCBlcnJvcikpO1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gYXM7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBsb2FkRmlsZXNUb1NjYW5cclxuICAgKiBAcGFyYW0gZmlsZXMgXHJcbiAgICogQHBhcmFtIGNvbmZpZyBcclxuICAgKiBAcGFyYW0gcXVhbGl0eSBcclxuICAgKiBAcGFyYW0gdHlwZSBcclxuICAgKiBAcmV0dXJucyBcclxuICAgKi9cclxuICBwdWJsaWMgbG9hZEZpbGVzVG9TY2FuKGZpbGVzOiBGaWxlW10gPSBbXSwgY29uZmlnOiBTY2FubmVyUVJDb2RlQ29uZmlnLCBxdWFsaXR5PzogbnVtYmVyLCB0eXBlPzogc3RyaW5nKTogQXN5bmNTdWJqZWN0PFNjYW5uZXJRUkNvZGVTZWxlY3RlZEZpbGVzW10+IHtcclxuICAgIHJldHVybiBGSUxFU19UT19TQ0FOKGZpbGVzLCBjb25maWcsIHF1YWxpdHksIHR5cGUpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogcmVhZEFzRGF0YVVSTFxyXG4gICAqIEBwYXJhbSBmaWxlIFxyXG4gICAqIEByZXR1cm5zIFxyXG4gICAqL1xyXG4gIHByaXZhdGUgcmVhZEFzRGF0YVVSTChmaWxlOiBGaWxlKTogUHJvbWlzZTxTY2FubmVyUVJDb2RlU2VsZWN0ZWRGaWxlcz4ge1xyXG4gICAgLyoqIGRyYXdJbWFnZSAqKi9cclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIGNvbnN0IGZpbGVSZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xyXG4gICAgICBmaWxlUmVhZGVyLm9ubG9hZCA9ICgpID0+IHtcclxuICAgICAgICBjb25zdCBvYmplY3RGaWxlID0ge1xyXG4gICAgICAgICAgbmFtZTogZmlsZS5uYW1lLFxyXG4gICAgICAgICAgZmlsZTogZmlsZSxcclxuICAgICAgICAgIHVybDogVVJMLmNyZWF0ZU9iamVjdFVSTChmaWxlKVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmVzb2x2ZShvYmplY3RGaWxlKTtcclxuICAgICAgfVxyXG4gICAgICBmaWxlUmVhZGVyLm9uZXJyb3IgPSAoZXJyb3I6IGFueSkgPT4gcmVqZWN0KGVycm9yKTtcclxuICAgICAgZmlsZVJlYWRlci5yZWFkQXNEYXRhVVJMKGZpbGUpO1xyXG4gICAgfSlcclxuICB9XHJcbn0iXX0=