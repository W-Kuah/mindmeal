import { useState } from "react";
import IngredientsList from "./IngredientsList";
import LlmRecipe from "./LlmRecipe";

export default function Main() {
    const [ingredients, setIngredients] = useState([]);
    const [recipeShown, setRecipeShow ] = useState(false);


    const handleIngredientSubmit = (formData) => {
        setIngredients(prevIngredients => [...prevIngredients, formData.get("ingredient")]);
        console.log('form submitted');
    }

    const toggleRecipeShown = () => {
        setRecipeShow(prev => !prev);
    }
    
    return (
        <main>
            <form action={handleIngredientSubmit} className="add-ingredients-form">
                <input
                    name="ingredient"
                    type="text"
                    placeholder="e.g. paprika"
                    aria-label="Add ingredient"
                />
                <button>{window.innerWidth > 350 ? "Add " : ""}Ingredient</button>
            </form>
            {ingredients.length > 0 ? 
                <IngredientsList ingredients={ingredients} handleRecipe={toggleRecipeShown}/>
            :null}
            {recipeShown ?
                <LlmRecipe/>
            : null}
            
        </main>
    )
}``