import axios from 'axios';
import { itemObj, currencyObj } from './ninjaPages.js';

export async function fetchNinjaPage(league, itemType) {
    const { kind, type } = itemType
    const url = `https://poe.ninja/api/data/${kind}Overview?league=${league}&type=${type}`;

    const res = await axios.get(url);
    if (res) {
        return res.data.lines
    }
}

function parseNinjaPageToChaos(lines) {
    return lines.map(item => ({
        name: item.name || item.currencyTypeName,
        chaosValue: item.chaosValue || item.chaosEquivalent
    })) || []
}

export async function fetchAndParseNinjaPage(league, itemType) {
    const lines = await fetchNinjaPage(league, itemType)
    return parseNinjaPageToChaos(lines);
}

export async function getAndParseAllItemPagesToChaos(league) {
    const chaosValues = [
        ...customPrices
    ];

    for (const itemType of [...itemObj, ...currencyObj]) {
        const parsedPage = await fetchAndParseNinjaPage(league, itemType)

        if (parsedPage) {
            chaosValues.push(parsedPage)
        }
    }

    return chaosValues.flat();
}

const customPrices = [  // custom pricelist. @todo: allow user definition. place in proper location
    { name: 'Chaos Orb', chaosValue: 1 },
    // { name: 'Foreboding Incubator', chaosValue: 4.5 },
    // { name: 'Fossilised Incubator', chaosValue: 0.5 },
    // { name: "Diviner's Incubator", chaosValue: 3.5 },
    // { name: "Geomancer's Incubator", chaosValue: 4 },
    // { name: "Skittering Incubator", chaosValue: 0.25 },
]