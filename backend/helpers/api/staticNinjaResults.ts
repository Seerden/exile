import { itemObj, currencyObj, ItemTypeInterface } from '../api/ninjaPages';
import { fetchNinjaPage } from '../api/ninjaApi';
import { readFileSync, writeFileSync} from 'fs';
import path from 'path';

interface ParsedNinjaResponse {
    [key: string]: any
}

type NinjaFields = string[]

function parseNinjaPage(lines, fields: NinjaFields): ParsedNinjaResponse {
    // extract only the requested fields from the poe.ninja API response
    return fields.reduce((acc, cur) => ({...acc, [cur]: lines[cur]}), {})
}

async function locallyStoreNinjaPage(league: string, itemType: ItemTypeInterface, fields: NinjaFields): Promise<void> {
    try {
        const ninjaPage = await fetchNinjaPage(league, itemType)
        const parsedPage = parseNinjaPage(ninjaPage, fields)
        const filepath = path.join(path.resolve(), `/helpers/api/staticNinjaPages/${itemType.kind}/${itemType.type}.json`);
    
        if (parsedPage) {
            writeFileSync(filepath, JSON.stringify(parsedPage));
        }
    } catch (error) {
        console.error(error);
    }
}