
import { useCallback, useEffect, useState } from 'react';
import styles from './styles/choseplan.module.css';
import type { PlanData } from '../cards/PlanCard';
import { CheckCircle2, Loader, TriangleAlert } from 'lucide-react'; 
import PlanCard from '../cards/PlanCard';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow, Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';


export function ChosePlan({onChose, isVisible}: {onChose: (planId: string | null) => void, isVisible: boolean}) {
	const [plans, setPlans] = useState<PlanData[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [asErrorApiCommunication, setAsErrorApiCommunication] = useState(false);

	const benefict_map = {
		"Pro":    ["Agendamentos ilimitados", "Cadastro básico", "Dashboard financeiro", "Relatórios em PDF"],
		"Free":   ["Agendamentos ilimitados", "Cadastro básico", "Dashboard financeiro"],
		"Basic":  ["Agendamentos ilimitados", "Cadastro básico", "Dashboard financeiro", "Relatórios em PDF"]
	};

	const fetchPlans = useCallback(async () => {
		setIsLoading(true);
		try {
			const API_URL = import.meta.env.VITE_API_URL;
			const response = await fetch(`${API_URL}plans`);

			if (response.ok && response.status === 200) {
				const tmp_plan: PlanData[] = [];
				const response_data = await response.json();

				if (response_data) {
					response_data.forEach((plan: any) => {
						tmp_plan.push({
							planId: plan.id,
							icon: null,
							planTitle: plan.name,
							planPrice: plan.price,
							planBeneficts: benefict_map[plan.name as keyof typeof benefict_map],
							buttonType: plan.buttonType
						});
					});
					setPlans(tmp_plan);
					setIsLoading(false);
					return;
				}
			}
			throw new Error('No plans found');
		} catch {
			setIsLoading(true);
			setAsErrorApiCommunication(true);
		}	
	}, []);

	useEffect(() => { fetchPlans(); }, [fetchPlans]);

	return (
		isVisible && (
			<div className={styles.chosePlanContainer}>
				{isLoading && ( 
					<div className={styles.planLoading}> 
						{ !asErrorApiCommunication ? (
							<div className={styles.planLoadingContent}>
								<Loader className={styles.planLoadingIcon}/>
								<p className={styles.planLoadingText}>Por favor, aguarde...</p> 
							</div>
							) : (
							<div className={styles.planApiErrorContainer}>
								<TriangleAlert  className={styles.planApiErrorIcon}/>
								<p className={styles.planApiErrorLoadingText}>Não foi possível carregar os planos, tente novamente mais tarde.</p> 
								<div className={styles.planApiButtonsContainer}>
									<button className={styles.planApiCancelButton} onClick={() => onChose(null)}>Voltar</button>
								</div>
							</div>
						)}
					</div>
				)}

				<button className={styles.closeButton} onClick={() => onChose(null)}>x</button>
				
				

				<div className={styles.splitLayout}>
					<div className={styles.featuresColumn}>
						<img className={styles.featuresColumnAgendayLogo} src="resource/icons/agenday_logo_v1.svg" alt="agenday logo"/>
						<h2 className={styles.featuresTitle}>Por que se tornar Profissional?</h2>
						<p className={styles.featuresDescription}>
							Desbloqueie o poder total de gestão do Agenday
							e leve o controle do seu negócio para outro nível.
						</p>
						<h3 className={styles.featuresSubtitle}>com uma conta Profissional você tem acesso a:</h3>
						<ul className={styles.featuresList}>
							<li><CheckCircle2 size={16} className={styles.featureIcon}/> <span>Controle total de faturamento e fluxo de caixa</span></li>
							<li> <CheckCircle2 size={16} className={styles.featureIcon}/> <span>Gestão de equipe e horários de funcionários</span></li>
							<li><CheckCircle2 size={16} className={styles.featureIcon}/> <span>Página pública exclusiva para seus clientes agendarem</span></li>
						</ul>

						<span className={styles.featuresCta}>
							Oque você está esperando?, escolha um dos nossos planos e se torne um Profissional !
						</span>
					</div>

					<div className={styles.carouselColumn}>
						<Swiper
							modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
							effect="coverflow"
							coverflowEffect={{ slideShadows: false, rotate: 10, stretch: 0, depth: 50, modifier: 1 }}
							centeredSlides={true}
							grabCursor={true}
							slidesPerView={1}
							loop={true}
							autoplay={{ delay: 4000, disableOnInteraction: true }}
							navigation={{ nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" }}
							pagination={{ el: `.${styles.customPagination}`, clickable: true }}
							className={styles.mySwiper}
						>
							{plans.map((plan) => (
								<SwiperSlide key={plan.planId} className={styles.swiperSlide}>
									<PlanCard  
										planId={plan.planId}
										icon={plan.icon} 
										planTitle={plan.planTitle}
										planPrice={plan.planPrice} 
										planBeneficts={plan.planBeneficts}
										buttonType={plan.buttonType} 
										onClick={() => onChose(plan.planId || "")}
									/>
								</SwiperSlide>
							))}
						</Swiper>
						<div className={styles.customPagination}></div>
					</div>
				</div>
			</div>
		)
	);
}