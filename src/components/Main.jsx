import { useState, useRef, useEffect } from "react";
import IngredientsList from "./IngredientsList";
import LlmRecipe from "./LlmRecipe";
import { v4 as uuidv4 } from 'uuid';
import lottie from "lottie-web/build/player/lottie_light";
import animationData from '/src/assets/cooking-loading.json';

const testRecipe = `
    Okay, with bacon, cheese, passata, and rice, here's a recipe for **Cheesy Bacon Rice with Tomato Sauce**:

**Ingredients:**

*   1 cup of rice
*   4 cups of water
*   1 tablespoon of olive oil
*   4-6 slices of bacon, chopped
*   1/2 onion, chopped (optional)
*   1 clove garlic, minced (optional)
*   1 cup of passata (or tomato sauce)
*   1/2 teaspoon dried oregano (optional)
*   Salt and pepper to taste
*   1/2 cup shredded cheese (cheddar, mozzarella, or your favorite)
*   Fresh parsley, chopped (for garnish - optional)

**Instructions:**

1.  **Cook the Rice:** Rinse the rice under cold water until the water runs clear. In a medium saucepan, bring the water to a boil. Add the rice, reduce heat to low, cover, and simmer for 18-20 minutes, or until all the water is absorbed and the rice is cooked. Fluff with a fork and set aside.
2.  **Cook the Bacon:** While the rice is cooking, heat the olive oil in a large skillet over medium heat. Add the chopped bacon and cook until crispy. Remove the bacon with a slotted spoon and set aside, leaving the bacon fat in the skillet.
3.  **Sauté Aromatics (Optional):** If using, add the chopped onion to the skillet with the bacon fat and cook until softened, about 5 minutes. Add the minced garlic and cook for another minute until fragrant.
4.  **Make the Tomato Sauce:** Pour the passata into the skillet with the bacon fat and onions/garlic (if using). Stir in the dried oregano (if using), salt, and pepper. Bring to a simmer and cook for about 5-10 minutes, stirring occasionally, to allow the flavors to meld.
5.  **Combine and Bake:** Preheat oven to 350 degrees. In a large bowl, combine the cooked rice, cooked bacon, and tomato sauce. Stir well to combine. Pour the mixture into a baking dish.
6.  **Add Cheese and Bake:** Sprinkle the shredded cheese evenly over the rice mixture. Bake in the preheated oven for 10-15 minutes, or until the cheese is melted and bubbly.
7.  **Garnish and Serve:** Remove from the oven and let cool slightly. Garnish with fresh parsley, if desired. Serve hot.

Enjoy!

    `;

