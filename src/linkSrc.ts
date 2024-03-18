import { ModuleRegistry, linkWgsl } from "wgsl-linker";
import src from "./main.wgsl?raw";
import utilWgsl from "./util.wgsl?raw";

export interface LinkedSrc {
  code: string;
  modules: Record<string, string>;
}

/** Link wgsl src
 *
 * @return linked code (and the unlinked src modules - for display in the UI)
 */
export function linkSrc(): LinkedSrc {
  const registry = new ModuleRegistry(utilWgsl);
  const code = linkWgsl(src, registry);
  const modules = { main: src, util: utilWgsl };
  return { code, modules };
}
