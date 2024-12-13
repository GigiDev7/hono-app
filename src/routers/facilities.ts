import { Hono } from "hono";
import { drizzle } from "drizzle-orm/neon-http";
import { facilities, facilityType } from "../db/schema";
import { eq } from "drizzle-orm";

type Env = {
  DATABASE_URL: string;
  my_r2_bucket: string;
  BASE_URL: string;
};

export const facility = new Hono();

facility
  .get("/", async (c) => {
    try {
      const db = drizzle((c.env as Env).DATABASE_URL);
      const result = await db.select().from(facilities);
      return c.json({
        data: result,
      });
    } catch (err) {
      console.log(err);
      c.status(500);
      return c.json({
        message: "Something went wrong",
      });
    }
  })
  .post(async (c) => {
    const db = drizzle((c.env as Env).DATABASE_URL);
    const r2: any = (c.env as Env).my_r2_bucket;

    try {
      const formData = await c.req.formData();
      const file = formData.get("file");

      let key = null;

      if (file && file instanceof File) {
        key = `${Date.now()}-${file.name}`;
        try {
          const object = await r2.put(key, file.stream(), {
            httpMetadata: {
              contentType: file.type,
            },
          });
        } catch (e) {
          c.status(500);
          return c.json({
            message: "Something went wrong",
          });
        }
      }

      const address = formData.get("address") as string;
      const city = formData.get("city") as string;
      const name = formData.get("name") as string;
      const phoneNumber = formData.get("phoneNumber") as string;
      const state = formData.get("state") as string;
      const zipCode = formData.get("zipCode") as string;
      const siteLeader = formData.get("siteLeader") as string;
      const type = formData.get(
        "type"
      ) as (typeof facilityType.enumValues)[number];

      const imageUrl = key ? `${(c.env as Env).BASE_URL}/${key}` : null;

      await db.insert(facilities).values({
        address,
        city,
        name,
        phoneNumber,
        state,
        zipCode,
        siteLeader,
        imageUrl,
        type,
      });

      c.status(201);
      return c.json({
        message: "Facility added successfully",
      });
    } catch (err) {
      console.log(err);
      c.status(500);
      return c.json({
        message: "Something went wrong",
      });
    }
  });
facility
  .get("/:id", async (c) => {
    const db = drizzle((c.env as Env).DATABASE_URL);
    const id = c.req.param("id");
    try {
      const result = await db
        .select()
        .from(facilities)
        .where(eq(facilities.id, +id));
      if (!result.length) {
        c.status(404);
        return c.json({
          message: "Facility not found",
        });
      } else {
        return c.json({
          data: result[0],
        });
      }
    } catch (err) {
      c.status(500);
      return c.json({
        message: "Something went wrong",
      });
    }
  })
  .put(async (c) => {
    const db = drizzle((c.env as Env).DATABASE_URL);
    const r2: any = (c.env as Env).my_r2_bucket;
    const id = c.req.param("id");
    try {
      const formData = await c.req.formData();
      const file = formData.get("file");

      let key = null;

      if (file && file instanceof File) {
        key = `${Date.now()}-${file.name}`;
        try {
          const object = await r2.put(key, file.stream(), {
            httpMetadata: {
              contentType: file.type,
            },
          });
        } catch (e) {
          c.status(500);
          return c.json({
            message: "Something went wrong",
          });
        }
      }

      const address = formData.get("address") as string;
      const city = formData.get("city") as string;
      const name = formData.get("name") as string;
      const phoneNumber = formData.get("phoneNumber") as string;
      const state = formData.get("state") as string;
      const zipCode = formData.get("zipCode") as string;
      const siteLeader = formData.get("siteLeader") as string;
      const type = formData.get(
        "type"
      ) as (typeof facilityType.enumValues)[number];

      const imageUrl = key
        ? `${(c.env as Env).BASE_URL}/${key}`
        : (formData.get("imageUrl") as string);

      await db
        .update(facilities)
        .set({
          address,
          city,
          name,
          phoneNumber,
          state,
          zipCode,
          siteLeader,
          imageUrl,
          type,
        })
        .where(eq(facilities.id, +id));
      return c.json({
        message: "Facility updated",
      });
    } catch (err) {
      c.status(500);
      return c.json({
        message: "Something went wrong",
      });
    }
  })
  .delete(async (c) => {
    const db = drizzle((c.env as Env).DATABASE_URL);
    try {
      const id = c.req.param("id");
      await db.delete(facilities).where(eq(facilities.id, +id));
      return c.json({});
    } catch (err) {
      c.status(500);
      return c.json({
        message: err,
      });
    }
  });
