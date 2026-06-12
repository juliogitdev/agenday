

import styles from './styles/combobox.module.css';
import type { InputProps } from '../../types/Inputs';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { useState } from 'react';
import type { ComboBoxOption, ComboBoxOptionItem } from '../../types/ComboBox';

export function ComboBox({onChangeField, label, initialValue}:InputProps<ComboBoxOption>){
	const [showOption, setShowOption] = useState(false);
	const [selectedLabel, setSelectedLabel] = useState(initialValue.value?.selectedLabel || 'Selecione uma opção');

	const updateValues = (option: ComboBoxOptionItem) => {		
		onChangeField?.({
			value: {
				...initialValue,
				selectedLabel: option.label,
				selectedValue: option.value
			},
			errorMessage: null,
			isValid: true
		});

		setSelectedLabel(option.label)
		setShowOption(false);
	};
	return (
		<div className={styles.comboBox}>
			<label className={styles.comboLabel}> {label}</label>
			<div className={styles.comboField} onClick={() => setShowOption(!showOption)}>
				<span className={styles.selectedOption}>{selectedLabel}</span>
				<button className={styles.comboButtonIcon} type="button">
					{showOption ? <ArrowUp /> : <ArrowDown />}
				</button>
			</div>
			{ showOption && (
				<ul className={styles.comboBoxItemsContainer}>
					{initialValue?.value.options?.map((option:ComboBoxOptionItem) => (
						<li className={styles.comboItem} key={option.value} onClick={() => updateValues(option)}>{option.label}</li>
					))}
				</ul>
			)}
		</div>
	);
}
