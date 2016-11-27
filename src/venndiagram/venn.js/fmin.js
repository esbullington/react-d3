// Copyright Ben Frederickson (http://www.benfrederickson.com/better-venn-diagrams/)
// taken from https://github.com/benfred/venn.js/ (MIT Licence)

/** finds the zeros of a function, given two starting points (which must
 * have opposite signs */
export function bisect(f, a, b, parameters) {
    parameters = parameters || {};
    var maxIterations = parameters.maxIterations || 100,
        tolerance = parameters.tolerance || 1e-10,
        fA = f(a),
        fB = f(b),
        delta = b - a;

    if (fA * fB > 0) {
        throw "Initial bisect points must have opposite signs";
    }

    if (fA === 0) return a;
    if (fB === 0) return b;

    for (var i = 0; i < maxIterations; ++i) {
        delta /= 2;
        var mid = a + delta,
            fMid = f(mid);

        if (fMid * fA >= 0) {
            a = mid;
        }

        if ((Math.abs(delta) < tolerance) || (fMid === 0)) {
            return mid;
        }
    }
    return a + delta;
}

// need some basic operations on vectors, rather than adding a dependency,
// just define here
export function zeros(x) { var r = new Array(x); for (var i = 0; i < x; ++i) { r[i] = 0; } return r; }
export function zerosM(x,y) { return zeros(x).map(function() { return zeros(y); }); }

export function dot(a, b) {
    var ret = 0;
    for (var i = 0; i < a.length; ++i) {
        ret += a[i] * b[i];
    }
    return ret;
}

export function norm2(a)  {
    return Math.sqrt(dot(a, a));
}

export function multiplyBy(a, c) {
    for (var i = 0; i < a.length; ++i) {
        a[i] *= c;
    }
}

export function weightedSum(ret, w1, v1, w2, v2) {
    for (var j = 0; j < ret.length; ++j) {
        ret[j] = w1 * v1[j] + w2 * v2[j];
    }
}

/** minimizes a function using the downhill simplex method */
export function fmin(f, x0, parameters) {
    parameters = parameters || {};

    var maxIterations = parameters.maxIterations || x0.length * 200,
        nonZeroDelta = parameters.nonZeroDelta || 1.1,
        zeroDelta = parameters.zeroDelta || 0.001,
        minErrorDelta = parameters.minErrorDelta || 1e-6,
        rho = parameters.rho || 1,
        chi = parameters.chi || 2,
        psi = parameters.psi || -0.5,
        sigma = parameters.sigma || 0.5,
        callback = parameters.callback,
        temp;

    // initialize simplex.
    var N = x0.length,
        simplex = new Array(N + 1);
    simplex[0] = x0;
    simplex[0].fx = f(x0);
    for (var i = 0; i < N; ++i) {
        var point = x0.slice();
        point[i] = point[i] ? point[i] * nonZeroDelta : zeroDelta;
        simplex[i+1] = point;
        simplex[i+1].fx = f(point);
    }

    var sortOrder = function(a, b) { return a.fx - b.fx; };

    var centroid = x0.slice(),
        reflected = x0.slice(),
        contracted = x0.slice(),
        expanded = x0.slice();

    for (var iteration = 0; iteration < maxIterations; ++iteration) {
        simplex.sort(sortOrder);
        if (callback) {
            callback(simplex);
        }

        if (Math.abs(simplex[0].fx - simplex[N].fx) < minErrorDelta) {
            break;
        }

        // compute the centroid of all but the worst point in the simplex
        for (i = 0; i < N; ++i) {
            centroid[i] = 0;
            for (var j = 0; j < N; ++j) {
                centroid[i] += simplex[j][i];
            }
            centroid[i] /= N;
        }

        // reflect the worst point past the centroid  and compute loss at reflected
        // point
        var worst = simplex[N];
        weightedSum(reflected, 1+rho, centroid, -rho, worst);
        reflected.fx = f(reflected);

        // if the reflected point is the best seen, then possibly expand
        if (reflected.fx <= simplex[0].fx) {
            weightedSum(expanded, 1+chi, centroid, -chi, worst);
            expanded.fx = f(expanded);
            if (expanded.fx < reflected.fx) {
                temp = simplex[N];
                simplex[N] = expanded;
                expanded = temp;
            }  else {
                temp = simplex[N];
                simplex[N] = reflected;
                reflected = temp;
            }
        }

        // if the reflected point is worse than the second worst, we need to
        // contract
        else if (reflected.fx >= simplex[N-1].fx) {
            var shouldReduce = false;

            if (reflected.fx <= worst.fx) {
                // do an inside contraction
                weightedSum(contracted, 1+psi, centroid, -psi, worst);
                contracted.fx = f(contracted);
                if (contracted.fx < worst.fx) {
                    temp = simplex[N];
                    simplex[N] = contracted;
                    contracted = temp;
                } else {
                    shouldReduce = true;
                }
            } else {
                // do an outside contraction
                weightedSum(contracted, 1-psi * rho, centroid, psi*rho, worst);
                contracted.fx = f(contracted);
                if (contracted.fx <= reflected.fx) {
                    temp = simplex[N];
                    simplex[N] = contracted;
                    contracted = temp;
                } else {
                    shouldReduce = true;
                }
            }

            if (shouldReduce) {
                // do reduction. doesn't actually happen that often
                for (i = 1; i < simplex.length; ++i) {
                    weightedSum(simplex[i], 1 - sigma, simplex[0], sigma - 1, simplex[i]);
                    simplex[i].fx = f(simplex[i]);
                }
            }
        } else {
            temp = simplex[N];
            simplex[N] = reflected;
            reflected = temp;
        }

    }

    simplex.sort(sortOrder);
    return {f : simplex[0].fx,
            solution : simplex[0]};
}

