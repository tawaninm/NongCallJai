import path from "node:path";
import { defineConfig } from "prisma/config";

export default defineConfig({
  earlyAccess: true,
  schema: path.join("prisma", "schema.prisma"),
  datasource: {
    url: "postgresql://postgres:1234@127.0.0.1:5432/healthcare_db",
  },
  migrate: {
    async adapter() {
      const { PrismaPg } = await import("@prisma/adapter-pg");
      const connectionString = "postgresql://postgres:1234@127.0.0.1:5432/healthcare_db";
      return new PrismaPg({ connectionString });
    },
  },
});
