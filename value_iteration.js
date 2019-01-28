/**
 * Value Iteration
 *
 * JavaScript port of:
 * https://github.com/lazyprogrammer/machine_learning_examples
 */


class Value_iteration {

    constructor() {
        this.SMALL_ENOUGH = 1e-3;
        this.GAMMA = 0.9;
        this.ALL_POSSIBLE_ACTIONS = ['U', 'D', 'L', 'R'];
    }

    value_iteration() {
        // this is deterministic
        // all p(s',r|s,a) = 1 or 0

        // this grid gives you a reward of -0.1 for every non-terminal state
        // we want to see if this will encourage finding a shorter path to the goal
        const grid_world = new Grid_world();
        const grid = grid_world.negative_grid();

        // print rewards
        Tools.log("rewards:");
        Tools.print_values(grid.rewards, grid);

        // state -> action
        // we'll randomly choose an action and update as we learn
        const policy = [];
        Object.keys(grid.actions).forEach(s => {
            policy[s] = this.ALL_POSSIBLE_ACTIONS[Math.floor(this.ALL_POSSIBLE_ACTIONS.length * Math.random())];
        });

        // initial policy
        Tools.print("initial policy:");
        Tools.print_policy(policy, grid);

        // initialize V(s)
        const V = [];
        const states = grid.all_states();
        states.forEach(s => {
            // V[s] = 0
            if (grid.actions[s]) {
                V[s] = Math.random();
            }
            else {
                // terminal state
                V[s] = 0;
            }
        });

        // repeat until convergence
        // V[s] = max[a]{ sum[s',r] { p(s',r|s,a)[r + gamma*V[s']] } }
        while (true) {
            let biggest_change = 0;

            states.forEach(s => {
                const old_v = V[s];

                // V(s) only has value if it's not a terminal state
                if (policy[s]) {
                    let new_v = -Infinity;
                    this.ALL_POSSIBLE_ACTIONS.forEach(a => {
                        grid.set_state(s);
                        const r = grid.move(a);
                        const v = r + this.GAMMA * V[grid.current_state()];
                        if (v > new_v) {
                            new_v = v;
                        }
                    });
                    V[s] = new_v;
                    biggest_change = Math.max(biggest_change, Math.abs(old_v - V[s]));
                }
            });

            if (biggest_change < this.SMALL_ENOUGH) {
                break;
            }
        }

        // find a policy that leads to optimal value function
        Object.keys(policy).forEach(s => {

            let best_a = null;
            let best_value = -Infinity;
            // loop through all possible actions to find the best current action
            this.ALL_POSSIBLE_ACTIONS.forEach(a => {
                grid.set_state(s);
                const r = grid.move(a);
                const v = r + this.GAMMA * V[grid.current_state()];
                if (v > best_value) {
                    best_value = v;
                    best_a = a;
                }
            });
            policy[s] = best_a;
        });

        // our goal here is to verify that we get the same answer as with policy iteration
        Tools.print("values:");
        Tools.print_values(V, grid);
        Tools.print("policy:");
        Tools.print_policy(policy, grid);
    }
}
