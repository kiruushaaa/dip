import { ContentWrapper } from 'components/ContentWrapper';
import { Graph } from 'components/Graph';

import styles from './App.module.css';

export const App = () => (
    <main className={ styles.main } aria-label="Graph">
        <ContentWrapper>
            <Graph />
        </ContentWrapper>
    </main>
);
