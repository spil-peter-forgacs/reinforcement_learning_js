/**
 * Iterative policy evaluation
 * 
 * JavaScript port of:
 * https://github.com/lazyprogrammer/machine_learning_examples
 */

const SMALL_ENOUGH = 1e-3; // threshold for convergence

function print_values(V, g) {
    const chars = 4;

    for (let i = 0; i < g.rows; i++) {
        console.log("---------------------------");
        const output = [];
        for (let j = 0; j < g.cols; j++) {
            const v = V[[i,j]] || 0;
            let o = ("" + Math.abs(v));
            if (o.length === 1) {
                o += ".";
            }
            o += "0".repeat(chars);

            output.push((v < 0 ? "-" : " ") + o.substring(0, chars) + "|");
        };
        console.log(output.join(""));
    };
}

function print_policy(P, g) {
    for (let i = 0; i < g.rows; i++) {
        console.log("---------------------------");
        const output = [];
        for (let j = 0; j < g.cols; j++) {
            const a = P[[i,j]] || ' ';
            output.push(`  ${a}  |`);
        }
        console.log(output.join(""));
    }
}

function iterative_policy_evaluation() {
    // iterative policy evaluation
    // given a policy, let's find it's value function V(s)
    // we will do this for both a uniform random policy and fixed policy
    // NOTE:
    // there are 2 sources of randomness
    // p(a|s) - deciding what action to take given the state
    // p(s',r|s,a) - the next state and reward given your action-state pair
    // we are only modeling p(a|s) = uniform
    // how would the code change if p(s',r|s,a) is not deterministic?
    grid = standard_grid();

    // states will be positions (i,j)
    // simpler than tic-tac-toe because we only have one "game piece"
    // that can only be at one position at a time
    states = grid.all_states();

    // uniformly random actions
    // initialize V(s) = 0
    let V = [];
    states.forEach(s => V[s] = 0);
    let gamma = 1.0 // discount factor
    // repeat until convergence
    while (true) {
        let biggest_change = 0;
        states.forEach(s => {
            const old_v = V[s];

            // V(s) only has value if it's not a terminal state
            if (grid.actions[s]) {

                let new_v = 0; // we will accumulate the answer
                const p_a = 1.0 / grid.actions[s].length; // each action has equal probability
                grid.actions[s].forEach(a => {
                    grid.set_state(s);
                    const r = grid.move(a);
                    new_v += p_a * (r + gamma * V[grid.current_state()]);
                });
                V[s] = new_v;
                biggest_change = Math.max(biggest_change, Math.abs(old_v - V[s]));
            }
        });

        if (biggest_change < SMALL_ENOUGH) {
            break;
        }
    }

    console.log("values for uniformly random actions:");
    print_values(V, grid);
    console.log("\n\n");

    // fixed policy
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
    print_policy(policy, grid);

    // initialize V(s) = 0
    V = [];
    states.forEach(s => V[s] = 0);

    // let's see how V(s) changes as we get further away from the reward
    gamma = 0.9; // discount factor

    // repeat until convergence
    while (true) {
        let biggest_change = 0;
        states.forEach(s => {
            const old_v = V[s];

            // V(s) only has value if it's not a terminal state
            if (policy[s]) {
                const a = policy[s];
                grid.set_state(s);
                const r = grid.move(a);
                V[s] = r + gamma * V[grid.current_state()];
                biggest_change = Math.max(biggest_change, Math.abs(old_v - V[s]));
            }
        });

        if (biggest_change < SMALL_ENOUGH) {
            break;
        }
    }
    console.log("values for fixed policy:");
    print_values(V, grid);
}
