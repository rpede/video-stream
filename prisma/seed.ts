import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const videos = [
    {
      name: 'Me at the Zoo',
      length: 20,
    },
    {
      name: 'Rick Astley - Never Gonna Give You Up',
      length: 3 * 60 + 33,
    },
  ];

  videos.forEach(async (video) =>
    await prisma.video.create({ data: video, })
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
