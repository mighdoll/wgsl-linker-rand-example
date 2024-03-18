// #module main
// #import pcg_3d

struct Uniforms { frame: u32 }

@binding(0) @group(0) var<uniform> u: Uniforms;

// vertex shader entry point 
@vertex
fn vertexMain(@builtin(vertex_index) vertex_index: u32) -> @builtin(position) vec4<f32> {
    const pos = array<vec2<f32>,4>(
        vec2(-1.0, -1.0),
        vec2(-1.0, 1.0),
        vec2(1.0, -1.0),
        vec2(1.0, 1.0),
    );

    return vec4<f32>(pos[vertex_index], 0.0, 1.0);
}

// fragment shader entry point 
@fragment

fn fragmentMain(@builtin(position) pos: vec4<f32>) -> @location(0) vec4<f32> {
    let seed = posToSeed(pos.xy);
    let random = pcg_3d(seed);
    let asFloat = vec3<f32>(random);
    let normalized = ldexp(asFloat, vec3(-32));
    return vec4<f32>(vec3<f32>(normalized), 1.0);
}

// mix position into a seed as per: https://www.shadertoy.com/view/XlGcRh
fn posToSeed(pos:vec2<f32>)->vec3<u32> {
    let p = pos + f32(u.frame);
    let seed = vec3<u32>(
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
fn pcg_3d(seed: vec3<u32>) -> vec3<u32> {}
fn ldexp(v: vec3<f32>, p: vec3<i32>) -> vec3<u32> {}
// #endif