import cn from 'classnames';

import global from 'style/global.module.css';
import styles from './Information.module.css';

export const Information = () => (
    <section className={ styles.wrapper } aria-label="Water">
        <h1 className={ styles.title }><span>Dijkstra</span>&apos;s algorithm. Visualization step by step</h1>
        <p>
            Чтобы построить граф, используются кнопки
            <span className={ cn(global.btn, global.btnAppend, styles.btn) }>Append node</span>
            и
            <span className={ cn(global.btn, global.btnAppend, styles.btn) }>Append edge</span>
            для добавления вершин и ребер соответственно.
        </p>
    </section>
);
