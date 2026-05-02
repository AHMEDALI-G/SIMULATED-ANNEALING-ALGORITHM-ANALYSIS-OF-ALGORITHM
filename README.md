# SIMULATED-ANNEALING-ALGORITHM-ANALYSIS-OF-ALGORITHM
This project implements Simulated Annealing, a probabilistic optimization algorithm inspired by metallurgy. It explores complex search spaces, avoids local minima, and finds near-optimal solutions using configurable cooling schedules and iterative improvements.
# 🔥 Simulated Annealing Optimization

## 📌 Overview

This project implements the **Simulated Annealing (SA)** algorithm, a probabilistic optimization technique inspired by the annealing process in metallurgy. It is used to find near-optimal solutions for complex problems where traditional methods may get trapped in local minima.

---

## 🚀 Features

* Configurable **initial temperature** and **cooling schedule**
* Flexible **iteration control**
* Supports different **optimization problems**
* Demonstrates trade-offs between **accuracy and performance**
* Simple and modular implementation for easy customization

---

## ⚙️ How It Works

Simulated Annealing starts with an initial solution and explores neighboring solutions iteratively. At high temperatures, worse solutions may be accepted to encourage exploration. As the temperature decreases, the algorithm becomes more selective, gradually converging to a near-optimal solution.

---

## 🧠 Algorithm Steps

1. Initialize a random solution
2. Set initial temperature
3. Generate a neighboring solution
4. Calculate cost difference
5. Accept or reject based on probability
6. Decrease temperature
7. Repeat until stopping condition is met

---

## ⏱️ Time Complexity

The time complexity depends on:

* Number of iterations (**k**)
* Cost of evaluating a solution (**f(n)**)

**General form:**
`O(k × f(n))`

In many practical cases:
`O(n × k)`

---

## 🛠️ Usage

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/simulated-annealing.git
   cd simulated-annealing
   ```

2. Run the program:

   ```bash
   python main.py
   ```

3. Modify parameters in the code:

   * Initial temperature
   * Cooling rate
   * Iteration limit

---

## 📊 Applications

* Traveling Salesman Problem (TSP)
* Scheduling problems
* Resource allocation
* Machine learning optimization
* Engineering design problems

---

## 📈 Advantages

* Escapes local minima effectively
* Simple and flexible
* Works well for large search spaces

---

## ⚠️ Limitations

* No guarantee of global optimum
* Performance depends on parameter tuning
* Can be slow for large-scale problems

---

## 🤝 Contributing

Contributions are welcome! Feel free to fork the repo, open issues, or submit pull requests.

---

## 📄 License

This project is open-source and available under the MIT License.
