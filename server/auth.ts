import passport from "passport";
import { Strategy as DiscordStrategy } from "passport-discord";
import { getUsersCollection } from "./mongodb";
import type { User } from "@shared/schema";

const OWNER_ID = "866820869909381160";

export function setupAuth() {
  if (!process.env.DISCORD_CLIENT_ID || !process.env.DISCORD_CLIENT_SECRET) {
    console.warn("⚠️  Discord OAuth not configured - authentication disabled");
    return;
  }

  const callbackURL = "https://kissune.cc/api/auth/discord/callback";

  passport.use(
    new DiscordStrategy(
      {
        clientID: process.env.DISCORD_CLIENT_ID,
        clientSecret: process.env.DISCORD_CLIENT_SECRET,
        callbackURL,
        scope: ["identify", "email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const usersCollection = await getUsersCollection();
          const isOwner = profile.id === OWNER_ID;

          let user = await usersCollection.findOne({ discordId: profile.id });

          if (!user) {
            const newUser: Omit<User, "_id"> = {
              discordId: profile.id,
              username: profile.username,
              avatar: profile.avatar || undefined,
              email: profile.email || undefined,
              isOwner,
              createdAt: new Date(),
            };

            const result = await usersCollection.insertOne(newUser as any);
            user = await usersCollection.findOne({ _id: result.insertedId }) || null;
          } else if (user.isOwner !== isOwner) {
            await usersCollection.updateOne(
              { discordId: profile.id },
              { $set: { isOwner } }
            );
            user.isOwner = isOwner;
          }

          return done(null, user || false);
        } catch (error) {
          return done(error as Error);
        }
      }
    )
  );

  passport.serializeUser((user: any, done) => {
    done(null, user._id.toString());
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const usersCollection = await getUsersCollection();
      const { ObjectId } = await import("mongodb");
      const user = await usersCollection.findOne({ _id: new ObjectId(id) as any });
      done(null, user || false);
    } catch (error) {
      done(error);
    }
  });
}

export function requireAuth(req: any, res: any, next: any) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: "Authentication required" });
}

export function requireOwner(req: any, res: any, next: any) {
  if (req.isAuthenticated() && req.user?.isOwner) {
    return next();
  }
  res.status(403).json({ error: "Owner permissions required" });
}
