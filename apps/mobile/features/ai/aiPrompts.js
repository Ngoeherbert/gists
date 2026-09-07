export const AI_PROMPTS = {
  GENERAL: "Answer the user clearly, accurately, and helpfully.",

  SUMMARIZE:
    "Summarize the provided content clearly and concisely while preserving the important information.",

  REWRITE:
    "Rewrite the provided text while preserving its original meaning. Improve clarity, grammar, and readability.",

  TRANSLATE:
    "Translate the provided text naturally and accurately while preserving its intended meaning and tone.",

  EXPLAIN:
    "Explain the topic in simple, easy-to-understand language. Use examples when helpful.",

  BRAINSTORM:
    "Generate useful, practical, and creative ideas based on the user’s request.",

  CAPTION:
    "Create an engaging social media caption that matches the user’s requested tone and context.",

  REPLY:
    "Help the user write a natural and appropriate reply to the provided message.",
};

export function createPrompt(type = "general", content = "") {
  const basePrompt = AI_PROMPTS[type.toUpperCase()] || AI_PROMPTS.GENERAL;

  return `${basePrompt}\n\nUser request:\n${content.trim()}`;
}

export function createSystemPrompt(options = {}) {
  const { name = "Gist AI", concise = false, friendly = true } = options;

  const style = [
    friendly
      ? "Be friendly and respectful."
      : "Maintain a neutral professional tone.",
    concise
      ? "Keep responses concise and focused."
      : "Provide enough detail to be useful without unnecessary repetition.",
  ].join(" ");

  return [
    `You are ${name}, the AI assistant inside Gists.`,
    style,
    "Do not claim to have performed actions you cannot perform.",
    "If you are uncertain, say so rather than inventing information.",
  ].join(" ");
}

export function createSummarizePrompt(content) {
  return createPrompt("summarize", content);
}

export function createRewritePrompt(content) {
  return createPrompt("rewrite", content);
}

export function createTranslatePrompt(content, language) {
  return createPrompt(
    "translate",
    `Translate the following text into ${language}:\n\n${content}`,
  );
}

export function createExplainPrompt(content) {
  return createPrompt("explain", content);
}

export function createBrainstormPrompt(content) {
  return createPrompt("brainstorm", content);
}

export function createCaptionPrompt(content) {
  return createPrompt("caption", content);
}

export function createReplyPrompt(content) {
  return createPrompt("reply", content);
}

export default {
  AI_PROMPTS,
  createPrompt,
  createSystemPrompt,
  createSummarizePrompt,
  createRewritePrompt,
  createTranslatePrompt,
  createExplainPrompt,
  createBrainstormPrompt,
  createCaptionPrompt,
  createReplyPrompt,
};
