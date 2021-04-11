import { AccountInfoFormInterface } from './types';

const AccountInfoForm = ({ accountInfo, handleAccountInfoFormFieldChange, handleAccountInfoFormSubmit }: AccountInfoFormInterface): JSX.Element => {

    return (
        <form className="AccountInfo__form">
            <header className="AccountInfo__header AccountInfo__form--field">
                <h3>
                    Account Information
                </h3>
            </header>

            <div className="AccountInfo__form--field">
                <label className="AccountInfo__form--label" htmlFor="accountName">Account Name:</label>
                <input 
                    className="AccountInfo__form--input" 
                    onChange={e => handleAccountInfoFormFieldChange(e)} 
                    type="text" 
                    name="accountName" 
                    value={accountInfo.accountName} 
                />
            </div>

            <div className="AccountInfo__form--field">
                <label className="AccountInfo__form--label" htmlFor="league">League:</label>
                <select
                    className="AccountInfo__form--input"
                    onChange={e => handleAccountInfoFormFieldChange(e)}
                    name="league"
                    defaultValue="ritual"
                >
                    <option value="ritual">Ritual</option>
                    <option value="hardcore-ritual">Hardcore Ritual</option>
                    <option value="standard">Standard</option>
                    <option value="hardcore-standard">Hardcore Standard</option>
                </select>
            </div>

            <div className="AccountInfo__form--field">
                <label className="AccountInfo__form--label" htmlFor="POESESSID">POESESSID:</label>
                <input 
                    className="AccountInfo__form--input" 
                    onChange={e => handleAccountInfoFormFieldChange(e)} 
                    type="text" 
                    name="POESESSID" 
                    value={accountInfo.POESESSID} 
                />
            </div>

            <button
                onClick={e => handleAccountInfoFormSubmit(e)}
                type="submit"
                className="AccountInfo__form--submit"
            >
                Confirm and verify
            </button>
        </form>
    )
}

export default AccountInfoForm;