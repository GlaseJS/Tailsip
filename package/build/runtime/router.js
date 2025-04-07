export const Router = (opts) => {
    const logger = App.logger("Router");
    return ({
        GET: async (ctx) => {
            let loaderError = (err) => async () => logger.error(err);
            const views = [];
            // First run the loaders and aggregate views
            for (const route of ctx.routes) {
                loaderError = route.error?.loader || route.error?.$ || loaderError;
                if (route.loader) {
                    try {
                        const res = await route.loader(ctx);
                        if (res)
                            return $json(res);
                    }
                    catch (e) {
                        const res = await loaderError(e)(ctx);
                        if (res)
                            return $json(res);
                        if (route.error?.view)
                            views.push(route.error?.view(e));
                        break;
                    }
                }
                if (route.view)
                    views.push(route.view);
            }
            // Then resolve views backward
            let finalView = "";
            for (let i = views.length - 1; i >= 0; i--) {
                const view = views[i];
                finalView = view(ctx, () => finalView);
            }
            if (finalView != "")
                return $view(finalView);
            // No view nor loader returns => route didn't trigger a resolve.
            return $void;
        },
        POST: async (ctx) => {
            let actionError = (err) => async () => logger.error(err);
            const route = ctx.routes[ctx.routes.length - 1];
            actionError = route.error?.action || route.error?.$ || actionError;
            if (route.action) {
                try {
                    const res = await route.action(ctx);
                    if (res)
                        return $json(res);
                }
                catch (e) {
                    const res = await actionError(e)(ctx);
                    if (res)
                        return $json(res);
                }
            }
            return $void;
        }
    });
};
