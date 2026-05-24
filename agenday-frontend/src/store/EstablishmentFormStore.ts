
import { create } from "zustand";
import type { InputCallback } from "../types/Inputs";

import type {
	EstablishmentForm_adress,
	EstablishmentForm_basic,
	EstablishmentForm_visual
} from "../types/Estableshment";


const emptyInput: InputCallback = {
	value: "",
	errorMessage: null,
	isValid: false
};

interface EstablishmentFormStateStoreType {
	basicData: EstablishmentForm_basic;
	adressData: EstablishmentForm_adress;
	visualData: EstablishmentForm_visual;

	setBasicData: (fields: Partial<EstablishmentForm_basic>) => void;
	setAdressData: (fields: Partial<EstablishmentForm_adress>) => void;
	setVisualData: (fields: Partial<EstablishmentForm_visual>) => void;

	resetForm: () => void;
}

const initialBasicData: EstablishmentForm_basic = {
	name: { ...emptyInput },
	numberPhone: { ...emptyInput },
	category: { ...emptyInput },
};

const initialAdressData: EstablishmentForm_adress = {
	cep: { ...emptyInput },
	state: { ...emptyInput },
	city: { ...emptyInput },
	street: { ...emptyInput },
	number: { ...emptyInput },
	neighborhood: { ...emptyInput }
};

const initialVisualData: EstablishmentForm_visual = {
	template: {
		value: "1",
        errorMessage: null,
        isValid: true
	},

	slogan: { ...emptyInput },

	palette: {
        value: {
            text_color: "#000000",
            back_color: "#ffffff",
            main_color: "#1d4f86"
        },
        errorMessage: null,
        isValid: false
    },

	image: {
		value: {file: null},
        errorMessage: null,
        isValid: false
	}
};

export const EstablishmentFormStore =
	create<EstablishmentFormStateStoreType>()((set) => ({

		basicData: initialBasicData,
		adressData: initialAdressData,
		visualData: initialVisualData,

		setBasicData: (fields) =>
			set((state) => ({
				basicData: {
					...state.basicData,
					...fields
				}
			})),

		setAdressData: (fields) =>
			set((state) => ({
				adressData: {
					...state.adressData,
					...fields
				}
			})),

		setVisualData: (fields) =>
			set((state) => ({
				visualData: {
					...state.visualData,
					...fields
				}
			})),

		resetForm: () =>
			set({
				basicData: initialBasicData,
				adressData: initialAdressData,
				visualData: initialVisualData
			})

	}));