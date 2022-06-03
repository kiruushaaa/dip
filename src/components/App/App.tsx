import { ContentWrapper } from 'components/ContentWrapper';
import { Graph } from 'components/Graph';
import { Information } from 'components/Information';

import styles from './App.module.css';

export const App = () => {
    return (
        <main className={ styles.main } aria-label="Graph">
            <ContentWrapper>
                <Information />
                <Graph />
            </ContentWrapper>
        </main>
    );
};
