import MenuButton from './MenuButton';
import './style/Menu.scss';


const menuItems: string[] = [
    "Home",
    "Settings",
    "Session"
]

const Menu = (props: any): JSX.Element => {
    const menuItemsElement: Array<JSX.Element> = menuItems.map((entry, index) => <MenuButton key={`menu-button-${index}`} text={entry} />)

    
    return (
        <div className="Menu">
            <header className="Menu__header">Menu</header>
            <ul className="Menu__list">
                {menuItemsElement}
            </ul>
        </div>
    )
}

export default Menu