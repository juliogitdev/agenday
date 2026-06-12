
import styles from "./styles/loadingclock.module.css"

export type LoadingClockProps = {
    isLoading: boolean;
    text?: string;
}

export function LoadingClock({isLoading,text }:LoadingClockProps) {
    if (!isLoading) return null;
    return (
        <div className={styles.loadingContainer}>
            <div className={styles.clockWrapper}>
                <div className={styles.clockFace}>
                    <div className={styles.clockCenter}></div>
                    <div className={styles.hourHand}></div>
                    <div className={styles.minuteHand}></div>
                </div>
            </div>
            {text && <p className={styles.loadingText}>{text}</p>}
        </div>
    );
};
