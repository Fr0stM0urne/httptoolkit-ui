import * as React from 'react';
import { inject, observer } from 'mobx-react';

import { styled } from '../../styles';

import { SendStore } from '../../model/send/send-store';

import { SplitPane } from '../split-pane';
import { RequestPane } from './request-pane';
import { ResponsePane } from './response-pane';

const SendPageContainer = styled.div`
    height: 100vh;
    position: relative;
`;

@inject('sendStore')
@observer
export class SendPage extends React.Component<{
    sendStore?: SendStore
}> {

    render() {
        const { requestInput, sendRequest } = this.props.sendStore!;

        return <SendPageContainer>
            <SplitPane
                split='vertical'
                primary='second'
                defaultSize='50%'
                minSize={300}
                maxSize={-300}
            >
                <RequestPane
                    requestInput={requestInput}
                    sendRequest={sendRequest}
                />
                <ResponsePane
                />
            </SplitPane>
        </SendPageContainer>;
    }

}