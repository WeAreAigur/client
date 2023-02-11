import s from './Equalizer.module.css';

export interface EqualizerProps {}

export function Equalizer(props: EqualizerProps) {
	return (
		<div className={s['equalizer-container']}>
			<ol className={s['equalizer-column']}>
				<li className={s['colour-bar']}></li>
			</ol>
			<ol className={s['equalizer-column']}>
				<li className={s['colour-bar']}></li>
			</ol>
			<ol className={s['equalizer-column']}>
				<li className={s['colour-bar']}></li>
			</ol>
			<ol className={s['equalizer-column']}>
				<li className={s['colour-bar']}></li>
			</ol>
			<ol className={s['equalizer-column']}>
				<li className={s['colour-bar']}></li>
			</ol>
		</div>
	);
}
