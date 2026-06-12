
import { create } from 'zustand';

type InputCallback = any; 

interface ServiceFormState {
    price: InputCallback | undefined;
    timer: InputCallback | undefined;
    namer: InputCallback | undefined;
    descr: InputCallback | undefined;
  
    setPrice: (value: InputCallback) => void;
    setTimer: (value: InputCallback) => void;
    setNamer: (value: InputCallback) => void;
    setDescr: (value: InputCallback) => void;
  
    resetForm: () => void;
}


export const ServiceUseFormStore = create<ServiceFormState>((set) => ({
    price: undefined,
    timer: undefined,
    namer: undefined,
    descr: undefined,
    establishment: undefined,

    setPrice: (value) => set({ price: value }),
    setTimer: (value) => set({ timer: value }),
    setNamer: (value) => set({ namer: value }),
    setDescr: (value) => set({ descr: value }),
    resetForm: () => set({ price: undefined, timer: undefined, namer: undefined, descr: undefined }),
}));
