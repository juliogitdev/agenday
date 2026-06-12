
import { useState } from "react";

export function AlertHook() {
	const [isVisible, setIsVisible] = useState(false);
	const [title, setTitle] = useState("");
	const [message, setMessage] = useState("");

	const show = ( title: string, message: string, timeout?: number) => {
		setTitle(title);
		setMessage(message);
		setIsVisible(true);
		if (timeout) { setTimeout(() => { hide(); }, timeout);}
	};

	const hide = () => { setIsVisible(false);};
	return { isVisible, title, message, show, hide};
}