import { itemObj, currencyObj, ItemTypeInterface } from '../api/ninjaPages.js';
import { fetchNinjaPage } from '../api/ninjaApi.js';
import { readFileSync, writeFileSync, openSync, closeSync, open, close } from 'fs';
import path from 'path';

type ParsedNinjaResponse = {
    name?: string,
    icon?: string,
    [key: string]: any
}[];

type NinjaFields = string[];

type NinjaResponse = Array<{ [key: string]: string | string[] | number[] }>;

interface ParsedPageWithMetaData {
    type: string,
    date: Date,
    items: ParsedNinjaResponse
};

function parseNinjaPage(lines: NinjaResponse, fields: NinjaFields): ParsedNinjaResponse {
    // extract only the requested fields from the poe.ninja API response
    const result: Object[] = [];

    for (const [index, item] of lines.entries()) {
        result.push(fields.reduce((acc, cur) => {
            return { ...acc, [cur]: lines[index][cur] }
        }, {}))
    }

    return result;
}

async function locallyStoreNinjaPage(league: string, itemType: ItemTypeInterface, fields: NinjaFields): Promise<void> {
    try {
        const ninjaPage = await fetchNinjaPage(league, itemType)
        const parsedPage = parseNinjaPage(ninjaPage, fields)

        if (parsedPage) {
            const filepath = path.join(path.resolve(), `backend/helpers/api/staticNinjaPages/${itemType.kind}/${itemType.type}.json`);

            closeSync(openSync(filepath, 'w'));

            const parsedPageWithMetaData: ParsedPageWithMetaData = {
                type: itemType.type,
                date: new Date(),
                items: parsedPage
            }

            writeFileSync(filepath, JSON.stringify(parsedPageWithMetaData));
            console.log(`Saved response from poe.ninja for ${itemType.type} page`);
        }
    } catch (error) {
        console.error(error);
    }
}

async function locallyStoreAllNinjaItemPages() {
    for (const entry of itemObj) {
        await locallyStoreNinjaPage('Ritual', { kind: 'Item', type: entry.type }, ['name', 'icon'])
    }
}