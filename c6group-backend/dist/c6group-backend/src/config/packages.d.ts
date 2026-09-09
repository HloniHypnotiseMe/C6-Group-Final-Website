import { PackageConfig, PackageType, AgentType } from '../types';
export declare const packageConfigs: Record<PackageType, PackageConfig>;
export declare function hasExceededAILimit(packageType: PackageType, agentType: AgentType, currentUsage: number): boolean;
export declare function getRemainingAICalls(packageType: PackageType, agentType: AgentType, currentUsage: number): number;
export declare function getPackageAILimits(packageType: PackageType): Record<AgentType, number>;
export declare const LLM_COSTS: Record<string, {
    input: number;
    output: number;
}>;
export declare const AGENT_DEFAULT_MODELS: Record<AgentType, string>;
//# sourceMappingURL=packages.d.ts.map