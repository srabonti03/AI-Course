from collections import deque
def breadth_first_search(network, start):
    visited = set()
    queue = deque([start])
    while queue:
        current = queue.popleft()
        if current not in visited:
            print(current)
            visited.add(current)
            for adjacent in network[current]:
                if adjacent not in visited:
                    queue.append(adjacent)

# Graph network (same as your DFS one)
network = {
    'A': ['B','D'],
    'B': ['C','E','D'],
    'D': ['E'],
    'C': ['E'],
    
}
breadth_first_search(network, 'A')










