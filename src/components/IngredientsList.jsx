import { Turnstile } from '@marsidev/react-turnstile'

export default function IngredientsList(props) {
    const {ingredients, getRecipe, isLoading, handleReset, isIngredientsExiting, handleResetEnd, isRecipeExiting, isCooldownActive, timeCount, setStatus, status, setToken, errorMessage, ref} = props;

    const ingredientsListItems = ingredients.map((ingredientObj) => (
                    <li key={ingredientObj.id}>{ingredientObj.value}</li>
                ));
    
    const handleOutcome = (status, token) => {
        setStatus(status);
        if (token != '') {
            setToken(token);
        }  
    }

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
                            <div ref={ref} className="prompt-box">
                                <h3>Ready for a recipe?</h3>
                                <p> Ask AI to create a recipe from your ingredients.</p>
                                {(status != 'success' & status != 'required' & status != 'validated') ? <span className="errorMessage">{errorMessage}</span> : null}
                            </div>
                            <div className='get-recipe-buttons'>
                                <button 
                                    onClick={getRecipe} 
                                    className={isLoading || isRecipeExiting || isCooldownActive || (status != 'success' & status != 'validated') ? "submitting-disabled" : ""}
                                    disabled={isLoading || isRecipeExiting || isCooldownActive || (status != 'success' & status != 'validated') ? true : false}
                                >
                                    {isLoading || isRecipeExiting ? <div className="loader"></div>: (isCooldownActive ? timeCount.toString() : (status != 'success' & status != 'validated') ? "Validating ↓" :"Generate Recipe")}
                                </button>
                                <Turnstile 
                                    className={(status === 'success' || status === 'validated') ? 'invisible' : ''}
                                    siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY} 
                                    options={{
                                        theme: 'light',
                                        size: 'compact'
                                    }}
                                    onError={() => handleOutcome('error', '')}
                                    onExpire={() => handleOutcome('expired', '')}
                                    onSuccess={(token) => handleOutcome('success', token)}
                                />
                            </div>
                                              
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