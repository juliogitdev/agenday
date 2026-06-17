
import { useTheme } from "../context/ThemeContext";

export const  Header  = function() {
    const { theme, toggleTheme } = useTheme();

    return (
        <div> 
            {theme}
            <h1>cabecalho</h1>
            <button onClick={toggleTheme}>mudar tema</button>
        </div>
    );
}