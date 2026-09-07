import { type RefCallback, useState } from "react";

export function useVisible(): [boolean, RefCallback<HTMLElement>] {
    const [visible, setVisible] = useState(false);
    const ref: RefCallback<HTMLElement> = (element) => {
        if (!element) return;
        const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "120px" });
        observer.observe(element);
        return () => observer.disconnect();
    };
    return [visible, ref];
}
