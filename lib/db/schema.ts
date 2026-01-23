import { pgTable, text, integer, timestamp, boolean, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name'),
  password: text('password'),
  emailVerified: timestamp('email_verified'),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Individual colors table - each color code is globally unique
export const colors = pgTable('colors', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: text('code').notNull().unique(), // Globally unique color code
  hexColor: text('hex_color').notNull(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }), // For user-created custom colors
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// User color customizations table - allows users to override pre-defined color properties
export const userColorCustomizations = pgTable('user_color_customizations', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  colorId: uuid('color_id').references(() => colors.id, { onDelete: 'cascade' }).notNull(),
  customCode: text('custom_code'),
  customHexColor: text('custom_hex_color'),
  pieceId: text('piece_id'), // Specific piece ID from user's physical beads
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// User inventory table
export const userInventory = pgTable('user_inventory', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  colorId: uuid('color_id').references(() => colors.id, { onDelete: 'cascade' }).notNull(),
  quantity: integer('quantity').default(0).notNull(),
  customColor: boolean('custom_color').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Inventory history table (optional for v1, tracking changes)
export const inventoryHistory = pgTable('inventory_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  colorId: uuid('color_id').references(() => colors.id, { onDelete: 'cascade' }).notNull(),
  changeAmount: integer('change_amount').notNull(),
  previousQuantity: integer('previous_quantity').notNull(),
  newQuantity: integer('new_quantity').notNull(),
  reason: text('reason'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// User hidden colors table - tracks which families or individual colors users want to hide
export const userHiddenColors = pgTable('user_hidden_colors', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  family: text('family'), // e.g., 'A', 'B', 'ZG' - when set without colorCode, hides entire family
  colorCode: text('color_code'), // e.g., 'A5', 'B12' - when set, hides specific color
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Blueprints table - stores bead blueprints (user private + official public)
export const blueprints = pgTable('blueprints', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
  imageUrl: text('image_url'), // Preview image
  difficulty: text('difficulty'), // 'easy' | 'medium' | 'hard'
  pieceRequirements: text('piece_requirements'), // JSON: {"A5": 50, "B12": 30}
  tags: text('tags'), // Comma-separated for search
  isOfficial: boolean('is_official').default(false).notNull(), // Official blueprints published by website
  createdBy: uuid('created_by').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Build history table - records completed works with photos
export const buildHistory = pgTable('build_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  blueprintId: uuid('blueprint_id').references(() => blueprints.id, { onDelete: 'set null' }), // Optional link to blueprint
  title: text('title').notNull(),
  description: text('description'),
  imageUrls: text('image_urls'), // JSON array: ["url1", "url2", ...]
  piecesUsed: text('pieces_used'), // JSON: {"A5": 50, "B12": 30}
  isPublic: boolean('is_public').default(false).notNull(), // Public sharing toggle
  completedAt: timestamp('completed_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  inventory: many(userInventory),
  history: many(inventoryHistory),
  customColors: many(colors),
  colorCustomizations: many(userColorCustomizations),
  hiddenColors: many(userHiddenColors),
  blueprints: many(blueprints),
  builds: many(buildHistory),
}));

export const colorsRelations = relations(colors, ({ one, many }) => ({
  creator: one(users, {
    fields: [colors.userId],
    references: [users.id],
  }),
  userInventory: many(userInventory),
  history: many(inventoryHistory),
  customizations: many(userColorCustomizations),
}));

export const userColorCustomizationsRelations = relations(userColorCustomizations, ({ one }) => ({
  user: one(users, {
    fields: [userColorCustomizations.userId],
    references: [users.id],
  }),
  color: one(colors, {
    fields: [userColorCustomizations.colorId],
    references: [colors.id],
  }),
}));

export const userInventoryRelations = relations(userInventory, ({ one }) => ({
  user: one(users, {
    fields: [userInventory.userId],
    references: [users.id],
  }),
  color: one(colors, {
    fields: [userInventory.colorId],
    references: [colors.id],
  }),
}));

export const inventoryHistoryRelations = relations(inventoryHistory, ({ one }) => ({
  user: one(users, {
    fields: [inventoryHistory.userId],
    references: [users.id],
  }),
  color: one(colors, {
    fields: [inventoryHistory.colorId],
    references: [colors.id],
  }),
}));

export const userHiddenColorsRelations = relations(userHiddenColors, ({ one }) => ({
  user: one(users, {
    fields: [userHiddenColors.userId],
    references: [users.id],
  }),
}));

export const blueprintsRelations = relations(blueprints, ({ one, many }) => ({
  creator: one(users, {
    fields: [blueprints.createdBy],
    references: [users.id],
  }),
  builds: many(buildHistory),
}));

export const buildHistoryRelations = relations(buildHistory, ({ one }) => ({
  user: one(users, {
    fields: [buildHistory.userId],
    references: [users.id],
  }),
  blueprint: one(blueprints, {
    fields: [buildHistory.blueprintId],
    references: [blueprints.id],
  }),
}));

// Types for TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Color = typeof colors.$inferSelect;
export type NewColor = typeof colors.$inferInsert;

export type UserInventory = typeof userInventory.$inferSelect;
export type NewUserInventory = typeof userInventory.$inferInsert;

export type InventoryHistory = typeof inventoryHistory.$inferSelect;
export type NewInventoryHistory = typeof inventoryHistory.$inferInsert;

export type UserColorCustomization = typeof userColorCustomizations.$inferSelect;
export type NewUserColorCustomization = typeof userColorCustomizations.$inferInsert;

export type UserHiddenColor = typeof userHiddenColors.$inferSelect;
export type NewUserHiddenColor = typeof userHiddenColors.$inferInsert;

export type Blueprint = typeof blueprints.$inferSelect;
export type NewBlueprint = typeof blueprints.$inferInsert;

export type BuildHistory = typeof buildHistory.$inferSelect;
export type NewBuildHistory = typeof buildHistory.$inferInsert;
