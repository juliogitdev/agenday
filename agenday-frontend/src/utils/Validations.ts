import { INPUT_ERRORS } from "../constants/InputErros";


export function validateName(name: string): {isValid: boolean, error: string | null} {
	if (name.trim() === "") {return {isValid: false, error: INPUT_ERRORS.NAME.INVALID_CHARACTERS};} 
	else if (name.trim().length < 3) { return {isValid: false, error: INPUT_ERRORS.NAME.TOO_SHORT};} 
	else if (!/^[a-zA-Z\s]+$/.test(name)) { return {isValid: false, error: INPUT_ERRORS.NAME.INVALID_CHARACTERS};} 
	else if (name.trim().length > 50) { return {isValid: false, error: INPUT_ERRORS.NAME.TOO_LONG};
	} else {
		return {isValid: true, error: null};
	}
}


export function validateEmail(email: string): {isValid: boolean, error: string | null} {
	const isValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
	return {
		isValid,
		error: isValid ? null : INPUT_ERRORS.EMAIL.INVALID
	};
}


export function validatePhone(phone: string): {isValid: boolean, error: string | null} {
	const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
	if (phone.trim() === "") {
		return {isValid: false, error: INPUT_ERRORS.PHONE.INVALID_FORMAT};
	} else if (!phoneRegex.test(phone)) {
		return {isValid: false, error: INPUT_ERRORS.PHONE.INVALID_FORMAT};
	} else {
		return {isValid: true, error: null};
	}
}

export function validatePassword(password: string): {isValid: boolean, error: string | null} {
	if (password.length < 8) {
		return {isValid: false, error: INPUT_ERRORS.PASSWORD.TOO_SHORT};
	} else if (!/[A-Z]/.test(password)) {
		return {isValid: false, error: INPUT_ERRORS.PASSWORD.MISSING_UPPERCASE};
	} else if (!/[a-z]/.test(password)) {
		return {isValid: false, error: INPUT_ERRORS.PASSWORD.MISSING_LOWERCASE};
	} else if (!/\d/.test(password)) {
		return {isValid: false, error: INPUT_ERRORS.PASSWORD.MISSING_NUMBER};
	} else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
		return {isValid: false, error: INPUT_ERRORS.PASSWORD.MISSING_SPECIAL_CHAR};
	} else {
		return {isValid: true, error: null};
	}
}