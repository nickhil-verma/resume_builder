const prisma = require('../config/db');
const { generateChatResponse } = require('../utils/gemini');

exports.sendMessage = async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    const userId = req.userId;

    let session;
    if (sessionId) {
      session = await prisma.chatSession.findUnique({
        where: { id: sessionId },
        include: { messages: { orderBy: { createdAt: 'asc' } } }
      });
    }

    if (!session) {
      session = await prisma.chatSession.create({
        data: { userId, title: message.substring(0, 30) + '...' },
        include: { messages: true }
      });
    }

    // Save user message
    await prisma.chatMessage.create({
      data: { sessionId: session.id, role: 'user', content: message }
    });

    // Get AI response
    const history = [...(session.messages || []), { role: 'user', content: message }];
    const aiResponse = await generateChatResponse(history);

    // Save AI response
    const botMsg = await prisma.chatMessage.create({
      data: { sessionId: session.id, role: 'assistant', content: aiResponse }
    });

    res.json({ result: aiResponse, sessionId: session.id, message: botMsg });
  } catch (error) {
    res.status(500).json({ message: 'Chat failed', error: error.message });
  }
};

exports.getSessionHistory = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await prisma.chatSession.findUnique({
      where: { id: sessionId },
      include: { messages: { orderBy: { createdAt: 'asc' } } }
    });

    if (!session || session.userId !== req.userId) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.json(session.messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching history' });
  }
};

exports.getUserSessions = async (req, res) => {
  try {
    const sessions = await prisma.chatSession.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sessions' });
  }
};
