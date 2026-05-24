

export interface InputCallback<T = string> {
	value: T;
	errorMessage: string | null;
	isValid: boolean;
}

export interface InputProps<T = any> {
	showRecovery?: boolean;
	showError?: boolean;
	showBanner?: boolean;
	label?: string;
	placeholder?: string;
	disabled?: boolean;
	required?: boolean;
	initialValue?: any;
	onChangeField?: (value: InputCallback<T>) => void;
}

export interface ColorPickerData {
    text_color: string;
    back_color: string;
    main_color: string;
}


export interface UploadLogoValue { file: File | string | null;}