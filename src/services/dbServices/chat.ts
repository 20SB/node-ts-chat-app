import { eq, and, or, sql } from "drizzle-orm";
import postgresdb from "../../config/db";
import { chats, chatUsers, messages, users } from "../../models/schema";

export default class Chat {
  static getprivateChatData = async (presentUserId: string, partnerUserId: string) => {
    try {
      const chatData = await postgresdb.select({
        chatId: chats.chatId,
        isGroupChat: chats.isGroupChat,
        chatName: chats.chatName,
        chatImage: chats.chatImage,
        coverImage: chats.coverImage,
        description: chats.description,
        pinnedMessage: chats.pinnedMessage,
        latestMessage: chats.latestMessage,
        createdAt: chats.createdAt,
        updatedAt: chats.updatedAt,
        isDeleted: chats.isDeleted,
        users: sql`json_agg(json_build_object(
          'userId', ${users.userId},
          'name', ${users.name},
          'email', ${users.email},
          'isAdmin', ${chatUsers.isAdmin}
        ))`,

      })
      .from(chatUsers)
      .innerJoin(chats, eq(chats.chatId, chatUsers.chatId))
      .innerJoin(users, eq(users.userId, chatUsers.userId))
      .where(
        and(
          eq(chats.isGroupChat, false),
          or(
            eq(chatUsers.userId, presentUserId),
            eq(chatUsers.userId, partnerUserId)
          )
        )
      )
      .groupBy(chatUsers.chatId, chats.chatId)
      .having(sql`count(${chatUsers.userId}) = 2`)

      console.log("chatData",chatData);
      return chatData
      
      const existingChat = await postgresdb
        .select({
          chatId: chats.chatId,
          isGroupChat: chats.isGroupChat,
          chatName: chats.chatName,
          chatImage: chats.chatImage,
          coverImage: chats.coverImage,
          description: chats.description,
          pinnedMessage: chats.pinnedMessage,
          latestMessage: chats.latestMessage,
          createdAt: chats.createdAt,
          updatedAt: chats.updatedAt,
          isDeleted: chats.isDeleted,
          users: sql`json_agg(json_build_object(
            'userId', ${users.userId},
            'name', ${users.name},
            'email', ${users.email}
          ))`,
        })
        .from(chats)
        .innerJoin(chatUsers, eq(chatUsers.chatId, chats.chatId))
        .innerJoin(users, eq(users.userId, chatUsers.userId))
        .where(
          and(
            eq(chats.isGroupChat, false), // Filter non-group chats
            or(
              eq(chatUsers.userId, presentUserId), // Check if one user is presentUserId
              eq(chatUsers.userId, partnerUserId) // Check if the other user is partnerUserId
            )
          )
        )
        .groupBy(chats.chatId) // Group by chatId
        .having(sql`count(${chatUsers.userId}) = 2`); // Ensure there are exactly 2 users in the chat
      
      if (existingChat.length > 0) {
        console.log("chatData", existingChat[0]);
        // fetch messages of this chat and attach with chat and return
        const allMessages = await postgresdb.select().from(messages).where(eq(messages.chatId, existingChat[0].chatId)) 
        return {
            ...existingChat[0],
            messages: allMessages
        }
      }

    //   create new chat
      const newChat = await postgresdb.insert(chats).values({}).returning({ chatId: chats.chatId });
      console.log("newChat", newChat);

      console.log("userId", presentUserId, "partnerId", partnerUserId);
      //   create new chat users
      await postgresdb.insert(chatUsers).values([
        {
          chatId: newChat[0].chatId,
          userId: presentUserId,
        },
        {
          chatId: newChat[0].chatId,
          userId: partnerUserId,
        },
      ]);

      // fetch new chat with users data
    } catch (error: any) {
      console.log(error);
      throw new Error(`Error getting chat data: ${error.message}`);
    }
  };
}
