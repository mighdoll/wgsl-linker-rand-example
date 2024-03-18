// #module main
// #import pcg_3d

struct Uniforms { frame: u32 }

@binding(0) @group(0) var<uniform> u: Uniforms;

@vertex
fn vertexMain(@builtin(vertex_index) vertex_index: u32) -> @builtin(position) vec4<f32> {
    const pos = array(
        vec2(-1.0, -1.0),
        vec2(-1.0, 1.0),
        vec2(1.0, -1.0),
        vec2(1.0, 1.0),
    );

    return vec4<f32>(pos[vertex_index], 0, 1);
}

@fragment
fn fragmentMain(@builtin(position) pos: vec4<f32>) -> @location(0) vec4<f32> {
    let uPos = vec2<u32>(pos.xy) + u.frame;
    let random = pcg_3d(vec3(uPos, 1u));
    let asFloat = vec3<f32>(random);
    let normalized = ldexp(asFloat, vec3(-32));
    return vec4(normalized, 1);
}

// to show linker resolving name conflict 
fn mixing() { }