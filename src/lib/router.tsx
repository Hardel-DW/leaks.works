import React, { type ComponentType, createContext, useContext, useSyncExternalStore } from "react";
import { HEADS, type Head } from "@/content/heads";
import RootComponent from "@/routes/__root";

type LocationState = { pathname: string };
type Params = Record<string, string>;
export type RouteConfig = { head: (params: Params) => Head; component: ComponentType };
type RouteEntry = RouteConfig & { segments: string[] };

const NAVIGATE_EVENT = "leafs:navigate";
const OutletContext = createContext<React.ReactNode>(null);
const ParamsContext = createContext<Params>({});

const readLocation = (): LocationState => ({ pathname: window.location.pathname.replace(/\/+$/, "") || "/" });

let currentLocation = readLocation();

const ROUTES_DIR = "/src/routes";

const modules = import.meta.glob<RouteConfig>(["/src/routes/**/*.tsx", "!/src/routes/__root.tsx"], { eager: true, import: "default" });

const toSegments = (file: string) =>
    file
        .slice(ROUTES_DIR.length + 1, -".tsx".length)
        .split("/")
        .filter((segment) => segment !== "index");

const pages: RouteEntry[] = Object.entries(modules).map(([file, config]) => ({ ...config, segments: toSegments(file) }));

function match(route: RouteEntry, path: string[]): Params | null {
    if (route.segments.length !== path.length) return null;
    const params: Params = {};
    for (const [index, segment] of route.segments.entries()) {
        if (segment.startsWith("$")) params[segment.slice(1)] = decodeURIComponent(path[index]);
        else if (segment !== path[index]) return null;
    }
    return params;
}

function resolve(pathname: string): { route: RouteEntry; params: Params } | null {
    const path = pathname.split("/").filter(Boolean);
    for (const route of pages) {
        const params = match(route, path);
        if (params) return { route, params };
    }
    return null;
}

function applyHead(pathname: string) {
    const resolved = resolve(pathname);
    document.title = (resolved ? resolved.route.head(resolved.params) : HEADS.notFound).title;
}

const subscribe = (callback: () => void) => {
    const onPopState = () => {
        currentLocation = readLocation();
        applyHead(currentLocation.pathname);
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
    applyHead(currentLocation.pathname);
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

const Root = React.memo(RootComponent);

export function RouterView({ fallback: Fallback }: { fallback: ComponentType }) {
    const { pathname } = useLocation();
    const resolved = resolve(pathname);
    const Page = resolved?.route.component ?? Fallback;
    return (
        <ParamsContext value={resolved?.params ?? {}}>
            <OutletContext value={<Page />}>
                <Root />
            </OutletContext>
        </ParamsContext>
    );
}

applyHead(currentLocation.pathname);
