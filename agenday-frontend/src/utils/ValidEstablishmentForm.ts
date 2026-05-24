
interface FieldForm {
    value: any;
    errorMessage: string | null;
    isValid: boolean;
}


interface FormData {
    basicInfo: Record<string, FieldForm>;
    address: Record<string, FieldForm>;
    visual: Record<string, FieldForm>;
}


export interface EstablishmentFormValidCallBack {
    title: string;
    message: string;
}


const dicCategory: Record<keyof FormData, string> = {
    basicInfo: "Informações Básicas",
    address: "Endereço",
    visual: "Identidade Visual"
};


export function validEstablishmentForm(data: FormData): true | EstablishmentFormValidCallBack {
    for (const category in data) {
        const categoryKey = category as keyof FormData;
        const fields = data[categoryKey];
        
        for (const fieldName in fields) {
            const field = fields[fieldName];
            
            if (field && field.isValid === false) {
                const translatedName = dicCategory[categoryKey] || categoryKey;
                
                return {
                    title: `Dados Inválidos em: ${translatedName}`,
                    message: field.errorMessage || "Por favor, verifique os dados deste campo."
                };
            }
        }
    }
    
    return true;
}