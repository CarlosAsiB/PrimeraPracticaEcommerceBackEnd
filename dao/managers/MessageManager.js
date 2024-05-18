import Message from '../models/messageModel.js'; 

class MessageManager {
  async getMessages() {
    return await Message.find({});
  }

  async addMessage(messageData) {
    const message = new Message(messageData);
    await message.save();
    return message;
  }
}

export default MessageManager;
