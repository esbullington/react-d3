// Copyright Ben Frederickson (http://www.benfrederickson.com/better-venn-diagrams/)
// taken from https://github.com/benfred/venn.js/blob/master/src/diagram.js#L488 (MIT Licence)
export (x, y, r) => {
    var ret = [];
    ret.push("\nM", x, y);
    ret.push("\nm", -r, 0);
    ret.push("\na", r, r, 0, 1, 0, r *2, 0);
    ret.push("\na", r, r, 0, 1, 0,-r *2, 0);
    return ret.join(" ");
}