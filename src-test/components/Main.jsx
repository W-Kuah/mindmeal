import { useState } from "react";

export default function Main() {
    const [ingredients, setIngredients] = useState([]);

    const handleIngredientSubmit = (formData) => {
        setIngredients(prevIngredients => [...prevIngredients, formData.get("ingredient")]);
        console.log('form submitted');
    }
    
    const ingredientsListItems = ingredients.map((ingredient) => (
                    <li key={ingredient}>{ingredient}</li>
                ));
    console.log(window.innerWidth);
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
            <section className="ingredients-section">
                <div className="ingredients-container">
                    <h2>Leftover Ingredients:</h2>
                    <ul className="ingredients-list" aria-live="polite">
                        {ingredientsListItems}
                    </ul>
                </div>
                <div className="get-recipe-container">
                    <div>
                        <h3>Ready for a recipe?</h3>
                        <p> Ask AI to create a recipe from your leftover ingredients.</p>
                    </div>
                    <button>Generate Recipe</button>
                </div>
            </section>
            
        </main>
    )
}