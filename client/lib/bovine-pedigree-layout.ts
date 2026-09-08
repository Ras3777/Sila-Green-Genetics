import {
  PedigreeGraphNode,
  PedigreeGraphEdge,
  PedigreeDensity,
  PedigreeLayoutDirection,
} from './bovine-pedigree-types';
import { NODE_DIMENSIONS } from './bovine-pedigree-utils';

export type LayoutEngine = 'elk' | 'dagre' | 'tree';

export interface LayoutOptions {
  density: PedigreeDensity;
  direction: PedigreeLayoutDirection;
  engine?: LayoutEngine;
}

/**
 * ELK.js Layered Layout Engine (Primary)
 */
export async function layoutWithElk(
  nodes: PedigreeGraphNode[],
  edges: PedigreeGraphEdge[],
  options: LayoutOptions
): Promise<PedigreeGraphNode[]> {
  const { density, direction } = options;
  const dims = NODE_DIMENSIONS[density];

  try {
    // Dynamic import to prevent SSR issues and keep bundle split
    const ELKModule = await import('elkjs/lib/elk.bundled.js');
    const ELK = (ELKModule as any).default || ELKModule;
    const elk = new ELK();

    const elkGraph = {
      id: 'root',
      layoutOptions: {
        'elk.algorithm': 'layered',
        'elk.direction': direction === 'LR' ? 'RIGHT' : 'DOWN',
        'elk.spacing.nodeNode': String(dims.gapY),
        'elk.layered.spacing.nodeNodeBetweenLayers': String(dims.gapX),
        'elk.padding': '[top=50,left=50,bottom=50,right=50]',
        'elk.layered.nodePlacement.strategy': 'BRANDES_KOEPF',
        'elk.edgeRouting': 'SPLINES',
      },
      children: nodes.map((n) => ({
        id: n.id,
        width: n.width || dims.width,
        height: n.height || dims.height,
      })),
      edges: edges.map((e) => ({
        id: e.id,
        sources: [e.source],
        targets: [e.target],
      })),
    };

    const layoutResult = await elk.layout(elkGraph);

    if (layoutResult && layoutResult.children) {
      const positionMap = new Map<string, { x: number; y: number }>();
      layoutResult.children.forEach((child: any) => {
        positionMap.set(child.id, { x: child.x || 0, y: child.y || 0 });
      });

      return nodes.map((node) => {
        const pos = positionMap.get(node.id);
        if (pos) {
          return {
            ...node,
            x: pos.x,
            y: pos.y,
            position: { x: pos.x, y: pos.y },
          };
        }
        return node;
      });
    }
  } catch (err) {
    console.warn('ELK.js layout error, falling back to Dagre:', err);
  }

  return layoutWithDagre(nodes, edges, options);
}

/**
 * Dagre Layout Engine (Fallback)
 */
export function layoutWithDagre(
  nodes: PedigreeGraphNode[],
  edges: PedigreeGraphEdge[],
  options: LayoutOptions
): PedigreeGraphNode[] {
  const { density, direction } = options;
  const dims = NODE_DIMENSIONS[density];

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const dagre = require('@dagrejs/dagre');
    const g = new dagre.graphlib.Graph();

    g.setGraph({
      rankdir: direction,
      nodesep: dims.gapY + 10,
      ranksep: dims.gapX + 20,
      marginx: 50,
      marginy: 50,
    });
    g.setDefaultEdgeLabel(() => ({}));

    nodes.forEach((node) => {
      g.setNode(node.id, {
        width: node.width || dims.width,
        height: node.height || dims.height,
      });
    });

    edges.forEach((edge) => {
      g.setEdge(edge.source, edge.target);
    });

    dagre.layout(g);

    return nodes.map((node) => {
      const dagreNode = g.node(node.id);
      if (dagreNode) {
        // Dagre uses center point, convert to top-left
        const x = dagreNode.x - (node.width || dims.width) / 2;
        const y = dagreNode.y - (node.height || dims.height) / 2;
        return {
          ...node,
          x,
          y,
          position: { x, y },
        };
      }
      return node;
    });
  } catch (err) {
    console.warn('Dagre layout failed, using native tree positions:', err);
    return nodes;
  }
}
