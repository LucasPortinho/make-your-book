import { sqliteTable } from "drizzle-orm/sqlite-core";
import { text } from 'drizzle-orm/sqlite-core'
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";

export const usersTable = sqliteTable('users', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    lastName: text('last_name').notNull(),
    birthdate: text('birthdate').notNull(),
    email: text('email').notNull().unique(),
    passwordHash: text('password_hash').notNull(),
    createdAt: text('created_at').notNull(),
})

export const booksTable = sqliteTable('books', {
    id: text('id').primaryKey(),
    ownerId: text('owner_id').references(() => usersTable.id, { onDelete: 'cascade' }).notNull(),
    slug: text('slug').notNull(),
    projectTitle: text('project_title').notNull(),
    originalUrl: text('original_url').notNull(),
    modifiedUrl: text('modified_url').notNull(),
    modifiedAt: text('modified_at').notNull(),
    type: text('type').notNull(),
    agentId: text('agent_id').references(() => agentsTable.id, { onDelete: 'cascade' }).notNull(),
})

export const agentsTable = sqliteTable('agents', {
    id: text('id').primaryKey(),
    model: text('model').notNull(),
    style: text('style').notNull(),
    instructions: text('instructions'),
})

// Many books to one user and many books to one agent
export const booksRelations = relations(booksTable, ({ one }) => ({
    owner: one(usersTable, {
        fields: [booksTable.ownerId],
        references: [usersTable.id]
    }),
    agent: one(agentsTable, {
        fields: [booksTable.agentId],
        references: [agentsTable.id]
    })
}))

export const usersRelations = relations(usersTable, ({ many }) => ({
    books: many(booksTable)
}))

export const agentsRelations = relations(agentsTable, ({ many }) => ({
    books: many(booksTable)
}))

export type BooksTableSelectModel = InferSelectModel<typeof booksTable>
export type BooksTableInsertModel = InferInsertModel<typeof booksTable>

export type UsersTableSelectModel = InferSelectModel<typeof usersTable>
export type UsersTableInsertModel = InferInsertModel<typeof usersTable>

export type AgentsTableSelectModel = InferSelectModel<typeof agentsTable>
export type AgentsTableInsertModel = InferInsertModel<typeof agentsTable>
