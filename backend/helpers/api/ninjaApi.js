import axios from 'axios';
import { itemObj, currencyObj } from '../api/ninjaPages';

export function getItemPageFromNinjaApi(league, itemType) {
    const { kind, type } = itemType
    const url = `https://poe.ninja/api/data/${kind}Overview?league=${league}&type=${type}`;

    return axios.get(url)
        .then(res => res.data.lines)
        .catch(err => err)
}

export function getItemPageAndParseToChaos(league, itemType) {
    return getItemPageFromNinjaApi(league, itemType)
        .then(lines => {
            return lines.map(item => ({
                name: item.name || item.currencyTypeName,
                chaosValue: item.chaosValue || item.chaosEquivalent
            })) || []
        })
}

export async function getAndParseAllItemPagesToChaos(league) {
    let chaosValues = [
        ...customPrices
    ];

    for (const itemType of [...itemObj, ...currencyObj]) {
        await getItemPageAndParseToChaos(league, itemType)
            .then(parsedPage => {
                chaosValues.push(parsedPage)
            })
    }

    return chaosValues.flat();
}

const customPrices = [  // custom pricelist. @todo: allow user definition. place in proper location
    { name: 'Chaos Orb', chaosValue: 1 },
    { name: 'Foreboding Incubator', chaosValue: 4.5 },
    { name: 'Fossilised Incubator', chaosValue: 0.5 },
    { name: "Diviner's Incubator", chaosValue: 3.5 },
    { name: "Geomancer's Incubator", chaosValue: 4 },
    { name: "Skittering Incubator", chaosValue: 0.25 },
]