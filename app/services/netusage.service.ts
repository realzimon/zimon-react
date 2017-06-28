import {Injectable} from '@angular/core';
import * as io from 'socket.io-client';

import {Observable} from 'rxjs/Rx';
import {Zivi} from './zivi.service';
import {Subscriber} from 'rxjs/Subscriber';
import {ENV} from '../config/environment';

export class NetUsage {
    constructor(readonly hostname: string, readonly recentDownload: number, readonly recentDownloadRate: number,
                readonly totalDownload: number, readonly mac: string, readonly zivi: Zivi) {

    }
}

@Injectable()
export class NetUsageService {
    private socket: any;
    private observable: Observable<NetUsage[]>;

    constructor() {
        this.observable = new Observable<NetUsage[]>((observer: Subscriber<NetUsage[]>) => {
            this.socket = io.connect(ENV.socketUrl);
            this.socket.on('netusage', (data: any) => {
                observer.next(data.usage);
            });
            return () => {
                this.socket.disconnect();
            };
        });
    }

    getNetUsageUpdates(): Observable<NetUsage[]> {
        return this.observable;
    }
}
