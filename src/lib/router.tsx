import React, { createContext, useContext, useSyncExternalStore } from "react";

type LocationState = { pathname: string };
type RouteModule = { default: React.ComponentType };
type RouteEntry = { path: string; component: React.ComponentType };

const NAVIGATE_EVENT = "leafs:navigate";
const OutletContext = createContext<React.ReactNode>(null);

const readLocation = (): LocationState => ({ pathname: window.location.pathname });

let currentLocation = readLocation();

const subscribe = (callback: () => void) => {
    const onPopState = () => {
        currentLocation = readLocation();
        callback();
    };
    window.addEventListener("popstate", onPopState);
    window.addEventListener(NAVIGATE_EVENT, callback);
    return () => {
        window.removeEventListener("popstate", onPopState);
        window.removeEventListener(NAVIGATE_EVENT, callback);
    };
};

const navigateTo = ({ to }: { to: string }) => {
    if (to !== window.location.pathname) {
        window.history.pushState(null, "", to);
        window.scrollTo({ top: 0 });
    }
    currentLocation = readLocation();
    window.dispatchEvent(new Event(NAVIGATE_EVENT));
};

export const Outlet = () => <>{useContext(OutletContext)}</>;

export const Link = ({ to, children, onClick, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }) => (
    <a
        {...props}
        href={to}
        onClick={(event) => {
            onClick?.(event);
            if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            event.preventDefault();
            navigateTo({ to });
        }}>
        {children}
    </a>
);

export function useLocation(): LocationState {
    return useSyncExternalStore(
        subscribe,
        () => currentLocation,
        () => currentLocation
    );
}

/** Navigation impérative, pour les appelants qui ne sont pas des composants. */
export const navigate = navigateTo;

const ROUTES_DIR = "/src/routes";

const modules = import.meta.glob<RouteModule>("/src/routes/**/*.tsx", { eager: true });

/** `routes/index.tsx` sert la racine, les autres fichiers portent leur propre chemin. */
const toPath = (file: string) => {
    const path = file.slice(ROUTES_DIR.length, -".tsx".length);
    return path === "/index" ? "/" : path;
};

const entries: RouteEntry[] = Object.entries(modules).map(([file, module]) => ({ path: toPath(file), component: module.default }));

const rootRoute = entries.find((entry) => entry.path === "/__root");
const pages = entries.filter((entry) => entry !== rootRoute);

const memoizedShells = new WeakMap<React.ComponentType, React.ComponentType>();
const asStableShell = (component: React.ComponentType): React.ComponentType => {
    let cached = memoizedShells.get(component);
    if (!cached) {
        cached = React.memo(component);
        memoizedShells.set(component, cached);
    }
    return cached;
};

export function RouterView({ fallback: Fallback }: { fallback: React.ComponentType }) {
    const { pathname } = useLocation();
    const page = pages.find((route) => route.path === pathname);
    const Root = rootRoute ? asStableShell(rootRoute.component) : React.Fragment;
    const content = page ? <page.component /> : <Fallback />;
    return <OutletContext value={content}>{<Root />}</OutletContext>;
}
