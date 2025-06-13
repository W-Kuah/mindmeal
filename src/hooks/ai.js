import { InferenceClient } from '@huggingface/inference'
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { generateText } from 'ai';


const SYSTEM_PROMPT = `
You are an assistant that receives a list of ingredients that a user has and suggests a recipe they could make with some or all of those ingredients. You don't need to use every ingredient they mention in your recipe. The recipe can include additional ingredients they didn't mention, but try not to include too many extra ingredients. Format your response in markdown to make it easier to render to a web page
`

const hf = new InferenceClient(import.meta.env.VITE_HF_ACCESS_TOKEN);
const openrouter = createOpenRouter({ apiKey: import.meta.env.VITE_OPEN_ROUTER_ACCESS_TOKEN});
const model = openrouter('google/gemini-2.0-flash-001');

async function getRecipeFromHF(ingredientsString) {
    try {
        const response = await hf.chatCompletion({
            model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: `I have ${ingredientsString}. Please give me a recipe you'd recommend I make!` },
            ],
            max_tokens: 1024,
        })
        return response.choices[0].message.content
    } catch (err) {
        console.error(err.message)
    }
}


async function getRecipeFromLLM(ingredientsObj) {
    const ingredientsArr = ingredientsObj.map(ingredientObj => ingredientObj.value);
    const ingredientsString = ingredientsArr.join(", ");
    return getRecipeFromOPA(ingredientsString);
}

async function getRecipeFromOPA(ingredientsString) {
    try {
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
        console.log(response.text);
        return response.text;
    } catch (err) {
        console.error(err.message);
    }
}


export {getRecipeFromHF, getRecipeFromLLM} ;
