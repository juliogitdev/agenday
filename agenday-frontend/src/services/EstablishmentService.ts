

import { EstablishmentFormStore } from "../store/EstablishmentFormStore";
import type { ApiResponse } from "../types/Api";
import type { EstablishmentApiData } from "../types/Estableshment";
import type { UserLogged } from "../types/User";

export type PresignedUrlResponse = {
    uploadUrl: string;
    objectName: string;
};


export const getImageUploadLink = async (
    user: UserLogged | null, 
    establishmentId: string, 
    originalFilename: string): Promise<ApiResponse<PresignedUrlResponse>> => {	

    try {
        const API_URL = import.meta.env.VITE_API_URL;
        const url = `${API_URL}establishment/${establishmentId}/logoUpdate?filename=${encodeURIComponent(originalFilename)}`;        
        const response = await fetch(url, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user?.accessToken}`
            },
        });

        if (!response.ok) { return { statusCode: response.status, responseData: null };}
        const data = await response.json();
        return { statusCode: response.status, responseData: data };
    } catch (error) {  return { statusCode: 0, responseData: null };}
};


export const uploadImage = async (uploadUrl: string, file: File): Promise<ApiResponse<string>> => {
    try {
        const response = await fetch(uploadUrl, { 
            method: "PUT", 
            headers: { "Content-Type": file.type }, 
            body: file
        });
        return { statusCode: response.status, responseData: response.ok ? "Upload success" : null };
    } catch (error) {return { statusCode: 0, responseData: null };}
};



export async function updateEstablishment(user: UserLogged | null, establishmentId: string, requestBody: any): Promise<ApiResponse<any>> {
    if (!user) return { statusCode: 401, responseData: null };
    try {
        const API_URL = import.meta.env.VITE_API_URL;
        const response = await fetch(`${API_URL}establishment/${establishmentId}`, {
            method: 'PATCH',
            credentials: "include",
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user?.accessToken}`
            },
            body: JSON.stringify(requestBody)
        });
        const data = await response.json();
        if (!response.ok) { return { statusCode: response.status, responseData: data };}
        return { statusCode: response.status, responseData: data  };
    } catch (error) {  return { statusCode: 0, responseData: null };}
}

export async function createEstablishment(user: UserLogged | null, requestBody: any): Promise<ApiResponse<any>> {
    if (!user) return { statusCode: 401, responseData: null };
    try {
        const API_URL = import.meta.env.VITE_API_URL;
        const response = await fetch(`${API_URL}establishment/register`, {
            method: 'POST',
            credentials: "include",
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user?.accessToken}`
			},
            body: JSON.stringify(requestBody)
        });

		const data = await response.json();
        if (!response.ok) { return { statusCode: response.status, responseData: data };}
        return { statusCode: response.status, responseData: data  };
    } catch (error) {  return { statusCode: 0, responseData: null };}
}



export const fillEstablishmentForm = (data: EstablishmentApiData) => {
	const { setBasicData, resetForm, setAdressData, setVisualData } = EstablishmentFormStore.getState();
	if (!data) return;
	resetForm();
	
	let parsedPalette = {
		text_color: "#000000",
		back_color: "#ffffff",
		main_color: "#1d4f86"
	};

	if (data.palette && typeof data.palette === 'string') {
		const colors = data.palette.split(';'); 	
		if (colors.length === 3) {
			parsedPalette = {
				text_color: colors[0],
				back_color: colors[1],
				main_color: colors[2]
			};
		}

	} else if (data.palette && typeof data.palette === 'object') {
		parsedPalette = { ...parsedPalette, ...data.palette };
	}

	setBasicData({
		name: { value: data.name || "", errorMessage: null, isValid: !!data.name },
		numberPhone: {value: data.numberPhone || "", errorMessage: null, isValid: !!data.numberPhone},
		category: {
			value: {
				options: [],
				selectedValue: data.category || 'BARBERSHOP',
			},
			errorMessage: null, 
			isValid: !!data.category}
	});

	if (data.address) {
		setAdressData({
			cep: { value: data.address.cep || "", errorMessage: null, isValid: !!data.address.cep },
			state: { value: data.address.state || "", errorMessage: null, isValid: !!data.address.state },
			city: { value: data.address.city || "", errorMessage: null, isValid: !!data.address.city },
			street: { value: data.address.street || "", errorMessage: null, isValid: !!data.address.street },
			number: { value: data.address.number || "", errorMessage: null, isValid: !!data.address.number },
			neighborhood: { value: data.address.neighborhood || "", errorMessage: null, isValid: !!data.address.neighborhood }
		});
	}

	setVisualData({
		template: { value: String(data.template ?? "1"), errorMessage: null, isValid: true },
		slogan: { value: data.slogan || "", errorMessage: null, isValid: !!data.slogan },
		palette: { value: parsedPalette, errorMessage: null, isValid: true },
		image: { value: { file: data.imageUrl }, errorMessage: null, isValid: !!data.imageUrl }
	});
};




export const prepareBodyData = (imageName: string, formData: any) => {
    const coresRaw = [
        formData.visual.palette.value.text_color,
        formData.visual.palette.value.back_color,
        formData.visual.palette.value.main_color
    ];

    const resultadoString = coresRaw.map(cor => cor.replace(/[\n\t\r]/g, "").trim()).join(";");
    return {
        name: formData.basicInfo.name.value,
        slogan: formData.visual.slogan.value,
        numberPhone: formData.basicInfo.numberPhone.value,
        imageUrl: imageName,
		category: formData.basicInfo.category.value?.selectedValue || 'BARBERSHOP',
        template: 1,
        palette: resultadoString,
        addressRequest: {
            cep: formData.address.cep.value,
            state: formData.address.state.value,
            city: formData.address.city.value,
            street: formData.address.street.value,
            number: formData.address.number.value,
            neighborhood: formData.address.neighborhood.value,                  
        }
    };
};