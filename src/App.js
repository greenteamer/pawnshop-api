const prompts = require("./prompts");

const fastify = require("fastify")({
  logger: true,
});

let OpenAI = require("openai");

const openai_api_key = process.env.OPENAI_API_KEY;

const openai = new OpenAI({
  apiKey: openai_api_key, // This is the default and can be omitted
});

const initialEval = async (base64_image) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: prompts.containsSingleJewelry },
          {
            type: "image_url",
            image_url: {
              // url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg",
              url: `data:image/jpeg;base64,${base64_image}`,
            },
          },
        ],
      },
    ],
  });

  console.log("openai response: ", response);

  try {
    return JSON.parse(response.choices[0].message.content);
  } catch {
    throw new Error("wrong gpt-4o answer format");
  }
};

// Declare a route
fastify.post("/step1", async function (request, reply) {
  try {
    const { base64 } = request.body;

    // check base64 field in request data
    if (typeof base64 === "string") {
      const gptResponse = await initialEval(base64);
      reply.send(gptResponse);
    } else {
      // error base64 field
      reply.code(400);
      reply.send("base64 field not found.");
    }
  } catch (err) {
    reply.code(500);
    reply.send(err);
  }
});

exports.server = fastify;
