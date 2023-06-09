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

    const prompt = req.body.prompt || "Psychedelic nature scene";
    if (prompt.trim().length === 0) {
        res.status(400).json({
        error: {
            message: "Please enter a valid prompt",
        }
        });
        return;
    }

    const imageNumber = Number(req.body.imageNumber) || 1;
    if (imageNumber == 0) {
        res.status(400).json({
        error: {
            message: "Please select a number",
        }
        });
        return;
    }

    const imageSize = req.body.imageSize || "256x256";
    if (imageSize == "") {
        res.status(400).json({
        error: {
            message: "Please select an image size",
        }
        });
        return;
    }

    try {
        const response = await openai.createImage({
            prompt: generatePrompt(prompt),
            n: imageNumber,
            size: imageSize,
            // response_format: "url",
            // user: "user"
        });

        function getUrl(image) {
            return image.url
        }

        res.status(200).json({ result: response.data.data.map(getUrl) });
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
