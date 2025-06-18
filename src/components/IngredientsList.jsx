export default function IngredientsList(props) {
    const {ingredients, getRecipe, isLoading, handleReset, isIngredientsExiting, handleResetEnd, isRecipeExiting, isCooldownActive, timeCount} = props;

    const ingredientsListItems = ingredients.map((ingredientObj) => (
                    <li key={ingredientObj.id}>{ingredientObj.value}</li>
                ));

    return (
        <section className="ingredients-section">
                    {ingredients.length === 0 ? 
                        null 
                    : 
                    <>
                        <div 
                            className={`ingredients-container ${isIngredientsExiting ? 'box-exit' : ''}`}
                            onAnimationEnd={handleResetEnd}
                        >
                            <h2>Ingredients:</h2>
                            <ul className="ingredients-list" aria-live="polite">
                                {ingredientsListItems}
                            </ul>
                            <button className='resetButton' onClick={handleReset}>Reset</button>
                        </div>
                    </>
                        
                    }
                    
                    {ingredients.length >= 4 ? 
                        <div className="general-container get-recipe-container">
                            <div>
                                <h3>Ready for a recipe?</h3>
                                <p> Ask AI to create a recipe from your ingredients.</p>
                            </div>
                            <button 
                                onClick={getRecipe} 
                                className={isLoading || isRecipeExiting || isCooldownActive ? "submitting-disabled" : ""}
                                disabled={isLoading || isRecipeExiting || isCooldownActive ? true : false}
                            >
                                {isLoading || isRecipeExiting ? <div className="loader"></div>: (isCooldownActive ? timeCount.toString() : "Generate Recipe")}</button>                     
                        </div> 
                    : 
                        <div className="general-container">
                            <p className="conditional-statement">
                                Add at least 4 ingredients minimum for recipe generation. 
                            </p>
                        </div>
                    }
                </section> 
    );
}