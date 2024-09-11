import prisma from "./prisma";
import bcrypt from "bcryptjs";

async function main() {
  // Seed Users
  const hashedPassword = await bcrypt.hash("password123", 10);
  const user1 = await prisma.user.create({
    data: {
      email: "john.doe@example.com",
      password: hashedPassword,
      name: "John Doe",
      preferences: {
        create: {
          topics: ["Technology", "Science"],
          sources: ["YouTube", "NewsAPI"],
        },
      },
      dashboardConfig: {
        create: {
          layout: JSON.stringify({
            columns: 3,
            items: ["news", "videos", "podcasts"],
          }),
          theme: "LIGHT",
        },
      },
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: "jane.doe@example.com",
      password: hashedPassword,
      name: "Jane Doe",
      preferences: {
        create: {
          topics: ["Health", "Education"],
          sources: ["BBC", "Reddit"],
        },
      },
      dashboardConfig: {
        create: {
          layout: JSON.stringify({
            columns: 2,
            items: ["articles", "updates"],
          }),
          theme: "DARK",
        },
      },
    },
  });

  // Seed Content
  const content1 = await prisma.content.create({
    data: {
      title: "The Future of AI",
      description: "An insightful article about the advancements in AI.",
      url: "https://example.com/future-of-ai",
      source: "NewsAPI",
      type: "ARTICLE",
      topics: ["Technology", "AI"],
      publishedAt: new Date(),
    },
  });

  const content2 = await prisma.content.create({
    data: {
      title: "Understanding Quantum Computing",
      description: "A beginner's guide to quantum computing.",
      url: "https://example.com/quantum-computing",
      source: "YouTube",
      type: "VIDEO",
      topics: ["Science", "Technology"],
      publishedAt: new Date(),
    },
  });

  // Seed Recommendations
  await prisma.recommendation.create({
    data: {
      userId: user1.id,
      contentId: content1.id,
      score: 4.5,
    },
  });

  await prisma.recommendation.create({
    data: {
      userId: user2.id,
      contentId: content2.id,
      score: 4.0,
    },
  });

  // Seed Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: user1.id,
        message: "New content on AI just for you!",
      },
      {
        userId: user2.id,
        message: "New video on Quantum Computing!",
      },
    ],
  });

  console.log("Database seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
