
import { useState } from "react";

export function ModalHook() {
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any>(null);

    const show = (data?: any) => { 
		setVisible(true);
        setData(data);
    };

    const hidden = () => {
        setVisible(false);
        setLoading(false);
        setData(null);
    };

    return { visible, loading, data, show, hidden, setLoading};
}