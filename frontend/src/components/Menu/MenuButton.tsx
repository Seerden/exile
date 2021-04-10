import './style/MenuButton.scss';

interface MenuButtonProps {
    text: string
}

const MenuButton = ({ text }: MenuButtonProps) => {

    return (
        <div className="MenuButton">
            {text}
        </div>
    )
}

export default MenuButton