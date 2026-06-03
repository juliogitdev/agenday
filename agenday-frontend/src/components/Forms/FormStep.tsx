
import { cloneElement, useState } from "react";
import styles from "./styles/formstep.module.css";
import type { FormStepProps } from "../../types/MultStepForm";
import { Check, CircleArrowLeft, CircleArrowRight, CircleX, Loader } from "lucide-react";
import { EstablishmentFormStore } from "../../store/EstablishmentFormStore";

export function FormStep({ forms, onFinished, title, type, close, isLoading, isVisible, loadingText }: FormStepProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [formsData, setFormsData] = useState({});
    const [currentValid, setCurrentValid] = useState(false);
	const { resetForm } = EstablishmentFormStore();

    const totalSteps = forms.length;
    const isFirstStep = currentStep === 0;
    const isLastStep = currentStep === totalSteps - 1;

    function handleNext() {  if (isLastStep || !currentValid) return;  setCurrentStep(prev => prev + 1); }
    function handlePrevious() {  if (isFirstStep) return;  setCurrentStep(prev => prev - 1); }
    function handleFinish() {  if (!currentValid) return; onFinished(formsData); }

    return isVisible ? (
        <div className={styles.multistepForm}>
            {isLoading && ( 
                <div className={styles.formLoading}> 
                    <Loader className={styles.formLoadingIcon}/>
                    <p className={styles.formLoadingText}>{loadingText}</p> 
                </div>
            )}

            <header className={styles.multistepFormHeader}>
                <h2 className={styles.multistepFormTitle}> 
                    {type === "edit" ? "Editar " + (title || "") : "Novo " + (title || "")}
                </h2>
                <button 
                    disabled={isLoading}
                    className={styles.multistepFormCloseButton} 
                    onClick={() => close()}
                > ✕ </button>
            </header>

            <section className={styles.multistepFormSteps}>
                {forms.map((step, index) => {
                    const active = index <= currentStep;
                    return (
                        <div key={step.title} className={styles.step}>
                            <div className={`${styles.circle} ${active ? styles.active : ""}`}> 
                                {index + 1}
                            </div>
                            <span className={styles.stepTitle}> {step.title} </span>
                        </div>
                    );
                })}
            </section>

            <main className={styles.content} style={isLoading ? { pointerEvents: "none" } : {}}>  
                {
                    cloneElement(forms[currentStep].content, {
                        onFormChange: (data: any, valid: boolean) => {
                            setCurrentValid(valid);
                            setFormsData(prev => ({ ...prev, [forms[currentStep].name]: data }));
                        },
                    })
                }
            </main>

            <footer className={styles.footer}>
                {isFirstStep ? (
                    <button 
                        onClick={()=>{resetForm(); close()}} 
                        disabled={isLoading}
                        className={styles.secondaryButton}
                    > 
                        <CircleX className={styles.buttonIcon} /> Cancelar
                    </button>
                ) : (
                    <button 
                        onClick={handlePrevious} 
                        disabled={isLoading}
                        className={styles.secondaryButton}
                    > 
                        <CircleArrowLeft className={styles.buttonIcon} /> Voltar
                    </button>
                )}

                {!isLastStep ? ( 
                    <button 
                        onClick={handleNext} 
                        disabled={!currentValid || isLoading}
                        className={`${styles.primaryButton} ${!currentValid ? styles.buttonDisabled : ""}`}
                    > 
                        Próximo <CircleArrowRight className={styles.buttonIcon} />
                    </button>
                ) : (
                    <button 
                        onClick={handleFinish} 
                        disabled={!currentValid || isLoading}
                        className={`${styles.primaryButton} ${!currentValid ? styles.buttonDisabled : ""}`}
                    > 
                        {type === "edit" ? "Salvar" : "Criar"} <Check className={styles.buttonIcon} />
                    </button>
                )}
            </footer>
        </div>
    ) : null;
}