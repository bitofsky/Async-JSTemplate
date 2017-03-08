import { Option } from './ns';
export declare const get: (id: string, data?: any, option?: Option | undefined) => Promise<string>;
export declare const ajax: (id: string, url: string, option?: Option | undefined) => Promise<string>;
export declare const each: (id: string, data: Iterable<any>, option?: Option | undefined) => Promise<string>;
export declare const noConflict: () => any;
