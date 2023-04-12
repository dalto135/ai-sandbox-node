import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
    if (!configuration.apiKey) {
        res.status(500).json({
        error: {
            message: "OpenAI API key not configured, please follow instructions in README.md",
        }
        });
        return;
    }

    const image1 = req.body.image1 || "public/dog.png";
    const image2 = req.body.image2 || "public/dog.png";
    const prompt = req.body.prompt || "cat";

    const fs = require('fs');

    try {
        const response = await openai.createImageEdit(
            fs.createReadStream(image1),
            fs.createReadStream(image2),
            generatePrompt(prompt),
            1,
            "512x512"
        );
        res.status(200).json({ result: response.data.data[0].url });
    } catch(error) {
        // Consider adjusting the error handling logic for your use case
        if (error.response) {
        console.error(error.response.status, error.response.data);
        res.status(error.response.status).json(error.response.data);
        } else {
        console.error(`Error with OpenAI API request: ${error.message}`);
        res.status(500).json({
            error: {
            message: 'An error occurred during your request.',
            }
        });
        }
    }
}

function generatePrompt(prompt) {
    const capitalizedPrompt = prompt[0].toUpperCase() + prompt.slice(1).toLowerCase();

    // return `
    //     Suggest three names for an animal that is a superhero.
    //     Animal: Cat
    //     Names: Captain Sharpclaw, Agent Fluffball, The Incredible Feline
    //     Animal: Dog
    //     Names: Ruff the Protector, Wonder Canine, Sir Barks-a-Lot
    //     Animal: ${capitalizedPrompt}
    //     Names:
    // `;
    return capitalizedPrompt;
}
