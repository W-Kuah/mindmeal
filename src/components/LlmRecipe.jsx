import ReactMarkdown from "react-markdown";

export default function LlmRecipe(props) {
    const {recipe} = props;
    return (
        <section className="suggested-recipe-section">
            <h2>MindMeal Suggests:</h2>
            <ReactMarkdown>{recipe}</ReactMarkdown>
        </section>
    );
}