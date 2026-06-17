
import { CalendarDays, DollarSign } from "lucide-react";
import styles from "./styles/landingpage.module.css";
import { Link,useNavigate } from "react-router-dom";
import PlanCard, { type PlanData } from "../components/cards/PlanCard";
import { motion } from "motion/react";
import { useEffect, useRef } from "react";

export function LandingPage() {
	
	const plansRef = useRef<HTMLElement | null>(null);
	const navigate = useNavigate();

	useEffect(() => {
		if(window.innerWidth > 768){ return; }
		if(plansRef.current){
			const container = plansRef.current;
			container.scrollLeft = (container.scrollWidth - container.clientWidth) / 2;
		}
	}, []);

	const onChosePlan = (plan: PlanData) => {
		void plan; // pro linter não reclamar, depois usamos
		navigate("/home");
	};

	return (
		<div className={styles.page}>
			<header className={styles.header}>
				<div className={styles.logo}> 
					<motion.img 
						src="/resource/icons/agenday_logo_v1.svg" alt="Agenday" className={styles.logoImage}
						initial={{ opacity:0, x:50}}
						animate={{ opacity:1, x:0}}
						transition={{ duration:1}}
					/>
				</div>
				<nav className={styles.navActions}>
					<Link to="/login">
						<motion.button
							whileHover={{ scale:1.05}}
							whileTap={{ scale:.95}}
							className={styles.btnLink}
							>Entrar
						</motion.button>
					</Link>
					<Link to="/signup">
						<motion.button
							whileHover={{ scale:1.05}}
							whileTap={{ scale:.95}}
							className={styles.primaryButtonSmall}
							>Criar conta
						</motion.button>
					</Link>
				</nav>
			</header>

			<motion.div
				initial={{ opacity: 0, y: 50 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ 
					duration: 0.7
				}}
			>
				<section className={styles.hero}>
					<div>
						<h1 className={styles.heroTitle}> 
							Sua agenda viva, <br />
							<span>em movimento.</span>
						</h1>
						<p className={styles.heroDescription}> A precisão de um calendário com o dinamismo que seu negócio exige.</p>
						<div className={styles.heroButtons}>
							<Link to="/signup">
								<motion.button
									whileHover={{ scale:1.05}}
									whileTap={{ scale:.95}}
									className={styles.primaryButton}
								>Criar minha conta
								</motion.button>
							</Link>
							<Link to="/signup">
								<motion.button
									whileHover={{ scale:1.05}}
									whileTap={{ scale:.95}}
									className={styles.secondaryButton}
								>Faça um teste grátis
								</motion.button>
							</Link>
						</div>
					</div>

					<div className={styles.heroImage}>
						<motion.img 
							src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80"
							initial={{ opacity:0, x:50}}
							animate={{ opacity:1, x:0}}
							transition={{ duration:1}}
						/>
					</div>
				</section>
			</motion.div>
			<h2 className={styles.titles}>Ferramentas que respiram por você</h2>

			<section className={styles.features}>				
				<div className={styles.featureCard}>
					<span className={styles.featureIcon}><CalendarDays /></span>
					<h3 className={styles.featureTitle}> Agenda Inteligente</h3>
					<p  className={styles.featureDescp}>
						Visualize horários, encaixes automáticos e organize
						seu dia com mais eficiência.
					</p>
				</div>
				<div className={styles.featureImageCard}>
					<motion.div 
						initial={{ opacity:0, y:50}}
						whileInView={{ opacity:1,y:0}}
						viewport={{once:true}}
						transition={{duration:.5}}
					>
						<motion.img 
							src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=500&q=80"
							className={styles.featureImage}
							initial={{ opacity:0, rotate: 0, x:50}}
							animate={{ opacity:1, rotate: 4, x:0}}
							transition={{ duration:1}}
						/>
					</motion.div>
				</div>
				<div className={`${styles.featureImageCard} ${styles.lastImage}`}> 
					<motion.div 
						initial={{ opacity:0, y:50}}
						whileInView={{ opacity:1,y:0}}
						viewport={{once:true}}
						transition={{duration:.5}}
					>
						<motion.img 
							src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=500&q=80"
							className={styles.featureImage}
							initial={{ opacity:0, rotate: 0, x:-50}}
							animate={{ opacity:1, rotate: 0, x:0}}
							transition={{ duration:1}}
						/>
					</motion.div>
				</div>

				<div className={styles.featureCard}>
					<span className={styles.featureIcon}><DollarSign /></span>
					<h3 className={styles.featureTitle}> Controle Financeiro </h3>
					<p  className={styles.featureDescp}>
						Registre entradas e acompanhe seu faturamento sem planilhas complexas. 
						Relatórios automáticos direto no seu dashboard.
					</p>
				</div>
			</section>

			<h2 className={styles.titles}>Resultados que geramos até hoje</h2>
			<motion.div 
				initial={{ opacity:0, y:50}}
				whileInView={{ opacity:1,y:0}}
				viewport={{once:true}}
				transition={{duration:.5}}
			>
				<section className={styles.metrics}>
					<div className={styles.metricCard}>
						<h2 className={styles.metricCardTitle}>+1.200</h2>
						<span className={styles.metricCardLabel}>Profissionais Conectados</span>
					</div>

					<div className={styles.metricCard}>
						<h2 className={styles.metricCardTitle}>+15.000</h2>
						<span className={styles.metricCardLabel}>Agendamentos Realizados</span>
					</div>
					<div className={styles.metricCard}>
						<h2 className={styles.metricCardTitle}>98%</h2>
						<span className={styles.metricCardLabel}>Índice de Retenção</span>
					</div>	
				</section>
			</motion.div>

			<h2 className={styles.titles}>Planos para cada tipo de empreendedor</h2>
			<h2 className={styles.subtitles}>Transparência total, sem taxas escondidas.</h2>
			
			<motion.div 
				initial={{ opacity:0, y:50}}
				whileInView={{ opacity:1,y:0}}
				viewport={{once:true}}
				transition={{duration:.5}}
			>
				<section className={styles.plansContainer} ref={plansRef}>
					<PlanCard
						planTitle="Free"
						planPrice={0.00}
						planBeneficts={[
							"Até 50 Agendamentos / Més",
							"Cadastro básico",
						]}
						buttonType="outline"
						isRecommended={false}
						width="290px"
						height="340px"
						onClick={onChosePlan}
					/>
					<PlanCard
						planTitle="Pro"
						planPrice={40.90}
						planBeneficts={[
							"Agendamentos ilimitados",
							"Dashboard financeiro",
							"Relatórios em PDF",
						]}
						buttonType="solid"
						isRecommended={true}
						width="290px"
						height="340px"
						onClick={onChosePlan}
					/>
					<PlanCard
						planTitle="Business"
						planPrice={99.99}
						planBeneficts={[
							"Benefícios pro",
							"Multiplos profissionais",
							"Multiplos estabelecimentos",
						]}
						buttonType="outline"
						isRecommended={false}
						width="290px"
						height="340px"
						onClick={onChosePlan}
					/>
				</section>
			</motion.div>

			<h2 className={styles.titles}>Pronto para transformar sua rotina?</h2>
			<h2 className={styles.subtitles}>Crie sua conta, leva menos de 2 minutos</h2>

			<footer className={styles.footer}> © 2026 Agenday Platform </footer>
		</div>
	);
}