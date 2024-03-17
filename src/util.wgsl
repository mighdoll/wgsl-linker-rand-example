// a PCG style random number generator
// adapted from http://www.jcgt.org/published/0009/03/02/

// #export 
fn pcg_3d(seed: vec3<u32>) -> vec3<u32> {
    var v = seed * 1664525u + 1013904223u;

    v.x += v.y * v.z;
    v.y += v.z * v.x;
    v.z += v.x * v.y;

    let shifted = v >> vec3(16u);
    v ^= shifted;

    v.x += v.y * v.z;
    v.y += v.z * v.x;
    v.z += v.x * v.y;

    return v;
}


