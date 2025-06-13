export default function IngredientsList(props) {
    const {ingredients, getRecipe} = props;

    const ingredientsListItems = ingredients.map((ingredient) => (
                    <li key={ingredient}>{ingredient}</li>
                ));

    return (
        <section className="ingredients-section">
                    <div className="ingredients-container">
                        <h2>Leftover Ingredients:</h2>
                        <ul className="ingredients-list" aria-live="polite">
                            {ingredientsListItems}
                        </ul>
                    </div>
                    {ingredients.length >= 4 ? 
                        <div className="general-container get-recipe-container">
                            <div>
                                <h3>Ready for a recipe?</h3>
                                <p> Ask AI to create a recipe from your leftover ingredients.</p>
                            </div>
                            <button onClick={getRecipe}>Generate Recipe</button>                     
                        </div> 
                    : 
                        <div className="general-container">
                            <p className="conditional-statement">
                                Add 4 ingredients minimum for recipe generation. 
                            </p>
                        </div>
                    }
                </section> 
    );
}