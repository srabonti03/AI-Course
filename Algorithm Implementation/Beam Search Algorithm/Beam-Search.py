import heapq

# Graph structure (with edge costs, although not used in greedy best-first)
graph = {
    'A': [('B', 11), ('C', 4), ('D', 7)],
    'B': [('E', 15)],
    'C': [('E', 10), ('F', 12)],
    'D': [('F', 25)],
    'E': [('H', 9)],
    'H': [('G', 10)],
    'F': [('G', 20)],
    'G': [],
}

# Heuristic values (from node to G)
heuristic = {
    'A': 40,
    'B': 10,
    'C': 35,
    'D': 25,
    'E': 19,
    'F': 17,
    'H': 10,
    'G': 0,
}

def beamSearch(start, goal, beam_width):
    open_list = []
    # Push the start node with its heuristic value into the open list
    heapq.heappush(open_list, (heuristic[start], start))
    closed_list = []
    visited = set()  # Track visited nodes to avoid revisiting

    while open_list:
        # Pop the node with the lowest heuristic value
        _, current = heapq.heappop(open_list)
        closed_list.append(current)
        visited.add(current)

        # Check if goal reached
        if current == goal:
            break

        # Add neighbors to open list if not visited or already in open_list
        for neighbor, _ in graph[current]:
            if neighbor not in visited and all(neighbor != n for _, n in open_list):
                heapq.heappush(open_list, (heuristic[neighbor], neighbor))

        # Keep only top beam_width nodes in open_list
        open_list = heapq.nsmallest(beam_width, open_list)
        heapq.heapify(open_list)  # Re-heapify after slicing

        # Debug print to see current open list state
        print(f"Current open list: {open_list}")

    # Return path visited in order as string
    return "->".join(closed_list)

print(beamSearch('A', 'G', 3))
