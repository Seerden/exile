import { itemObj } from '../api/ninjaPages.js';
import { fetchNinjaPage } from '../api/ninjaApi.js';
import { writeFileSync, openSync, closeSync } from 'fs';
import path from 'path';
;
function parseNinjaPage(lines, fields) {
    // extract only the requested fields from the poe.ninja API response
    const result = [];
    for (const [index, item] of lines.entries()) {
        result.push(fields.reduce((acc, cur) => {
            return { ...acc, [cur]: lines[index][cur] };
        }, {}));
    }
    return result;
}
async function locallyStoreNinjaPage(league, itemType, fields) {
    try {
        const ninjaPage = await fetchNinjaPage(league, itemType);
        const parsedPage = parseNinjaPage(ninjaPage, fields);
        if (parsedPage) {
            const filepath = path.join(path.resolve(), `backend/helpers/api/staticNinjaPages/${itemType.kind}/${itemType.type}.json`);
            closeSync(openSync(filepath, 'w'));
            const parsedPageWithMetaData = {
                type: itemType.type,
                date: new Date(),
                items: parsedPage
            };
            writeFileSync(filepath, JSON.stringify(parsedPageWithMetaData));
            console.log(`Saved response from poe.ninja for ${itemType.type} page`);
        }
    }
    catch (error) {
        console.error(error);
    }
}
for (const entry of itemObj) {
    await locallyStoreNinjaPage('Ritual', { kind: 'Item', type: entry.type }, ['name', 'icon']);
}
//# sourceMappingURL=staticNinjaResults.js.map