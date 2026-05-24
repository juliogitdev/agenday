
import { cloneElement, useState } from "react";
import styles from "./styles/formstep.module.css";
import type { FormStepProps } from "../../types/MultStepForm";
import { Check, CircleArrowLeft, CircleArrowRight, CircleX } from "lucide-react";


export function FormStep({forms, onFinished, title, type, close, asError}: FormStepProps) {
    const [currentStep, setCurrentStep] = useState(0);
	const [formsData,setFormsData] = useState({});
	const [currentValid,setCurrentValid] = useState(false);

    const totalSteps = forms.length;
    const isFirstStep = currentStep === 0;
    const isLastStep = currentStep === totalSteps - 1;

    function handleNext()  { if (isLastStep){ return;} setCurrentStep(prev => prev + 1); }
    function handlePrevious() { if (isFirstStep){ return;} setCurrentStep(prev => prev - 1); }
	function handleFinish() { onFinished(formsData); }

    return (
        <div className={`${styles.multistepForm} ${asError ? styles.asError : ""}`}>
            <header className={styles.multistepFormHeader}>
                <h2 className={styles.multistepFormTitle}> {type === "edit" ? "Editar " + (title || ""): "Novo " + (title || "")}</h2>
                <button className={styles.multistepFormCloseButton} onClick={()=>close()}> ✕ </button>
            </header>

            <section className={styles.multistepFormSteps}>
                {forms.map((step, index) => {
                    const active = index <= currentStep;
                    return (
                        <div key={step.title} className={styles.step}>
                            <div className={`${styles.circle} ${active ? styles.active : ""}`}> {index + 1}</div>
                            <span className={styles.stepTitle}> {step.title} </span>
                        </div>
                    );
                })}
            </section>

            <main className={styles.content}>  
				{
					cloneElement(forms[currentStep].content, {
						onFormChange: (data:any, valid:boolean) => {
							setCurrentValid(valid);
							setFormsData(prev=>({...prev, [forms[currentStep].name]:data}));
						},
					})
				}
			</main>

			<footer className={styles.footer}>
				{ isFirstStep ? (
					<button 
						onClick={()=> close()} 
						className={styles.secondaryButton}> 
						<CircleX className={styles.buttonIcon} /> cancelar
					</button>
					) : (
					<button 
						onClick={handlePrevious} 
						disabled={isFirstStep && !currentValid} 
						className={styles.secondaryButton}> 
						<CircleArrowLeft className={styles.buttonIcon} /> Voltar
					</button>
					)
				}

				{!isLastStep ? ( 
					<button 
						onClick={handleNext} 
						className={styles.primaryButton}> Próximo <CircleArrowRight className={styles.buttonIcon} />
					</button>
				) : (
					<button 
						onClick={handleFinish} 
						className={styles.primaryButton}> {type === "edit" ? "Salvar" : "Criar"} <Check className={styles.buttonIcon} />
					</button>
				)}
			</footer>
        </div>
    );
}