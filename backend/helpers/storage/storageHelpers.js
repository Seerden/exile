export function storeNinjaValueSnapshot(chaosValueEntry) {
    const filepath = path.join(path.resolve(), '/helpers/api/ninjaChaosValues.json');
    const ninjaChaosValues = JSON.parse(readFileSync(filepath));
    ninjaChaosValues.push(chaosValueEntry);
    writeFileSync(loc, JSON.stringify(ninjaChaosValues))
}