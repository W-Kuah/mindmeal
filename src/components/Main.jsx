import { useState } from "react";
import IngredientsList from "./IngredientsList";
import LlmRecipe from "./LlmRecipe";
import getRecipeFromLLM from "../hooks/ai";
import cooking_gif from "../assets/cooking-loading.gif";

export default function Main() {
    const [ingredients, setIngredients] = useState([]);
    const [recipe, setRecipe ] = useState("");
    const [isRecipeLoading, setIsRecipeLoading] = useState(false);


    const handleIngredientSubmit = (formData) => {
        setIngredients(prevIngredients => [...prevIngredients, formData.get("ingredient")]);
        console.log('form submitted');
    }

    const getRecipe = async () => {
        setIsRecipeLoading(true);
        const recipeMd = await getRecipeFromLLM(ingredients);
        setIsRecipeLoading(false);
        setRecipe(recipeMd);
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
                <IngredientsList ingredients={ingredients} getRecipe={getRecipe}/>
            :null}
            {isRecipeLoading ? <img src={cooking_gif} /> : (recipe != '' ?
                <LlmRecipe recipe={recipe}/>
            : null)}
            
        </main>
    )
}``