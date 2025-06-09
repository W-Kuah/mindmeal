
import mindMealLogo from '/src/assets/mindmeal-logo.svg'


const Header = () => {
    return (
       <header>
            <img src={mindMealLogo} alt="" />
            <h1>MindMeal</h1>
       </header>
    )
}

export default Header;