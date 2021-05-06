import { poeStatic } from './static';

const result = poeStatic.result;
const entries = result.map(entry => entry.entries);

export default entries.flat()