import './style/MenuButton.scss';

interface MenuButtonProps {
    text: string
}

const MenuButton = ({ text }: MenuButtonProps) => {

    return (
        <li className="MenuButton">
            {text}
        </li>
    )
}

export default MenuButton