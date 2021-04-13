import path from 'path';
import { readFileSync, writeFileSync } from 'fs';

export function storeNinjaValueSnapshot(chaosValueEntry) {
    const filepath = path.join(path.resolve(), '/helpers/api/ninjaChaosValues.json');
    const ninjaChaosValues = JSON.parse(readFileSync(filepath).toString());
    ninjaChaosValues.push(chaosValueEntry);
    writeFileSync(filepath, JSON.stringify(ninjaChaosValues))
}