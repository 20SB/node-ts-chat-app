import { desc, relations, sql } from "drizzle-orm";
import { serial, real, varchar, timestamp, integer, pgTable, jsonb, primaryKey, boolean, index, unique, text, json, pgEnum, check, uuid } from "drizzle-orm/pg-core";
import { messageContentTypes, reactionTypes } from "../enums";

export const users = pgTable("users", {
  userId: uuid("user_id").notNull().default(sql`uuid_generate_v4()`).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  password: varchar("password", { length: 255 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
  isDeleted: boolean("is_deleted").notNull().default(false),
});

export const chats = pgTable("chats", {
  chatId: uuid("chat_id").notNull().default(sql`uuid_generate_v4()`).primaryKey(),
  isGroupChat: boolean("is_group_chat").notNull().default(false),
  chatName: varchar("chat_name", { length: 20 }),
  chatImage: varchar("chat_image", { length: 255 }),
  coverImage: varchar("cover_image", { length: 255 }),
  description: varchar("description", {length: 255}),
  pinnedMessage: uuid("pinned_message").references(()=>messages.messageId),
  latestMessage: uuid("latest_message").references(()=>messages.messageId),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
  isDeleted: boolean("is_deleted").notNull().default(false),
});

export const chatUsers = pgTable("chat_users", {
  chatId: uuid("chat_id").notNull().references(()=>chats.chatId),
  userId: uuid("user_id").notNull().references(()=>users.userId),
  isAdmin: boolean("is_admin").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
  isDeleted: boolean("is_deleted").notNull().default(false),
},(table)=>({
  pk: primaryKey({columns:[table.chatId, table.userId]}),
  uniqueCombination: unique("unique_chat_user").on(table.userId, table.chatId)
}))

export const messageContentType = pgEnum("message_content_types", Object.values(messageContentTypes) as [string, ...string[]] );
export const messages: any = pgTable("messages",{
  messageId: uuid("message_id").notNull().default(sql`uuid_generate_v4()`).primaryKey(),
  chatId: uuid("chat_id").notNull().references(()=>chats.chatId),
  senderId: uuid("sender_id").notNull().references(()=>users.userId),
  contentType: messageContentType("content_type").notNull().default(messageContentTypes.TEXT),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
  isDeleted: boolean("is_deleted").notNull().default(false),
},(table)=>({
  chatIndex: index("chat_index").on(table.chatId)
}))  

export const reactionType = pgEnum("reaction_types", Object.values(reactionTypes) as [string, ...string[]]);
export const reactions = pgTable("reactions",{
  id: serial("id").unique(),
  messageId: uuid("message_id").notNull().references(()=>messages.messageId),
  senderId: uuid("sender_id").notNull().references(()=>users.userId),
  reactionType: reactionType("reaction_type").notNull().default(reactionTypes.LIKE),
  reaction: varchar("reaction", {length: 20}),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
  isDeleted: boolean("is_deleted").notNull().default(false),
},(table)=>({
  messageIndex: index("message_index").on(table.messageId)
}))

// relations
export const userRelations = relations(users,({many})=>({
  chats: many(chatUsers),
  messages: many(messages),
  reactions: many(reactions)
}))

export const chatRelations = relations(chats, ({many, one})=>({
  members: many(chatUsers),
  messages: many(messages),
  pinnedMessage: one(messages, {fields: [chats.pinnedMessage], references: [messages.messageId]}),
  latestMessage: one(messages, {fields: [chats.latestMessage], references: [messages.messageId]})
}))

export const chatUserRelations = relations(chatUsers, ({one})=>({
  chat: one(chats, {fields: [chatUsers.chatId], references: [chats.chatId]}),
  user: one(users, {fields: [chatUsers.userId], references: [users.userId]})
}))

export const messageRelations = relations(messages, ({one, many})=>({
  chat: one(chats, {fields: [messages.chatId], references: [chats.chatId]}),
  sender: one(users, {fields: [messages.senderId], references: [users.userId]}),
  reactions: many(reactions),
})) 

export const reactionRelations = relations(reactions, ({one})=>({
  user: one(users, {fields: [reactions.senderId], references: [users.userId]}),
  message: one(messages, {fields: [reactions.messageId], references: [messages.messageId]})
}))