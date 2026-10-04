from enum import Enum
from pydantic import BaseModel
from typing import List, Optional, Set, Dict, Any

class NodeType(str, Enum):
    ACTOR = "ACTOR"
    EVENT = "EVENT"
    AGENT = "AGENT"
    ARTIFACT = "ARTIFACT"
    WORKFLOW = "WORKFLOW"
    JOB = "JOB"
    SINK = "SINK"

class EdgeType(str, Enum):
    CONSUMES = "CONSUMES"
    PRODUCES = "PRODUCES"
    TRIGGERS = "TRIGGERS"
    EXECUTES = "EXECUTES"
    REACHES = "REACHES"

class Node(BaseModel):
    id: str
    type: NodeType
    properties: Dict[str, Any] = {}

class Edge(BaseModel):
    source: str
    target: str
    type: EdgeType
    properties: Dict[str, Any] = {}

class Graph(BaseModel):
    nodes: Dict[str, Node] = {}
    edges: List[Edge] = []

    def add_node(self, node: Node):
        self.nodes[node.id] = node

    def add_edge(self, edge: Edge):
        self.edges.append(edge)
