import api from '../lib/api';

interface chatbotMessage {
    texto: string;
}

const chatbotService = {
    sendMessage: async (message: chatbotMessage) => {
        // Use the local Next.js API route directly with fetch so the request is
        // sent to the same origin (avoids axios baseURL pointing to external host)
        const res = await fetch('/api/chatbot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        });

        // propagate non-OK responses as errors
        if (!res.ok) {
            const text = await res.text();
            throw new Error(`chatbot proxy error: ${res.status} ${text}`);
        }

        return res.json();
    }
};

export default chatbotService;