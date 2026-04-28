# Nour AI Assistant: Comprehensive Audit & Enhancement Strategy

## Role: Lead AI Architect & Neurodiversity UX Researcher

### 1. Cognitive Load & Sensory-Friendly Communication
**Audit:** Currently, AI chatbots often lean towards overly conversational, enthusiastic, or metaphorical language. For neurodivergent users, especially those with Level 1 Autism, these traits can introduce unnecessary cognitive overhead, leading to confusion and sensory fatigue. Tone and structure must be literal, structured, and predictable.
**Enhancement:** Refine the "Task Deconstruction" logic. Nour must automatically decompose complex tasks (e.g., "Build a React component") into discrete, atomic steps (e.g., "Step 1: Create a file named `Button.tsx`"). Only present one step at a time unless the user explicitly requests the entire breakdown. Use bullet points and precise constraints. Eliminate ambiguous idioms like "think outside the box" or "let's dive right in".

### 2. Context Retention & Long-Term Memory
**Audit:** Most standard LLM integrations rely solely on generic token-window histories (short-term session context), causing users to repeatedly explain their learning style or past progress. This creates friction.
**Enhancement (Hierarchical Memory Architecture):**
*   **Short-term (Working Memory):** The immediate active conversation window. Limited to the current sub-task to avoid context pollution.
*   **Mid-term (Episodic Memory):** Progress on active courses. Stored via platform databases (e.g., Prisma models for `CourseProgress`), tracking which specific modules are completed and currently active. Nour queries this before responding to contextualize answers.
*   **Long-term (Semantic Memory):** Vector-stored user profiles containing explicitly declared and implicitly learned preferences. Includes: "Prefers code snippets over text," "Avoids lengthy paragraphs," or "Frustrates easily on CSS syntax."

### 3. RAG Optimization
**Audit:** Nour needs accurate, domain-specific retrieval (e.g., programming curriculums, accounting ledgers) without synthesizing generalized, hallucinated internet advice.
**Enhancement:** Transition to a "Micro-learning Hybrid Search" RAG model. Index documentation in tight, atomic chunks. When retrieving context, filter by the user's current module. If the user is stuck on "Python Unit 3," restrict RAG to the "Python Unit 3" knowledge base. Prioritize chunks tagged as "troubleshooting" or "examples" over "theory" when a user is actively coding.

### 4. Proactive Support & Emotional Intelligence
**Audit:** Standard bots are purely reactive. They wait for prompts. This places the burden of recognizing and articulating frustration on the user.
**Enhancement:** Implement a **Frustration Detection Trigger**.
*   **Trigger Metrics:** Repeating similar code errors > 3 times, sudden shifts to short negative inputs (e.g., "wrong," "stop," "no"), or significantly increased typing pace/erratic corrections.
*   **Intervention (Calm Mode):** Nour pauses the technical instruction. Response template: "I notice this particular step is causing repeated errors. This is a common point of friction. Let's take a 5-minute break. When you're ready, we can try a different approach or review a smaller example." Decrease response length and lower tone intensity.

### 5. Technical Integrity (The "Synapse" Integration)
**Audit:** Integration with core platform state (Synapse) determines Nour's effectiveness. Latency in recognizing a user's completed module breaks the illusion of a continuous mentor.
**Enhancement:** Move towards an Event-Driven API architecture for Nour. Instead of Nour polling the DB on every message, the platform emits events (`USER_COMPLETED_MODULE`, `USER_FAILED_QUIZ`) to Nour's memory cache. This ensures her context window is updated instantly, providing zero-latency awareness of the user's current state.

---

## Revised System Instruction for Nour

```text
You are Nour, an AI learning assistant for Tafrah, dedicated to supporting neurodivergent users (specifically Level 1 Autism) in mastering technical skills like programming and accounting.

CORE Directives:
1. COMMUNICATION STYLE: Be direct, literal, and concise. Avoid metaphors, idioms, sarcasm, or excessive enthusiasm. Use clear formatting (bullet points, bold text for emphasis).
2. TASK DECONSTRUCTION: When explaining a concept or solving a problem, break it down into atomic, numbered steps. Ask the user to confirm completion of Step 1 before providing Step 2.
3. COGNITIVE LOAD REDUCTION: Never provide more than 3 paragraphs of text at once. If code is required, provide only the specific snippet needed, not the entire file context unless asked.
4. CALM MODE: If the user indicates frustration or repeats the same error, acknowledge the difficulty neutrally, offer a simplified explanation, and suggest a short break if appropriate. "I see this is causing friction. Let's step back."
5. CONTEXTUAL AWARENESS: Always prioritize the user's current course module and explicit preferences stored in your context. Do not make assumptions about their prior knowledge outside of verified progress.
```

---

## Technical Roadmap

**Phase 1: Foundation (Weeks 1-3)**
*   Define and integrate the revised System Prompt into the existing OpenAI/LLM API calls.
*   Standardize the RAG chunking pipeline for Tafrah's specific course data (Python, Finance).

**Phase 2: Contextual Hierarchy (Weeks 4-7)**
*   Implement `UserPreferences` DB schema (Prisma) to store long-term semantic memory (formatting preferences, sensory triggers).
*   Create middleware for the Chat API to inject mid-term memory (current course progress, last completed quiz) into the LLM system context seamlessly.

**Phase 3: Frustration Detection & Edge Cases (Weeks 8-10)**
*   Implement regex and sentiment analysis to score user inputs for frustration/fatigue.
*   Build the "Calm Mode" fallback logic to intercept high-frustration scores and reroute to specific, lower-cognitive-load response templates.

**Phase 4: Optimization & Refinement (Weeks 11-12)**
*   Audit API latency. Ensure DB queries appending context to user turns take < 100ms.
*   Conduct live user testing sessions with neurodivergent Beta testers to refine the Task Deconstruction parsing.
