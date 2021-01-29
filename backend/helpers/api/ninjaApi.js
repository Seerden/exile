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
            // if (!lines.length > 0) {
            //     console.log(itemType);
            // }
            return lines.map(item => ({
                name: item.name || item.currencyTypeName,
                chaosValue: item.chaosValue || item.chaosEquivalent
            })) || []
        })
}

export async function getAndParseAllItemPagesToChaos(league) {
    let chaosValues = [
        { name: "Chaos Orb", chaosValue: 1 }
    ];

    for (const itemType of [...itemObj, ...currencyObj]) {
        await getItemPageAndParseToChaos(league, itemType)
            .then(parsedPage => {
                chaosValues.push(parsedPage)
            })
    }

    return chaosValues.flat();
}