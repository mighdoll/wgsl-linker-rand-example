// #module main
// #import pcg_3d from demo.util 

struct Uniforms { frame: u32 }

@binding(0) @group(0) var<uniform> u: Uniforms;

@vertex
fn vertexMain(@builtin(vertex_index) vertex_index: u32) -> @builtin(position) vec4f {
    const pos = array<vec2f,4>(
        vec2(-1.0, -1.0),
        vec2(-1.0, 1.0),
        vec2(1.0, -1.0),
        vec2(1.0, 1.0),
    );

    return vec4f(pos[vertex_index], 0.0, 1.0);
}

@fragment
fn fragmentMain(@builtin(position) pos: vec4f) -> @location(0) vec4f {
    let seed = posToSeed(pos.xy);
    let random = pcg_3d(seed);
    let asFloat = vec3f(random);
    let normalized = ldexp(asFloat, vec3(-32));
    return vec4f(vec3f(normalized), 1.0);
}

// mix position into a seed as per: https://www.shadertoy.com/view/XlGcRh
fn posToSeed(pos: vec2f) -> vec3u {
    let p = pos + f32(u.frame);
    let seed = vec3u(
        u32(p.x),
        u32(p.x) ^ u32(p.y),
        u32(p.x) + u32(p.y),
    );
    return seed;
}

// to show linker resolving name conflict - util.wgsl also uses a fn named 'mixing' 
fn mixing() { }

// #if typecheck 
// typechecking help for wgsl-analyzer VSCode plugin
fn pcg_3d(seed: vec3u) -> vec3u {}
fn ldexp(v: vec3f, p: vec3i) -> vec3u {}
// #endif