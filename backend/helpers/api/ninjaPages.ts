const itemTypes = [
    "DeliriumOrb", 
    "Watchstone", 
    "Invitation",
    "Oil", 
    // "Incubator",  // bad pricing on poe.ninja sometimes, leave out for now
    "Scarab", 
    "Fossil", 
    "Resonator", 
    "Essence", 
    "DivinationCard", 
    "Prophecy", 
    // "SkillGem", 
    // "Base Type", 
    // "Helmet Enchant", 
    // "UniqueMap", 
    // "Map", 
    // "UniqueJewel", 
    // "UniqueFlask", 
    // "Unique Weapon", 
    // "Unique Armour", 
    // "UniqueAccessory", 
    // "Beast", 
    "Vial"
]

const currencyTypes = [
    "Currency", 
    "Fragment"
]

export const currencyObj = currencyTypes.map(type => ({
    kind: "Currency",
    type
}))


export interface ItemTypeInterface {
    kind: "Item",
    type: string
}

export type ItemTypesType = Array<ItemTypeInterface>

export const itemObj: ItemTypesType = itemTypes.map(type => ({
    kind: "Item",
    type
}))

console.log('hello')