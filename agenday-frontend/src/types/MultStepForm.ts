
import type { ReactElement } from "react";


export interface FormChildProps<T = any>{
    onFormChange?:( data:T, valid:boolean ) => void;
}

export interface FormStepChild {
    title:string;
    name:string;
    content:ReactElement<FormChildProps>;
}

export interface FormStepProps {
    title: string;
    type: "create" | "edit";
    forms: FormStepChild[];
	close: () => void;
    onFinished: (data:any) => void;
    asError?: boolean;
	isLoading?: boolean;
}