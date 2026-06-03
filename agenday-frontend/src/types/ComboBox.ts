
export type ComboBoxOptionItem = {
	label: string;
	value: string;
};

export type ComboBoxOption = {
	selectedLabel?: string;
	selectedValue?: string;
	options: ComboBoxOptionItem[];
};