export function minimizeConjugateGradient(f, initial, params) {
    // allocate all memory up front here, keep out of the loop for perfomance
    // reasons
    var current = {x: initial.slice(), fx: 0, fxprime: initial.slice()},
        next = {x: initial.slice(), fx: 0, fxprime: initial.slice()},
        yk = initial.slice(),
        pk, temp,
        a = 1,
        maxIterations;

    params = params || {};
    maxIterations = params.maxIterations || initial.length * 5;

    current.fx = f(current.x, current.fxprime);
    pk = current.fxprime.slice();
    multiplyBy(pk, -1);

    for (var i = 0; i < maxIterations; ++i) {
        if (params.history) {
            params.history.push({x: current.x.slice(),
                                 fx: current.fx,
                                 fxprime: current.fxprime.slice()});
        }

        a = wolfeLineSearch(f, pk, current, next, a);
        if (!a) {
            // faiiled to find point that satifies wolfe conditions.
            // reset direction for next iteration
            for (var j = 0; j < pk.length; ++j) {
                pk[j] = -1 * current.fxprime[j];
            }
        } else {
            // update direction using Polak–Ribiere CG method
            weightedSum(yk, 1, next.fxprime, -1, current.fxprime);

            var delta_k = dot(current.fxprime, current.fxprime),
                beta_k = Math.max(0, dot(yk, next.fxprime) / delta_k);

            weightedSum(pk, beta_k, pk, -1, next.fxprime);

            temp = current;
            current = next;
            next = temp;
        }

        if (norm2(current.fxprime) <= 1e-5) {
            break;
        }
    }

    if (params.history) {
        params.history.push({x: current.x.slice(),
                             fx: current.fx,
                             fxprime: current.fxprime.slice()});
    }

    return current;
}

var c1 = 1e-6, c2 = 0.1;

/// searches along line 'pk' for a point that satifies the wolfe conditions
/// See 'Numerical Optimization' by Nocedal and Wright p59-60
export function wolfeLineSearch(f, pk, current, next, a) {
    var phi0 = current.fx, phiPrime0 = dot(current.fxprime, pk),
        phi = phi0, phi_old = phi0,
        phiPrime = phiPrime0,
        a0 = 0;

    a = a || 1;

    function zoom(a_lo, a_high, phi_lo) {
        for (var iteration = 0; iteration < 16; ++iteration) {
            a = (a_lo + a_high)/2;
            weightedSum(next.x, 1.0, current.x, a, pk);
            phi = next.fx = f(next.x, next.fxprime);
            phiPrime = dot(next.fxprime, pk);

            if ((phi > (phi0 + c1 * a * phiPrime0)) ||
                (phi >= phi_lo)) {
                a_high = a;

            } else  {
                if (Math.abs(phiPrime) <= -c2 * phiPrime0) {
                    return a;
                }

                if (phiPrime * (a_high - a_lo) >=0) {
                    a_high = a_lo;
                }

                a_lo = a;
                phi_lo = phi;
            }
        }

        return 0;
    }

    for (var iteration = 0; iteration < 10; ++iteration) {
        weightedSum(next.x, 1.0, current.x, a, pk);
        phi = next.fx = f(next.x, next.fxprime);
        phiPrime = dot(next.fxprime, pk);
        if ((phi > (phi0 + c1 * a * phiPrime0)) ||
            (iteration && (phi >= phi_old))) {
            return zoom(a0, a, phi_old);
        }

        if (Math.abs(phiPrime) <= -c2 * phiPrime0) {
            return a;
        }

        if (phiPrime >= 0 ) {
            return zoom(a, a0, phi);
        }

        phi_old = phi;
        a0 = a;
        a *= 2;
    }

    return 0;
}

