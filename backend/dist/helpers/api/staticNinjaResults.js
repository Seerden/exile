import { fetchNinjaPage } from '../api/ninjaApi';
import { writeFileSync } from 'fs';
import path from 'path';
function parseNinjaPage(lines, fields) {
    // extract only the requested fields from the poe.ninja API response
    return fields.reduce((acc, cur) => ({ ...acc, [cur]: lines[cur] }), {});
}
async function locallyStoreNinjaPage(league, itemType, fields) {
    try {
        const ninjaPage = await fetchNinjaPage(league, itemType);
        const parsedPage = parseNinjaPage(ninjaPage, fields);
        const filepath = path.join(path.resolve(), `/helpers/api/staticNinjaPages/${itemType.kind}/${itemType.type}.json`);
        if (parsedPage) {
            writeFileSync(filepath, JSON.stringify(parsedPage));
        }
    }
    catch (error) {
        console.error(error);
    }
}
//# sourceMappingURL=staticNinjaResults.js.map