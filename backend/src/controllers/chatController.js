import { sendMessageByUserId, fetchMessagesByConversationId, fetchUserConversationsByMongoId } from '../services/chatService.js';
import User from '../models/User.js';

const sendChatMessage = async (req, res) => {
  try {
    const { receiverUserId, text } = req.body;
    // Assuming req.user.id is the MongoDB _id from auth middleware
    // We need to find the numeric userId for the sender
    const sender = await User.findById(req.user.id);
    if (!sender) return res.status(404).json({ message: 'Sender not found.' });

    const senderUserId = sender.userId;
    const mediaUrl = req.file ? `/uploads/media/${req.file.filename}` : undefined;

    if (!receiverUserId || (!text && !mediaUrl)) {
      return res.status(400).json({ message: 'Receiver numeric userId and either text or media are required.' });
    }

    const message = await sendMessageByUserId(senderUserId, receiverUserId, text, mediaUrl);
    res.status(201).json(message);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getConversationMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = await fetchMessagesByConversationId(conversationId);
    res.status(200).json(messages);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getUserConversationsList = async (req, res) => {
  try {
    const mongoUserId = req.user.id; 
    const conversations = await fetchUserConversationsByMongoId(mongoUserId);
    res.status(200).json(conversations);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export { sendChatMessage, getConversationMessages, getUserConversationsList };