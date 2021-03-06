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
        <ul>
            <li>
                Граф строится при помощи кнопок
                <span style={ { gap: 0 } } className={ cn(global.btn, global.btnAppend, styles.btn) } />
                и
                <span className={ cn(global.btn, global.btnAppend, styles.btn) }>Append edge</span>,
                которые добавляют вершины и ребра соответственно
            </li>
            <li>
                Секция <strong>Amount of nodes</strong> позволяет выбирать количество вершин
            </li>
            <li>
                <span className={ cn(global.btn, global.btnSuccess, styles.btn) }>Show journey</span>
                показывает пошагово, как работает алгоритм, добавляя псевдоребра между вершинами и закрашивая вершины в некоторый цвет
                (<span style={ { color: ACTIVE_COLOR } }>текущая</span>, <span style={ { color: VIS_VISITED_NODE_COLOR.background } }>посещенная</span>)
                <ul>
                    <li>
                        Параметр <strong>Show journey click-by-click</strong> позволяет выбирать, каким образом будет происходить демонстрация:
                        автоматически или по нажатию кнопки <span className={ cn(global.btn, global.btnNext, styles.btn) }>Next step</span>
                    </li>
                    <li>
                        <span className={ cn(global.btn, global.btnStop, styles.btn) }>Stop journey</span>
                        позволяет прекратить выполнение демонстрация. Эта кнопка появится после начала демонстрации
                    </li>
                </ul>
            </li>
            <li>
                <span className={ cn(global.btn, global.btnPath, styles.btn) }>Show the shortest path</span>
                покажет кратчаший путь (если существует) из начальной вершины в выбранную конечную
            </li>
            <li>
                Для сброса меток используется <span className={ cn(global.btn, global.btnDanger, styles.btn) }>Reset a draw</span>
            </li>
        </ul>
    </section>
);
