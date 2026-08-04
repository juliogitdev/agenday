import { useEffect, useState } from "react";

export function useIsMobile(breakpoint: number = 768): boolean {
	const getMatch = () => window.matchMedia(`(max-width: ${breakpoint}px)`).matches;

	const [isMobile, setIsMobile] = useState<boolean>(getMatch());

	useEffect(() => {
		const mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`);
		const handleChange = () => setIsMobile(mediaQuery.matches);

		handleChange();
		mediaQuery.addEventListener("change", handleChange);
		return () => mediaQuery.removeEventListener("change", handleChange);
	}, [breakpoint]);

	return isMobile;
}
