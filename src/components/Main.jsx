import { useState, useRef, useEffect } from "react";
import IngredientsList from "./IngredientsList";
import LlmRecipe from "./LlmRecipe";
import {getRecipeFromLLM} from "../hooks/ai";
import { v4 as uuidv4 } from 'uuid';
import lottie from "lottie-web";

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
        value: 'a',
    },
    {
        id: uuidv4(),
        value: 'b',
    },
    {
        id: uuidv4(),
        value: 'c',
    },
    {
        id: uuidv4(),
        value: 'd',
    },
]
export default function Main() {
    const [ingredients, setIngredients] = useState([]);
    const [recipe, setRecipe ] = useState(''); 
    const [isRecipeLoading, setIsRecipeLoading] = useState(false);
    const [isIngredientsExiting, setIsIngredientsExiting] = useState(false);
    const [isLoaderExiting, setIsLoaderExiting] = useState(false);
    const [isRecipeExiting, setIsRecipeExiting] = useState(false);

    const containerAnim = useRef(null);

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    useEffect(() => {
        const animation = lottie.loadAnimation({
            container: containerAnim.current,
            renderer: 'svg', 
            loop: true,
            autoplay: true,
            path: 'src/assets/cooking-loading.json'
        });
        return () => animation.destroy();
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
        } else if (isLoaderExiting) {
            setIsRecipeLoading(false);
            setIsLoaderExiting(false);
        } else if (isRecipeExiting) {
            setIsRecipeExiting(false);
            setIsRecipeLoading(true);
        }
    }

    const getRecipe = async () => {
        if (recipe != '') {
            setIsRecipeExiting(true);
        } else {
            setIsRecipeLoading(true);
        }
        const recipeMd = await getRecipeFromLLM(ingredients);

        // await delay(3000);
        // setRecipe(testRecipe);

        setRecipe(recipeMd);

        setIsLoaderExiting(true);
        // console.log(recipe);
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
            />
            {isRecipeLoading ? 
                <div 
                    className={`loading-container ${isLoaderExiting ? 'box-exit' : ''}`}
                    onAnimationEnd={handleResetEnd}
                >
                    <div ref={containerAnim} className="loading-animation"></div> 
                </div> 
                : (recipe != '' 
                    ? <LlmRecipe
                        recipe={recipe}
                        handleResetEnd={handleResetEnd}
                        isRecipeExiting={isRecipeExiting}
                    />
            : null)}
            
        </main>
    )
}``