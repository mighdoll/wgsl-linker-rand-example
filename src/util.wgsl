// #module wgsl-linker-demo.util
// a PCG style random number generator
// adapted from http://www.jcgt.org/published/0009/03/02/

// #export 
fn pcg_3d(seed: vec3<u32>) -> vec3<u32> {
    var v = seed * 1664525u + 1013904223u;

    v = mixing(v);
    v ^= v >> vec3(16u);
    v = mixing(v);

    return v;
}

// permuted lcg (named to show a linker resolved conflict)
fn mixing(v: vec3<u32>) -> vec3<u32> {
    var m: vec3<u32>;
    m.x = v.x + v.y * v.z;
    m.y = v.y + v.z * v.x;
    m.z = v.z + v.x * v.y;

    return m;
}
