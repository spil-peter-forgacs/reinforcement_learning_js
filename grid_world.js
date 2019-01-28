/**
 * Grid world
 * 
 * JavaScript port of:
 * https://github.com/lazyprogrammer/machine_learning_examples
 */

class Grid {
    
    constructor(rows, cols, start) {
        this.rows = rows;
        this.cols = cols;
        this.i = start[0];
        this.j = start[1];
    }
    
    set(rewards, actions) {
        // rewards should be an array of: (i, j): r (row, col): reward
        // actions should be an array of: (i, j): A (row, col): list of possible actions
        this.rewards = rewards;
        this.actions = actions;
    }
    
    set_state(s) {
        let state = s;
        if (!Array.isArray(s)) {
            state = s.split(",");
        }
        this.i = state[0] | 0;
        this.j = state[1] | 0;
    }
    
    current_state() {
        return [this.i, this.j];
    }
    
    is_terminal(s) {
        return this.actions.indexOf(s) === -1;
    }
    
    move(action) {
        // check if legal move first
        if (this.actions[[this.i, this.j]].indexOf(action) > -1) {
            if (action === 'U') {
                this.i -= 1;
            }
            else if (action === 'D') {
                this.i += 1;
            }
            else if (action === 'R') {
                this.j += 1;
            }
            else if (action === 'L') {
                this.j -= 1;
            }
        }

        // return a reward (if any)
        return this.rewards[[this.i, this.j]] | 0;
    }
    
    undo_move(action) {
        // these are the opposite of what U/D/L/R should normally do
        if (action === 'U') {
            this.i += 1;
        }
        else if (action === 'D') {
            this.i -= 1;
        }
        else if (action === 'R') {
            this.j -= 1;
        }
        else if (action === 'L') {
            this.j += 1;
        }

        // raise an exception if we arrive somewhere we shouldn't be
        // should never happen
        if (this.all_states().indexOf(this.current_state()) === -1) {
            Tools.error("Error in current state");
        }
    }
    
    game_over() {
        // returns true if game is over, else false
        // true if we are in a state where no actions are possible
        return !this.actions[[this.i, this.j]];
    }
    
    all_states() {
        // simple way to get all states
        // either a position that has possible next actions
        // or a position that yields a reward
        const actions = Object.keys(this.actions);
        const rewards = Object.keys(this.rewards);
        return [...new Set([...actions, ...rewards])];
    }
}

class Grid_world {
    standard_grid() {
        // define a grid that describes the reward for arriving at each state
        // and possible actions at each state
        // the grid looks like this
        // x means you can't go there
        // s means start position
        // number means reward at that state
        // .  .  .  1
        // .  x  . -1
        // s  .  .  .
        const g = new Grid(3, 4, [2, 0]);
        const rewards = [];
        rewards[[0, 3]] = 1;
        rewards[[1, 3]] = -1;
        const actions = [];
        actions[[0, 0]] = ['D', 'R'];
        actions[[0, 1]] = ['L', 'R'];
        actions[[0, 2]] = ['L', 'D', 'R'];
        actions[[1, 0]] = ['U', 'D'];
        actions[[1, 2]] = ['U', 'D', 'R'];
        actions[[2, 0]] = ['U', 'R'];
        actions[[2, 1]] = ['L', 'R'];
        actions[[2, 2]] = ['L', 'R', 'U'];
        actions[[2, 3]] = ['L', 'U'];

        g.set(rewards, actions);
        return g;
    }

    negative_grid(step_cost = -0.1) {
        // in this game we want to try to minimize the number of moves
        // so we will penalize every move
        const g = this.standard_grid();
        g.rewards[[0, 0]] = step_cost;
        g.rewards[[0, 1]] = step_cost;
        g.rewards[[0, 2]] = step_cost;
        g.rewards[[1, 0]] = step_cost;
        g.rewards[[1, 2]] = step_cost;
        g.rewards[[2, 0]] = step_cost;
        g.rewards[[2, 1]] = step_cost;
        g.rewards[[2, 2]] = step_cost;
        g.rewards[[2, 3]] = step_cost;
        return g;
    }
}
