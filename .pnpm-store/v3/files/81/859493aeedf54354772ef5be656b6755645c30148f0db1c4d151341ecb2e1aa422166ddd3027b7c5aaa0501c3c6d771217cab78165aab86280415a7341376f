export async function makeResolver(dir, nextConfig) {
    const url = require("url");
    const { default: Router  } = require("../router");
    const { getPathMatch  } = require("../../shared/lib/router/utils/path-match");
    const { default: DevServer  } = require("../dev/next-dev-server");
    const { NodeNextRequest , NodeNextResponse  } = require("../base-http/node");
    const { default: loadCustomRoutes  } = require("../../lib/load-custom-routes");
    const devServer = new DevServer({
        dir,
        conf: nextConfig
    });
    devServer.customRoutes = await loadCustomRoutes(nextConfig);
    const routes = devServer.generateRoutes.bind(devServer)();
    devServer.router = new Router(routes);
    const routeResults = new Map();
    // @ts-expect-error internal field
    devServer.router.catchAllRoute = {
        match: getPathMatch("/:path*"),
        name: "catchall route",
        fn: async (req, _res, _params, parsedUrl)=>{
            // clean up internal query values
            for (const key of Object.keys(parsedUrl.query || {})){
                if (key.startsWith("_next")) {
                    delete parsedUrl.query[key];
                }
            }
            routeResults.set(req._initUrl, url.format({
                pathname: parsedUrl.pathname,
                query: parsedUrl.query,
                hash: parsedUrl.hash
            }));
            return {
                finished: true
            };
        }
    };
    // @ts-expect-error internal field
    devServer.router.compiledRoutes = devServer.router.compiledRoutes.filter((route)=>{
        var ref;
        return route.type === "rewrite" || route.type === "redirect" || route.type === "header" || route.name === "catchall route" || ((ref = route.name) == null ? void 0 : ref.includes("check"));
    });
    return async function resolveRoute(_req, _res) {
        const req = new NodeNextRequest(_req);
        const res = new NodeNextResponse(_res);
        req._initUrl = req.url;
        await devServer.router.execute.bind(devServer.router)(req, res, url.parse(req.url, true));
        if (!res.originalResponse.headersSent) {
            res.setHeader("x-nextjs-route-result", "1");
            const resolvedUrl = routeResults.get(req._initUrl) || req.url;
            const routeResult = {
                url: resolvedUrl,
                statusCode: 200,
                headers: {}
            };
            res.body(JSON.stringify(routeResult)).send();
        }
    };
}

//# sourceMappingURL=route-resolver.js.map