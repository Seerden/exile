import poeStaticItems from 'helpers/static/parseStatic'

interface ExchangeProps {
    have: string[],
    want: string[],
    minimum: number
}

const baseQuery = { 
    "exchange": {
        "status": {
            "option": "online" // "onlineleague" also works
        },
        "have": ["exalted"],
        "want": ["chaos"],
        "minimum": 20,
    }
}

export function makePoeTradeExchangeUrl({ have, want, minimum}: ExchangeProps) {
    const query = {
        ...baseQuery,
        exchange: {
            ...baseQuery.exchange,
            have,
            want, 
            minimum
        }
    };

    const queryString = JSON.stringify(query).replaceAll('"', "%22");
    const baseUrl = 'https://www.pathofexile.com/trade/exchange/Ultimatum';

    return `${baseUrl}?q=${queryString}`;
}

export function getPoeItemId(typeLine: string) {
    return poeStaticItems.filter(entry => entry.text === typeLine)[0]?.id
}