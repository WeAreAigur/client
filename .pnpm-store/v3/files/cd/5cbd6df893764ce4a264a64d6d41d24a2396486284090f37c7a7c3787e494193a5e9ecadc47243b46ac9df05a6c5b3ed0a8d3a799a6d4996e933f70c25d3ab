import { BUILD_MANIFEST, REACT_LOADABLE_MANIFEST, FLIGHT_MANIFEST } from "../shared/lib/constants";
import { join } from "path";
import { requirePage } from "./require";
import { interopDefault } from "../lib/interop-default";
export async function loadDefaultErrorComponents(distDir) {
    const Document = interopDefault(require("next/dist/pages/_document"));
    const AppMod = require("next/dist/pages/_app");
    const App = interopDefault(AppMod);
    const ComponentMod = require("next/dist/pages/_error");
    const Component = interopDefault(ComponentMod);
    return {
        App,
        Document,
        Component,
        pageConfig: {},
        buildManifest: require(join(distDir, `fallback-${BUILD_MANIFEST}`)),
        reactLoadableManifest: {},
        ComponentMod,
        pathname: "/_error"
    };
}
async function loadManifest(manifestPath, attempts = 1) {
    try {
        return require(manifestPath);
    } catch (err) {
        if (attempts >= 3) {
            throw err;
        }
        await new Promise((resolve)=>setTimeout(resolve, 100));
        return loadManifest(manifestPath, attempts + 1);
    }
}
export async function loadComponents({ distDir , pathname , hasServerComponents , isAppPath  }) {
    let DocumentMod = {};
    let AppMod = {};
    if (!isAppPath) {
        [DocumentMod, AppMod] = await Promise.all([
            Promise.resolve().then(()=>requirePage("/_document", distDir, false)),
            Promise.resolve().then(()=>requirePage("/_app", distDir, false)), 
        ]);
    }
    const ComponentMod = await Promise.resolve().then(()=>requirePage(pathname, distDir, isAppPath));
    const [buildManifest, reactLoadableManifest, serverComponentManifest] = await Promise.all([
        loadManifest(join(distDir, BUILD_MANIFEST)),
        loadManifest(join(distDir, REACT_LOADABLE_MANIFEST)),
        hasServerComponents ? loadManifest(join(distDir, "server", FLIGHT_MANIFEST + ".json")) : null, 
    ]);
    const Component = interopDefault(ComponentMod);
    const Document = interopDefault(DocumentMod);
    const App = interopDefault(AppMod);
    const { getServerSideProps , getStaticProps , getStaticPaths  } = ComponentMod;
    return {
        App,
        Document,
        Component,
        buildManifest,
        reactLoadableManifest,
        pageConfig: ComponentMod.config || {},
        ComponentMod,
        getServerSideProps,
        getStaticProps,
        getStaticPaths,
        serverComponentManifest,
        isAppPath,
        pathname
    };
}

//# sourceMappingURL=load-components.js.map