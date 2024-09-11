import { Kafka, logLevel, Partitioners, Producer, Admin } from "kafkajs";

export const kafka = new Kafka({
  clientId: "my-content-aggregator",
  brokers: [process.env.KAFKA_BROKER as string],
  logLevel: logLevel.ERROR,
});

let producer: Producer | null = null;
let admin: Admin | null = null;

export const createProducer = async (): Promise<Producer> => {
  if (producer) return producer;

  const newProducer = kafka.producer({
    createPartitioner: Partitioners.DefaultPartitioner,
  });

  await newProducer.connect();
  producer = newProducer;
  return producer;
};

export const createAdmin = async (): Promise<Admin> => {
  if (admin) return admin;

  const newAdmin = kafka.admin();
  await newAdmin.connect();
  admin = newAdmin;
  return admin;
};

export const createTopic = async (topic: string) => {
  try {
    const admin = await createAdmin();
    const metadata = await admin.fetchTopicMetadata({ topics: [topic] });
    if (metadata.topics.length > 0) {
      console.log(`Topic ${topic} already exists.`);
      return;
    }
    await admin.createTopics({
      topics: [{ topic }],
    });

    console.log(`Topic ${topic} created successfully.`);
  } catch (error) {
    console.error(`Error creating topic ${topic}:`, error);
  }
};

export const publishUserInteractionEvent = async (message: any) => {
  try {
    if (!producer) {
      producer = await createProducer();
    }

    await producer.send({
      topic: "user-interactions",
      messages: [{ value: JSON.stringify(message) }],
    });

    console.log("User interaction event published to Kafka");
  } catch (error) {
    console.error("Error publishing user interaction event:", error);
  }
};

export const publishRecommendationUpdate = async (message: any) => {
  try {
    if (!producer) {
      producer = await createProducer();
    }

    await producer.send({
      topic: "recommendation-update",
      messages: [{ value: JSON.stringify(message) }],
    });

    console.log("Recommendation update published to Kafka");
  } catch (error) {
    console.error("Error publishing recommendation update:", error);
  }
};
