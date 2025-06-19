import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { generateText } from 'ai';

const SYSTEM_PROMPT = `
You are an assistant that receives a list of ingredients that a user has and suggests a recipe they could make with some or all of those ingredients. You don't need to use every ingredient they mention in your recipe. The recipe can include additional ingredients they didn't mention, but try not to include too many extra ingredients. Format your response in markdown to make it easier to render to a web page. If using "#" always use 3 or more. Always starts with the title of the food.
`

const OPEN_ROUTER_ACCESS_TOKEN = process.env.VITE_OPEN_ROUTER_ACCESS_TOKEN;

const openrouter = createOpenRouter({ apiKey: OPEN_ROUTER_ACCESS_TOKEN});
const model = openrouter('google/gemini-2.0-flash-001');

async function getRecipeFromOPA(ingredientsString) {
    const response = await generateText({
        model,
        messages:  [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: `I have ${ingredientsString}. Please give me a recipe you'd recommend I make!` },
        ],
        providerOptions: {
            openrouter: {
                reasoning: {
                    max_tokens: 1024,
                },
            },
        },
    });

    return response.text;

}

exports.handler = async function (event) {

    if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ errorMessage: 'Method not allowed' })
    };
  }

    try {
        const { ingredientsObjArr } = JSON.parse(event.body);
        const ingredientsArr = ingredientsObjArr.map(ingredientObj => ingredientObj.value);
        const ingredientsString = ingredientsArr.join(", ");
        const recipeMd = await getRecipeFromOPA(ingredientsString);
        return {
            statusCode: 200,
            body: JSON.stringify({
                recipe: recipeMd
            })
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                errorMessage: error.message,
                stack: process.env.CONTEXT === 'dev' ? error.stack : undefined,
            })
        };
    }
}