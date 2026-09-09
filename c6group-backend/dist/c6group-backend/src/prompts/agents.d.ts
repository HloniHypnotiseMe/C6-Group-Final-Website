import { AgentPrompt, AgentType } from '../types';
export declare const businessAuditAgent: AgentPrompt;
export declare const seoAnalyzerAgent: AgentPrompt;
export declare const contentGeneratorAgent: AgentPrompt;
export declare const chatbotAgent: AgentPrompt;
export declare const emailAssistantAgent: AgentPrompt;
export declare const salesAssistantAgent: AgentPrompt;
export declare const marketingStrategistAgent: AgentPrompt;
export declare const customerSupportAgent: AgentPrompt;
export declare const dataAnalystAgent: AgentPrompt;
export declare const codeAssistantAgent: AgentPrompt;
export declare const allAgents: Record<AgentType, AgentPrompt>;
export declare function getAgent(agentType: AgentType): AgentPrompt;
export declare function getAllAgentTypes(): AgentType[];
export declare function getAgentInfo(agentType: AgentType): {
    id: string;
    name: string;
    description: string;
};
//# sourceMappingURL=agents.d.ts.map