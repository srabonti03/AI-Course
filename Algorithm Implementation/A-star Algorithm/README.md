# 🔍 A* Search Algorithm in AND-OR Graphs

This project implements the **A\*** Search Algorithm to find an **optimal path** in a graph that includes both **AND** and **OR** relationships between nodes. The algorithm uses heuristics to determine the most promising path towards the goal node.
---

## 🧠 How the Algorithm Works

The A* algorithm is a **best-first search** technique that finds the **least-cost path** from a start node to a goal node by considering both:

- `g(n)`: Actual cost from the start node to the current node.
- `h(n)`: Heuristic estimated cost from the current node to the goal.

The total estimated cost is:
```text
f(n) = g(n) + h(n)
```
