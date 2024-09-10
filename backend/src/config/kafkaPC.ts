import { kafka } from "./kafka";
import { createTopic } from "./kafka";

let userInteractionConsumerInitialized = false;

export const setupUserInteractionConsumer = async () => {
  if (userInteractionConsumerInitialized) return;
  try {
    await createTopic("user-interactions");

    const userInteractionConsumer = kafka.consumer({
      groupId: "user-interaction-consumer",
    });

    await userInteractionConsumer.connect();
    await userInteractionConsumer.subscribe({
      topic: "user-interactions",
      fromBeginning: true,
    });

    await userInteractionConsumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        if (!message.value) return;
        if (topic !== "user-interactions") return;
        const userInteraction = JSON.parse(message.value.toString());
        console.log(
          `Received user interaction event: ${JSON.stringify(userInteraction)}`
        );
      },
    });

    console.log("User interaction consumer is running");
    userInteractionConsumerInitialized = true;
  } catch (error) {
    console.error("Error in User Interaction Consumer:", error);
  }
};

let recommendationConsumerInitialized = false;

export const setupRecommendationConsumer = async () => {
  if (recommendationConsumerInitialized) return;
  try {
    await createTopic("recommendation-update");

    const recommendationConsumer = kafka.consumer({
      groupId: "recommendation-consumer",
    });

    await recommendationConsumer.connect();
    await recommendationConsumer.subscribe({
      topic: "recommendation-update",
      fromBeginning: true,
    });

    await recommendationConsumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        if (!message.value) return;
        if (topic !== "recommendation-update") return;
        const recommendationData = JSON.parse(message.value.toString());
        console.log(
          `Processing recommendation update: ${JSON.stringify(recommendationData)}`
        );
      },
    });

    console.log("Recommendation consumer is running");
    recommendationConsumerInitialized = true;
  } catch (error) {
    console.error("Error in Recommendation Consumer:", error);
  }
};
