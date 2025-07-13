import heapq

# Graph representation
graph = {
    'A': [('D', 1), ('C', 1),('E',1)],  # OR between B, C, D
    'B': [('E', 1), ('F', 1)],            # AND between E and F
    'C': [('G', 1), ('H', 1), ('I', 1)],  # AND between G, H, I
    'D': [],                              # Terminal node
    'E': [], 'F': [], 'G': [], 'H': [], 'I': []  # Terminal nodes
}

# Heuristic values
heuristics = {
    'A': 7,
    'B': 4,
    'C': 2,
    'D': 3,
    'E': 6,
    'F': 4,
    'G': 2,
    'H': 0,
    'I': 0
}

# Cost dictionary for nodes
cost_from_start = {node: float('inf') for node in graph}
cost_from_start['A'] = 0  # Starting point has zero cost

parent = {}

# Priority Queue (Min-Heap) for A* (f(n) = g(n) + h(n))
open_list = []
heapq.heappush(open_list, (heuristics['A'], 'A'))

while open_list:
    current_f, current_node = heapq.heappop(open_list)

    if not graph[current_node]:
        break

    # Process all neighbors (successors) of the current node
    for neighbor, edge_cost in graph[current_node]:
        tentative_g = cost_from_start[current_node] + edge_cost

        if tentative_g < cost_from_start[neighbor]:
            cost_from_start[neighbor] = tentative_g
            f_value = tentative_g + heuristics[neighbor]
            heapq.heappush(open_list, (f_value, neighbor))
            parent[neighbor] = current_node

# Reconstruct the path from the 'A' node to the goal
goal = 'H'
path = []
node = goal
while node != 'A':
    path.append(node)
    node = parent[node]
path.append('A')
path.reverse()

print("Optimal Solution Path: ", ' -> '.join(path))
