import './style/MenuButton.scss';

interface MenuButtonProps {
    text: string
}

const MenuButton = ({ text }: MenuButtonProps) => {

    return (
        <li className="MenuButton">
            <button className="MenuButton__button">
                {text}
            </button>
        </li>
    )
}

export default MenuButton