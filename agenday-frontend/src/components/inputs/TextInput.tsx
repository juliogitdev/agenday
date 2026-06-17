
import { useEffect, useState } from 'react';
import styles from './styles/nameInput.module.css';
import { valid } from '../../utils/Validations';
import type { InputProps } from '../../types/Inputs';

export function TextInput({label, _height=0, placeholder,initialValue, onChangeField}: InputProps) {
	const [error, setError] = useState<string | null>(null);
	const [value, setValue] = useState<string>(initialValue || "");

	

	const onChangeHandler = (value:any) => {
		const validationError = valid.textField(value);
		setError(validationError);
		setValue(value);
		onChangeField?.({ 
			value: value, 
			errorMessage: validationError, 
			isValid: validationError === null 
		});
	};

	useEffect(()=>{
		if( initialValue && initialValue.length > 0) {
			setValue(initialValue);
			const validationError = valid.textField(initialValue);
			setError(validationError);
		}
	},[initialValue]);

	return (
		<div className={styles.nameInput}>
			<label htmlFor="name" className={styles.nameLabel}>{label}</label>
            { _height < 40 
                ? <input
    				className={styles.nameField}
    				type="text"
    				id="name"
	    			name="name"
		    		value={value}
			    	onChange={(e)=>onChangeHandler(e.target.value)}
				    placeholder={placeholder}
			    />
                : <textarea
                    style={_height > 0 ? {height: `${_height}px`} : {}}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e)=> onChangeHandler(e.target.value)}
                    className={styles.textArea}
                ></textarea>
                    
            } 
			<span className={styles.nameError}>{error}</span>
		</div>
	);
}
