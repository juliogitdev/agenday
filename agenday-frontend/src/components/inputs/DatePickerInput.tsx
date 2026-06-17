import React, { useEffect, useState } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { ptBR } from 'date-fns/locale/pt-BR';
import type { InputProps } from '../../types/Inputs';
import styles from './styles/datepicker.module.css';

// Importa o CSS base da biblioteca para podermos sobrescrever via CSS Modules
import 'react-datepicker/dist/react-datepicker.css';

// Registra o idioma português para o calendário
registerLocale('pt-BR', ptBR);

// Estendemos o InputProps caso queira passar configurações específicas de bloqueio, 
// mas mantendo as propriedades padrão (label, placeholder, onChangeField, initialValue)
interface DatePickerProps extends Omit<InputProps, 'initialValue'> {
	initialValue?: Date | null; // Alterado para Date para facilitar o uso com a biblioteca
	excludeDates?: Date[];      // Dias específicos bloqueados (ex: feriados)
}

export function DatePickerInput({ onChangeField, label, placeholder, initialValue = null, excludeDates = [] }: DatePickerProps) {
	const [error, setError] = useState<string | null>(null);
	const [value, setValue] = useState<Date | null>(initialValue);

	// Validação interna simples (Exemplo: não permitir campo vazio se for obrigatório)
	const validateDate = (date: Date | null): string | null => {
		if (!date) return "A data e horário são obrigatórios.";
		
		// Impede que o usuário selecione uma data retroativa (passada) por segurança
		if (date < new Date()) {
			return "Não é possível selecionar uma data passada.";
		}
		return null;
	};

	const handleChange = (date: Date | null) => {
		const validationError = validateDate(date);

		setValue(date);
		setError(validationError);

		// Retorna no mesmo padrão do seu EmailInput
		onChangeField?.({
			value: date ? date.toISOString() : "", // Retorna como string ISO para o seu backend/store
			errorMessage: validationError,
			isValid: validationError === null
		});
	};

	// Sincroniza o valor inicial caso ele venha de forma assíncrona (do Supabase ou Store)
	useEffect(() => {
		if (initialValue) {
			setValue(initialValue);
			const validationError = validateDate(initialValue);
			setError(validationError);
		}
	}, [initialValue]);

	// Bloqueia domingos por padrão (regradinho de negócio comum para prestadores de serviço)
	const isWeekday = (date: Date) => {
		const day = date.getDay();
		return day !== 0; 
	};

	const inputClass = error ? `${styles.dateField} ${styles.dateFieldError}` : styles.dateField;

	return (
		<div className={styles.datePickerInput}>
			<label className={styles.dateLabel}>{label || 'Data e Horário'}</label>
			
			<div className={styles.pickerWrapper}>
				<DatePicker
					selected={value}
					onChange={handleChange}
					locale="pt-BR"
					dateFormat="dd/MM/yyyy - HH:mm"
					placeholderText={placeholder || "Selecione o dia e hora"}
					
					// Controles de Seleção de Hora integrados
					showTimeSelect
					timeFormat="HH:mm"
					timeIntervals={30}
					timeCaption="Horário"
					
					// Validações nativas aplicadas
					minDate={new Date()}
					filterDate={isWeekday}
					excludeDates={excludeDates}
					
					// Classes CSS para estilização controlada
					className={inputClass}
					calendarClassName={styles.customCalendar}
				/>
			</div>

			<span className={styles.dateError} style={{ visibility: error ? 'visible' : 'hidden' }}>
				{error}
			</span>
		</div>
	);
}