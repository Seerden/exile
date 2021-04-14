export interface AccountInfoInterface {
    accountName: string,
    league: string,
    POESESSID: string
}

export interface AccountInfoFormInterface {
    accountInfo: AccountInfoInterface,
    handleAccountInfoFormFieldChange: React.ChangeEventHandler,
    handleAccountInfoFormSubmit: React.MouseEventHandler
}