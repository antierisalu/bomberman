export class Router {
    constructor(routes = []) {
        this.routes = routes;
        this._loadInitialRoute();
    }

    _loadInitialRoute() {
        const hash = window.location.hash.replace(/^#/, '') || '/';
        const path = this._normalizePath(hash);
        this.loadRoute(path);
    }

    _normalizePath(path) {
        return path.startsWith('/') ? path : `/${path}`;
    }

    loadRoute(path) {
        const normalizedPath = this._normalizePath(path);
        const route = this.routes.find(r => r.path === normalizedPath);
        if (route) {
            window.history.replaceState({}, '', `#${normalizedPath}`);
            route.handler();
        } else {
            this.handleDynamicRoute(normalizedPath);
        }
    }
    
    init() {
        window.onhashchange = () => {
            const hash = window.location.hash.replace(/^#\/?/, '');
            this.loadRoute(this._normalizePath(hash));
        };
    }

    navigate(path) {
        const normalizedPath = this._normalizePath(path);
        window.location.hash = normalizedPath;
    }

    handleDynamicRoute(path) {
        console.log("Undefined route: ", path);
        this.loadRoute('/404');
    }
}