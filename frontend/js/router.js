// Simple SPA Router
class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = '';
        this.init();
    }

    init() {
        window.addEventListener('hashchange', () => this.handleRoute());
        window.addEventListener('popstate', () => this.handleRoute());
        document.addEventListener('DOMContentLoaded', () => this.handleRoute());
    }

    // Register a route
    route(path, handler) {
        this.routes[path] = handler;
    }

    // Navigate to a route
    navigate(path) {
        if (path.startsWith('#')) {
            window.location.hash = path;
        } else if (path.startsWith('/')) {
            window.location.hash = '#' + path;
        } else {
            window.location.hash = '#' + '/' + path;
        }
        this.handleRoute();
    }

    // Handle current route
    handleRoute() {
        const path = window.location.hash.slice(1) || '/';
        const handler = this.routes[path] || this.routes['/'];
        
        if (handler) {
            this.currentRoute = path;
            handler();
        } else {
            // Default to home if route not found
            if (this.routes['/']) {
                this.routes['/']();
            }
        }
    }

    // Get current route
    getCurrentRoute() {
        return window.location.hash.slice(1) || '/';
    }
}

// Create router instance
const router = new Router();

