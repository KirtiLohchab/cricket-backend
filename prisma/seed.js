import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database with initial data...");

  // Indian States
  const statesData = [
    { name: "Andaman and Nicobar Islands", code: "AN" },
    { name: "Andhra Pradesh", code: "AP" },
    { name: "Arunachal Pradesh", code: "AR" },
    { name: "Assam", code: "AS" },
    { name: "Bihar", code: "BR" },
    { name: "Chandigarh", code: "CH" },
    { name: "Chhattisgarh", code: "CT" },
    { name: "Dadra and Nagar Haveli", code: "DN" },
    { name: "Daman and Diu", code: "DD" },
    { name: "Delhi", code: "DL" },
    { name: "Goa", code: "GA" },
    { name: "Gujarat", code: "GJ" },
    { name: "Haryana", code: "HR" },
    { name: "Himachal Pradesh", code: "HP" },
    { name: "Jammu and Kashmir", code: "JK" },
    { name: "Jharkhand", code: "JH" },
    { name: "Karnataka", code: "KA" },
    { name: "Kerala", code: "KL" },
    { name: "Ladakh", code: "LA" },
    { name: "Lakshadweep", code: "LD" },
    { name: "Madhya Pradesh", code: "MP" },
    { name: "Maharashtra", code: "MH" },
    { name: "Manipur", code: "MN" },
    { name: "Meghalaya", code: "ML" },
    { name: "Mizoram", code: "MZ" },
    { name: "Nagaland", code: "NL" },
    { name: "Odisha", code: "OD" },
    { name: "Puducherry", code: "PY" },
    { name: "Punjab", code: "PB" },
    { name: "Rajasthan", code: "RJ" },
    { name: "Sikkim", code: "SK" },
    { name: "Tamil Nadu", code: "TN" },
    { name: "Telangana", code: "TG" },
    { name: "Tripura", code: "TR" },
    { name: "Uttar Pradesh", code: "UP" },
    { name: "Uttarakhand", code: "UT" },
    { name: "West Bengal", code: "WB" },
  ];

  // Create states
  const states = [];
  for (const stateData of statesData) {
    const state = await prisma.state.upsert({
      where: { code: stateData.code },
      update: {},
      create: stateData,
    });
    states.push(state);
  }

  console.log(`✅ Created ${states.length} states`);

  // Sample districts for a few states
  const districtsData = {
    Maharashtra: ["Mumbai", "Pune", "Nagpur", "Thane", "Aurangabad", "Nashik"],
    Delhi: ["North", "South", "East", "West", "Central", "Northeast"],
    Karnataka: ["Bangalore", "Mysore", "Mangalore", "Belgaum", "Hubli"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Salem", "Trichy"],
    "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi", "Agra", "Noida"],
  };

  for (const [stateName, districtNames] of Object.entries(districtsData)) {
    const state = await prisma.state.findUnique({ where: { name: stateName } });

    if (state) {
      for (const districtName of districtNames) {
        await prisma.district.upsert({
          where: {
            stateId_name: {
              stateId: state.id,
              name: districtName,
            },
          },
          update: {},
          create: {
            name: districtName,
            stateId: state.id,
          },
        });
      }
      console.log(
        `✅ Created ${districtNames.length} districts for ${stateName}`,
      );
    }
  }

  console.log("🎉 Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
