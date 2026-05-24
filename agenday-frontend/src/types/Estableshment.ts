import type { ColorPickerData, InputCallback, UploadLogoValue } from "./Inputs";



export type EstablishmetTableType = {
	name: string;
	address: string;
	city: string;
	uf: string;
	manager: string;
	teamNumber: number;
	logo: string;
};

export type ClientEstableshimentCardType = {
	name: string;
	profilePicture: string;
	numberOfAppointments: number;
	amount: number;
	dateOfFirstAppointment: string;
};

export type EstablishmenteDashboardCardType = {
	id: string;
	name: string;
	slogan: string;
	slug: string;
	logo: string;
	pallet: string;
	template: number;
	mensalAmount: number;
	servicesPerWeek: number;
	topClientes:ClientEstableshimentCardType[];
	bestServices: BestServicesEstablishmentCardType[];

};

export interface EstablishmentData {
    name: string;
    slogan: string;
    numberPhone: string;
    imageUrl: string;
    template: number;
    palette: string;

    addressRequest: {
        cep: string;
        state: string;
        city: string;
        street: string;
        number: string;
    };
}


// tipos para formularios
export type EstablishmentForm_basic = {
    name: InputCallback;
    numberPhone: InputCallback;
    category: InputCallback;
}

export type EstablishmentForm_adress = {
    cep: InputCallback;
    state: InputCallback;
    city: InputCallback;
    street: InputCallback;
    number: InputCallback;
    neighborhood: InputCallback;
}

export type EstablishmentForm_visual = {
    template: InputCallback;
	slogan: InputCallback;
    palette: InputCallback<ColorPickerData>;
    image: InputCallback<UploadLogoValue>;
}


export type BestServicesEstablishmentCardType = {
	name: string;
	monthlyAverageOfAchievements: number;
	amount: number;
};

