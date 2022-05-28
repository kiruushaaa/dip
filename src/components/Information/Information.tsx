import cn from 'classnames';

import { ACTIVE_COLOR, VIS_VISITED_NODE_COLOR } from 'helpers/vis';

import global from 'style/global.module.css';
import styles from './Information.module.css';

export const Information = () => (
    <section className={ styles.wrapper } aria-label="Water">
        <h1 className={ styles.title }><span>Dijkstra</span>&apos;s algorithm. Visualization step by step</h1>
        <p>
            Алгоритм <span className={ styles.misc }>Дейкстры</span> находит кратчайшие пути от одной из вершин графа до всех остальных.
            Алгоритм работает только для графов без рёбер отрицательного веса.
        </p>
        <p>
            Граф строится при помощи кнопок
            <span className={ cn(global.btn, global.btnAppend, styles.btn) }>Append node</span>
            и
            <span className={ cn(global.btn, global.btnAppend, styles.btn) }>Append edge</span>,
             которые добавляют вершины и ребра соответственно.
        </p>
        <p>
            <span className={ cn(global.btn, global.btnSuccess, styles.btn) }>Show journey</span>
            показывает пошагово, как работает алгоритм, добавляя псевдоребра между вершинами и закрашивая вершины в некоторый цвет
            (<span style={ { color: ACTIVE_COLOR } }>текущая</span>, <span style={ { color: VIS_VISITED_NODE_COLOR.background } }>посещенная</span>).
        </p>
        <p>
            <span className={ cn(global.btn, global.btnPath, styles.btn) }>Show the shortest path</span>
            покажет кратчаший путь (если существует) из начальной вершины в выбранную конечную.
        </p>
    </section>
);
