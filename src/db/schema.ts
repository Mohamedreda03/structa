import { relations } from "drizzle-orm"
import { boolean, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"

export const users = pgTable("user", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
})

export const sessions = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
})

export const accounts = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
})

export const verifications = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
})

export const lessons = pgTable("lessons", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  topic: text("topic").notNull(),
  difficulty: text("difficulty").notNull(),
  language: text("language").notNull().default("English"),
  status: text("status").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
})

export const lessonSections = pgTable("lesson_sections", {
  id: uuid("id").defaultRandom().primaryKey(),
  lessonId: uuid("lesson_id")
    .notNull()
    .references(() => lessons.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  content: text("content").notNull(),
  order: integer("order").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
})

export const aiEdits = pgTable("ai_edits", {
  id: uuid("id").defaultRandom().primaryKey(),
  sectionId: uuid("section_id")
    .notNull()
    .references(() => lessonSections.id, { onDelete: "cascade" }),
  selectedText: text("selected_text").notNull(),
  generatedText: text("generated_text").notNull(),
  action: text("action").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
})

export const usersRelations = relations(users, ({ many }) => ({
  lessons: many(lessons),
}))

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  user: one(users, {
    fields: [lessons.userId],
    references: [users.id],
  }),
  sections: many(lessonSections),
}))

export const lessonSectionsRelations = relations(lessonSections, ({ one, many }) => ({
  lesson: one(lessons, {
    fields: [lessonSections.lessonId],
    references: [lessons.id],
  }),
  edits: many(aiEdits),
}))

export const aiEditsRelations = relations(aiEdits, ({ one }) => ({
  section: one(lessonSections, {
    fields: [aiEdits.sectionId],
    references: [lessonSections.id],
  }),
}))
