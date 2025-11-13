import { InitailNode } from "@/components/initial-node";
import { NodeType } from "@/generated/prisma/enums";
import type { NodeTypes } from "@xyflow/react";

export const nodeComponents = {
    [NodeType.INITIAL] : InitailNode
} as const satisfies NodeTypes;

export type RegisteredNodeType = keyof typeof nodeComponents;