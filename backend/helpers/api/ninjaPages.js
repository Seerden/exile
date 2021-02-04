const itemTypes = [
    "DeliriumOrb", 
    "Watchstone", 
    "Invitation",
    "Oil", 
    "Incubator", 
    "Scarab", 
    "Fossil", 
    "Resonator", 
    "Essence", 
    "DivinationCard", 
    "Prophecy", 
    // "SkillGem", 
    // "Base Type", 
    // "Helmet Enchant", 
    "UniqueMap", 
    // "Map", 
    "UniqueJewel", 
    "UniqueFlask", 
    // "Unique Weapon", 
    // "Unique Armour", 
    "UniqueAccessory", 
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

export const itemObj = itemTypes.map(type => ({
    kind: "Item",
    type
}))