const testIngredients = [
    {
        id: uuidv4(),
        value: 'Rice',
    },
    {
        id: uuidv4(),
        value: 'Bacon',
    },
    {
        id: uuidv4(),
        value: 'Cheddar cheese',
    },
    {
        id: uuidv4(),
        value: 'Flour',
    },
    {
        id: uuidv4(),
        value: 'Butter',
    },
    {
        id: uuidv4(),
        value: 'Spices and Herbs',
    },
]
export default function Main() {
    const [ingredients, setIngredients] = useState([]);
    const [recipe, setRecipe ] = useState(''); 
    const [isRecipeLoading, setIsRecipeLoading] = useState(false);
    const [isIngredientsExiting, setIsIngredientsExiting] = useState(false);
    const [isLoaderExiting, setIsLoaderExiting] = useState(false);
    const [isRecipeExiting, setIsRecipeExiting] = useState(false);
    const [isCooldownActive, setIsCooldownActive] = useState(false);
    const [timeCount, setTimeCount] = useState(10);
    const [status, setStatus] = useState('required');
    const [token, setToken] = useState('');
    const [error, setError] = useState('');

    const containerAnimRef = useRef(null);
    const getRecipeRef = useRef(null)

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    useEffect(() => {
        const animation = lottie.loadAnimation({
            container: containerAnimRef.current,
            renderer: 'svg', 
            loop: true,
            autoplay: true,
            animationData: animationData
        });
        return () => animation.destroy();
    }, [isRecipeLoading]);  

    useEffect (() => {
        if (isRecipeLoading && getRecipeRef.current !== null) {
            getRecipeRef.current.scrollIntoView({behavior: "smooth"});
        }
        
    }, [isRecipeLoading]);

    const handleIngredientSubmit = (formData) => {
        setIngredients(prevIngredients => [...prevIngredients, {id: uuidv4(), value:formData.get("ingredient")}]);
    }

    const handleIngredientsReset = () => {
        setIsIngredientsExiting(true);
    }

    const handleResetEnd = () => {
        if (isIngredientsExiting) {
            setIngredients([]);
            setIsIngredientsExiting(false);
        }
    }

    const handleLoaderEnd = () => {
        if (isLoaderExiting) {
            setIsRecipeLoading(false);
            setIsLoaderExiting(false);
            handleCooldown(10);
        }
    }

    const handleRecipeRedo = () => {
        if (isRecipeExiting) {
            setIsRecipeExiting(false);
            setIsRecipeLoading(true);
        }
    }

    const handleCooldown = async (seconds) => {
        setIsCooldownActive(true);
        for (let i = seconds; i > 0; i--) {
            setTimeCount(i);
            await delay(1000);
        }
        setIsCooldownActive(false);
    }

    const handleVerify = async () => {
        if (status ==='validated') {
            return true;
        }
        if (status ==='required') {
            setError('Please validate that you are not a bot.');
            return false;
        } else if (status === 'expired') {
            setError('Token has expired. Please revalidate Token.');
        }else if ((status === 'success' || status ==='invalid'
        ) & token != '') {
            try {
                const turnstileRes = await fetch(
                    '/.netlify/functions/validate-turnstile', {
                        method: "POST",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify({ token: token }),
                    }
                );

                const turnstileData = await turnstileRes.json();

                if (turnstileData.success) {
                    setError('');
                    setStatus('validated');
                    return true;
                }
                setStatus('invalid');
                setError('Please validate that you are not a bot.');
                console.log(turnstileData.dataDump);
                throw new Error(`${turnstileRes.status} ${turnstileRes.statusText}: ${turnstileData.errorMessage}`)
            } catch (error) {
                console.error(error);
                return false;
            }
            
        } else {
            setError('There has been an error, please refresh the page.');
            return false;
        }
    }

    const getRecipe = async () => {
        if (recipe != '') {
            setIsRecipeExiting(true);
        } else {
            setIsRecipeLoading(true);
        }
        const verifyResult = await handleVerify()
        if (verifyResult) {
            try {
                const recipeMdResponse = await fetch(
                    '/.netlify/functions/generate-recipe', {
                        method: "POST",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify({ingredientsObjArr: ingredients})
                    }
                );
                if (!recipeMdResponse.ok) {
                    const errorData = await recipeMdResponse.json();

                    console.error(errorData.stack);
                    throw new Error(`${recipeMdResponse.status} ${recipeMdResponse.statusText}: ${errorData.errorMessage}`);
                }
                const recipeMdData = await recipeMdResponse.json();

                setRecipe(recipeMdData.recipe);
                // console.log(recipeMdData);

                // testFormat()
            } catch (error) {
                console.error(error);
            }
        }

        
        setIsLoaderExiting(true);
    }

    const testFormat = async () => { 
        await delay(1000);
        setRecipe(testRecipe);
    }

    return (
        <main>
            <form action={handleIngredientSubmit} className='add-ingredients-form'>
                <input
                    name="ingredient"
                    type="text"
                    placeholder="e.g. paprika"
                    aria-label="Add ingredient"
                    pattern='(?=.*[a-zA-Z])[a-zA-Z0-9 ]{3,40}'
                    required
                />
                <button>{window.innerWidth > 350 ? "Add " : ""}Ingredient</button>
            </form>
            <IngredientsList 
                ingredients={ingredients} 
                getRecipe={getRecipe} 
                isLoading={isRecipeLoading}
                handleReset={handleIngredientsReset}
                isIngredientsExiting={isIngredientsExiting}
                handleResetEnd={handleResetEnd}
                isRecipeExiting={isRecipeExiting}
                isCooldownActive={isCooldownActive}
                timeCount={timeCount}
                setStatus={setStatus}
                status={status}
                setToken={setToken}
                errorMessage={error}
                ref={getRecipeRef}
            />
            {isRecipeLoading ? 
                <div 
                    className={`loading-container ${isLoaderExiting ? 'box-exit' : ''}`}
                    onAnimationEnd={handleLoaderEnd}
                >
                    <div ref={containerAnimRef} className="loading-animation"></div> 
                </div> 
                : (recipe != '' 
                    ? <LlmRecipe
                        recipe={recipe}
                        handleRecipeRedo={handleRecipeRedo}
                        isRecipeExiting={isRecipeExiting}
                    />
            : null)}
            
        </main>
    )
}