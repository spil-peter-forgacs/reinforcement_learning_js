/**
 * Tools
 */

class Tools {
    static print_values(V, g) {
        const chars = 4;

        for (let i = 0; i < g.rows; i++) {
            Tools.log("---------------------------");
            const output = [];
            for (let j = 0; j < g.cols; j++) {
                const v = V[[i,j]] || 0;
                let o = ("" + Math.abs(v));
                if (o.length === 1) {
                    o += ".";
                }
                o += "0".repeat(chars);

                output.push((v < 0 ? "-" : " ") + o.substring(0, chars) + "|");
            }
            Tools.log(output.join(""));
        }
    }

    static print_policy(P, g) {
        for (let i = 0; i < g.rows; i++) {
            Tools.log("---------------------------");
            const output = [];
            for (let j = 0; j < g.cols; j++) {
                const a = P[[i,j]] || ' ';
                output.push(`  ${a}  |`);
            }
            Tools.log(output.join(""));
        }
    }

    static log(message) {
        if (!this.myDiv) {
            this.myDiv = document.createElement("div");
            document.body.appendChild(this.myDiv);
        }

        this.myDiv.innerHTML += message.replace(/ /g, "&nbsp;") + "<br >";

        console.log(message);
    }
}
