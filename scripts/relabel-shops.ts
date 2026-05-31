import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Названия/описания под фото вязаных изделий на главной (slug не меняем — фото мапятся по нему)
const updates = [
  {
    slug: "stol-art",
    name: "Лаванда ручной работы",
    description: "Вязаные сумки и аксессуары ручной работы",
  },
  {
    slug: "teplye-lapki",
    name: "Морские петельки",
    description: "Вязаные игрушки и декор для детей",
  },
  {
    slug: "serebro-kubani",
    name: "Тёплый уют",
    description: "Вязаный декор, свечи и уютные мелочи для дома",
  },
];

async function main() {
  for (const u of updates) {
    const res = await prisma.shop.updateMany({
      where: { slug: u.slug },
      data: { name: u.name, description: u.description },
    });
    console.log(`${u.slug} → "${u.name}" (обновлено: ${res.count})`);
  }
  await prisma.$disconnect();
  console.log("done");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
