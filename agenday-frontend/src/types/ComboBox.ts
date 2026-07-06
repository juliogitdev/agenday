
export type ComboBoxOptionItem = {
	label: string;
	value: string;
	data?: any;
};

export type ComboBoxOption = {
	selectedLabel?: string;
	selectedValue?: string;
	options: ComboBoxOptionItem[];
};