/**
 * Monte carlo
 * 
 * JavaScript port of:
 * https://github.com/lazyprogrammer/machine_learning_examples
 */

class Monte_carlo {

    constructor() {
        this.SMALL_ENOUGH = 1e-3;
        this.GAMMA = 0.9;
        this.ALL_POSSIBLE_ACTIONS = ['U', 'D', 'L', 'R'];
    }

    // NOTE: this is only policy evaluation, not optimization

    play_game(grid, policy) {

        // returns a list of states and corresponding returns

        // reset game to start at a random position
        // we need to do this, because given our current deterministic policy
        // we would never end up at certain states, but we still want to measure their value
        const start_states = Object.keys(grid.actions);
        const start_idx = start_states[Math.floor(Math.random() * start_states.length)];
        grid.set_state(start_idx);

        let s = grid.current_state();
        const states_and_rewards = [[s, 0]]; // list of arrays of (state, reward)
        while (!grid.game_over()) {
            const a = policy[s];
            const r = grid.move(a);
            s = grid.current_state();
            states_and_rewards.push([s, r]);
        }
        // calculate the returns by working backwards from the terminal state
        let G = 0;
        const states_and_returns = [];
        let first = true;
        states_and_rewards.reverse().forEach(sar => {
            const s = sar[0];
            const r = sar[1];
            // the value of the terminal state is 0 by definition
            // we should ignore the first state we encounter
            // and ignore the last G, which is meaningless since it doesn't correspond to any move
            if (first) {
                first = false;
            }
            else {
                states_and_returns.push([s, G]);
            }
            G = r + this.GAMMA * G;
        });
        states_and_returns.reverse(); // we want it to be in order of state visited
        return states_and_returns;
    }

    monte_carlo() {

        // use the standard grid again (0 for every step) so that we can compare
        // to iterative policy evaluation
        const grid_world = new Grid_world();
        const grid = grid_world.standard_grid();

        // print rewards
        Tools.log("rewards:");
        Tools.print_values(grid.rewards, grid);

        // state -> action
        const policy = [];
        policy[[2, 0]] = 'U';
        policy[[1, 0]] = 'U';
        policy[[0, 0]] = 'R';
        policy[[0, 1]] = 'R';
        policy[[0, 2]] = 'R';
        policy[[1, 2]] = 'R';
        policy[[2, 1]] = 'R';
        policy[[2, 2]] = 'R';
        policy[[2, 3]] = 'U';

        // initialize V(s) and returns
        const V = [];
        const returns = []; // dictionary of state -> list of returns we've received
        const states = grid.all_states();
        states.forEach(s => {
            if (grid.actions[s]) {
                returns[s] = [];
            }
            else {
                // terminal state or state we can't otherwise get to
                V[s] = 0;
            }
        });

        // repeat
        for (let t = 0; t < 100; t++) {

            // generate an episode using pi
            const states_and_returns = this.play_game(grid, policy);
            const seen_states = [];
            states_and_returns.forEach(sar => {
                const s = sar[0];
                const G = sar[1];
                // check if we have already seen s
                // called "first-visit" MC policy evaluation
                if (!seen_states[s]) {
                    returns[s].push(G);
                    V[s] = nj.mean(returns[s]);
                    seen_states.push(s);
                }
            });
        }

        Tools.log("values:");
        Tools.print_values(V, grid);
        Tools.log("policy:");
        Tools.print_policy(policy, grid);
    }
}
