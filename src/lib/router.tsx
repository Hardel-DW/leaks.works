import React, { createContext, useContext, useSyncExternalStore } from "react";

type LocationState = { pathname: string };
type RouteModule = { default: React.ComponentType };
type RouteEntry = { segments: string[]; component: React.ComponentType };
type Params = Record<string, string>;

const NAVIGATE_EVENT = "leafs:navigate";
const OutletContext = createContext<React.ReactNode>(null);
const ParamsContext = createContext<Params>({});

const readLocation = (): LocationState => ({ pathname: window.location.pathname.replace(/\/+$/, "") || "/" });

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

export const navigate = (to: string) => {
    if (to !== window.location.pathname) {
        window.history.pushState(null, "", to);
        window.scrollTo({ top: 0, behavior: "instant" });
    }
    currentLocation = readLocation();
    window.dispatchEvent(new Event(NAVIGATE_EVENT));
};

export const Outlet = () => <>{useContext(OutletContext)}</>;

export const useParams = () => useContext(ParamsContext);

export const Link = ({ to, children, onClick, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }) => (
    <a
        {...props}
        href={to}
        onClick={(event) => {
            onClick?.(event);
            if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            event.preventDefault();
            navigate(to);
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

const ROUTES_DIR = "/src/routes";

const modules = import.meta.glob<RouteModule>("/src/routes/**/*.tsx", { eager: true });

const toSegments = (file: string) =>
    file
        .slice(ROUTES_DIR.length + 1, -".tsx".length)
        .split("/")
        .filter((segment) => segment !== "index");

const entries: RouteEntry[] = Object.entries(modules).map(([file, module]) => ({ segments: toSegments(file), component: module.default }));

const rootRoute = entries.find((entry) => entry.segments[0] === "__root");
const pages = entries.filter((entry) => entry !== rootRoute);

function match(route: RouteEntry, path: string[]): Params | null {
    if (route.segments.length !== path.length) return null;
    const params: Params = {};
    for (const [index, segment] of route.segments.entries()) {
        if (segment.startsWith("$")) params[segment.slice(1)] = decodeURIComponent(path[index]);
        else if (segment !== path[index]) return null;
    }
    return params;
}

function resolve(pathname: string): { component: React.ComponentType; params: Params } | null {
    const path = pathname.split("/").filter(Boolean);
    for (const route of pages) {
        const params = match(route, path);
        if (params) return { component: route.component, params };
    }
    return null;
}

const Root = rootRoute ? React.memo(rootRoute.component) : React.Fragment;

export function RouterView({ fallback: Fallback }: { fallback: React.ComponentType }) {
    const { pathname } = useLocation();
    const resolved = resolve(pathname);
    const content = resolved ? <resolved.component /> : <Fallback />;
    return (
        <ParamsContext value={resolved?.params ?? {}}>
            <OutletContext value={content}>
                <Root />
            </OutletContext>
        </ParamsContext>
    );
}
