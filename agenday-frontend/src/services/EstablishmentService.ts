

import type { ApiResponse } from "../types/Api";
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