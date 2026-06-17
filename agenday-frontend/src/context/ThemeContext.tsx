import { createContext, useContext, useEffect, useState } from 'react'
type Theme = 'light' | 'dark'

interface ThemeContextValue {
    theme: Theme
    toggleTheme: () => void
}

interface ThemeProviderProps {
    children: React.ReactNode
}
const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: ThemeProviderProps) {
    const saved = localStorage.getItem('theme') as Theme | null // eslint-disable-line no-restricted-globals
    const [theme, setTheme] = useState<Theme>(saved ?? 'light')

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
        localStorage.setItem('theme', theme) // eslint-disable-line no-restricted-globals
    }, [theme])

    const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'))

    return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error('useTheme deve ser usado dentro de <ThemeProvider>')
    }
    return context
}
