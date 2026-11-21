import { create } from "zustand";

const STORAGE_KEY='coinflow-theme'

const getInitialTheme=()=>{
    const saved=localStorage.getItem(STORAGE_KEY)
    if(saved==='dark'||saved==='light') return saved

    return window.matchMedia("(prefers-color-scheme=dark)").matches?'dark':'light'
}

const applyThemeToDom=(theme)=>{
    const root=document.documentElement
    if(theme==='dark')
        root.classList.add("dark")
    else
        root.classList.remove("dark")
    localStorage.setItem(STORAGE_KEY,theme)
}

const initialTheme=getInitialTheme()
applyThemeToDom(initialTheme)

export const useThemeStore=create(set=>({
    theme:initialTheme,

    setTheme:(nextTheme)=>{
        applyThemeToDom(nextTheme)
        set({theme:nextTheme})
    },

    toggleTheme:()=>set(state=>{
        const nextTheme=state.theme==='dark'?'light':'dark'
        applyThemeToDom(nextTheme)
        return {theme:nextTheme}
    })
}))