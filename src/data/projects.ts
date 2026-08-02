import type { Project } from "@/types";

export const projects: Project[] = [
  {
    id: "cloudvaultx",
    title: "CloudVaultX",
    tagline: "AI-Powered Decentralized Cloud Storage Platform",
    description:
      "Developing an AI-powered decentralized cloud storage architecture that securely distributes encrypted file chunks across multiple storage nodes. The system focuses on fault tolerance, intelligent storage allocation, and secure metadata management.",
    features: [
      "Encrypted file chunking and distributed storage",
      "AI-based node selection for optimized storage allocation",
      "Fault-tolerant architecture with data replication",
      "Secure metadata management and retrieval",
      "Scalable distributed cloud storage design",
    ],
    challenges:
      "Designing a distributed architecture that balances security, scalability, redundancy, and retrieval performance while maintaining efficient metadata management.",
    tech: [
      "Python",
      "FastAPI",
      "LangGraph",
      "AWS",
      "SQLite",
      "AES Encryption",
    ],
    githubUrl: "YOUR_GITHUB_LINK",
    accent: "cyan",
    status: "in-progress",
  },

  {
    id: "ai-swe-copilot",
    title: "AI Software Engineering Copilot",
    tagline: "AI Assistant for Large Codebases",
    description:
      "Building an AI-powered software engineering assistant capable of understanding large repositories using Retrieval-Augmented Generation (RAG), semantic search, and agentic workflows.",
    features: [
      "Repository-wide semantic code search",
      "Retrieval-Augmented Generation (RAG)",
      "Context-aware code understanding",
      "Agentic workflows using LangChain and LangGraph",
      "Repository question answering and code summarization",
    ],
    challenges:
      "Maintaining accurate repository context while minimizing hallucinations and enabling fast retrieval across large codebases.",
    tech: [
      "Python",
      "LangChain",
      "LangGraph",
      "Ollama",
      "FAISS",
      "RAG",
    ],
    githubUrl: "YOUR_GITHUB_LINK",
    accent: "amber",
    status: "in-progress",
  },

  {
    id: "voice-assistant",
    title: "Real-time Conversational AI Assistant",
    tagline: "Fully Local Audio-In, Audio-Out AI Assistant",
    description:
      "Developed a real-time conversational AI assistant supporting speech-to-text and text-to-speech interactions using a completely local inference pipeline without relying on cloud APIs.",
    features: [
      "Real-time speech recognition using Faster-Whisper",
      "Context-aware responses using Ollama LLM",
      "Low-latency streaming audio pipeline",
      "Natural speech synthesis",
      "Completely local inference with improved privacy",
    ],
    challenges:
      "Integrating speech recognition, language models, and speech synthesis into a seamless low-latency conversational pipeline.",
    tech: [
      "Python",
      "Ollama",
      "Faster-Whisper",
      "sounddevice",
      "Speech-to-Text",
      "LLMs",
    ],
    githubUrl: "https://github.com/sohanmogalapalli/voice-assistant",
    accent: "green",
    status: "shipped",
  },

  {
    id: "smart-home-security",
    title: "Smart Home Security System",
    tagline: "Arduino-based Intrusion Detection Prototype",
    description:
      "Designed and implemented a smart home security system using an Arduino Uno and HC-SR04 ultrasonic sensor for real-time intrusion detection with automatic alarm activation.",
    features: [
      "Real-time intrusion detection",
      "Ultrasonic distance sensing",
      "Automatic buzzer and LED alerts",
      "Arduino Uno-based embedded system",
    ],
    challenges:
      "Achieving reliable object detection while minimizing false alarms using distance-based sensing.",
    tech: [
      "Arduino Uno",
      "C++",
      "HC-SR04",
      "Arduino IDE",
    ],
    githubUrl: "YOUR_GITHUB_LINK",
    accent: "green",
    status: "shipped",
  },
];