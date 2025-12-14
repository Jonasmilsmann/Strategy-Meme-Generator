// Docs: https://www.instantdb.com/docs/modeling-data

import { i } from "@instantdb/core";

const _schema = i.schema({
  entities: {
    users: i.entity({
      email: i.string().unique().indexed().optional(),
      approved: i.boolean(),
      inviteCode: i.string(),
      createdAt: i.number().indexed(),
    }),
    inviteCodes: i.entity({
      code: i.string().unique().indexed(),
      used: i.boolean().indexed(),
      usedBy: i.string().optional(),
      createdBy: i.string(),
      createdAt: i.number().indexed(),
    }),
    memes: i.entity({
      title: i.string(),
      imageUrl: i.string(),
      thumbnailUrl: i.string(),
      userId: i.string().indexed(),
      userEmail: i.string(),
      createdAt: i.number().indexed(),
    }),
    votes: i.entity({
      memeId: i.string().indexed(),
      userId: i.string().indexed(),
      value: i.number(),
    }),
  },
});

// This helps Typescript display nicer intellisense
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export default schema;
