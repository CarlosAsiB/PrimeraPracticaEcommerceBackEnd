class MessageRepository {
    constructor(dao) {
      this.dao = dao;
    }
  
    getAllMessages() {
      return this.dao.getMessages();
    }
  
    addMessage(messageData) {
      return this.dao.addMessage(messageData);
    }
  }
  
  export default MessageRepository;
  