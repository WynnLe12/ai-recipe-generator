import { util } from "@aws-appsync/utils";
export function request(ctx) {
  const { ingredients = [] } = ctx.args;

  // Construct the prompt with the provided ingredients
  const prompt = `Suggest a recipe idea using these ingredients: ${ingredients.join(", ")}.`;

  // Return the request configuration
  return {
    resourcePath: "/model/amazon.nova-micro-v1:0/invoke",
    method: "POST",
    params: {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: [
              {
                text: prompt,
              },
            ],
          },
        ],
        inferenceConfig: {
          max_new_tokens: 1000,
          temperature: 0.7,
        },
      }),
    },
  };
}

export function response(ctx) {
  if (ctx.error) {
    return util.error(ctx.error.message, ctx.error.type);
  }

  // Parse the response body
  const parsedBody = JSON.parse(ctx.result.body);

  // Extract the generated recipe text
  return {
    body: parsedBody.output.message.content[0].text,
  };
}
