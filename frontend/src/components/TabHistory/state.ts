import { atom } from 'recoil';

export const filteredDataState = atom<DataPoint[]>({
    key: 'filteredData',
    default: []
});